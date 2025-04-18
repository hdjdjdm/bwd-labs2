import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import EventDto, { EventCreateUpdateDto } from '@dtos/EventDto.ts';
import {
    createEvent,
    deleteEvent as deleteEventApi,
    getEvents,
    restoreEvent as restoreEventApi,
    updateEvent as updateEventApi,
} from '@api/eventService.ts';
import { parseError } from '@utils/errorUtils.ts';
import { showCustomToast } from '@utils/customToastUtils.ts';
import { RootState } from '@app/store.ts';
import { EventPageCategory } from '@/types';

interface EventsState {
    allEvents: EventDto[];
    filteredEvents: EventDto[];
    loading: boolean;
    error: string | null;
}

const initialState: EventsState = {
    allEvents: [],
    filteredEvents: [],
    loading: false,
    error: null,
};

export const fetchEvents = createAsyncThunk<EventDto[]>(
    'events/getEvents',
    async (_, { rejectWithValue }) => {
        try {
            return await getEvents();
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
            return rejectWithValue(errorMessage);
        }
    },
);

export const addEvent = createAsyncThunk<
    EventDto,
    EventCreateUpdateDto,
    { rejectValue: string }
>(
    'events/addEvent',
    async ({ title, description, date, isPublic }, { rejectWithValue }) => {
        try {
            return await createEvent({
                title,
                description,
                date,
                isPublic,
            });
        } catch (e) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
            return rejectWithValue(errorMessage);
        }
    },
);

export const updateEvent = createAsyncThunk<
    EventDto,
    { id: number; eventData: Partial<EventDto> },
    { state: RootState; rejectValue: string }
>('events/updateEvent', async ({ id, eventData }, { rejectWithValue }) => {
    try {
        return await updateEventApi(id, eventData);
    } catch (e: unknown) {
        const { status, errorMessage } = parseError(e);
        showCustomToast(errorMessage, 'error', status.toString());
        return rejectWithValue(errorMessage);
    }
});
//todo при изменении public

export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async (
        { id, isHardDelete }: { id: number; isHardDelete: boolean },
        { rejectWithValue },
    ) => {
        try {
            const result = await deleteEventApi(id, isHardDelete);
            return { id, isHardDelete, result };
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
            return rejectWithValue(errorMessage);
        }
    },
);

export const restoreEvent = createAsyncThunk(
    'events/restoreEvent',
    async ({ id }: { id: number }, { rejectWithValue }) => {
        try {
            const result = await restoreEventApi(id);
            return { id, result };
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
            return rejectWithValue(errorMessage);
        }
    },
);

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        filterEvents(
            state,
            action: PayloadAction<{
                withDeleted: boolean;
                chosenCategory: EventPageCategory;
                userId?: number;
            }>,
        ) {
            const { withDeleted, chosenCategory, userId } = action.payload;
            state.filteredEvents = state.allEvents.filter((event) => {
                const isDeletedOk = withDeleted || !event.deletedAt;
                const isCategoryOk =
                    chosenCategory === 'public' ||
                    (chosenCategory === 'my' && event.createdBy.id === userId);

                return isDeletedOk && isCategoryOk;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchEvents.fulfilled,
                (state, action: PayloadAction<EventDto[]>) => {
                    state.loading = false;
                    state.allEvents = action.payload;
                },
            )
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ?? 'Ошибка при загрузке событий';
            });
        builder
            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                addEvent.fulfilled,
                (state, action: PayloadAction<EventDto>) => {
                    const event = action.payload;
                    state.allEvents.push(event);
                    showCustomToast(
                        `Событие '${event.title} добавлено`,
                        'success',
                    );
                },
            );
        builder
            .addCase(
                updateEvent.fulfilled,
                (state, action: PayloadAction<EventDto>) => {
                    state.loading = false;
                    const updatedEvent = action.payload;
                    const index = state.allEvents.findIndex(
                        (event) => event.id === updatedEvent.id,
                    );
                    if (index !== -1) {
                        state.allEvents[index] = updatedEvent;
                        showCustomToast(
                            `Событие ${updatedEvent.title} успешно изменено`,
                            'success',
                        );
                    }
                },
            )
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                showCustomToast(state.error, 'error');
            });
        builder
            .addCase(deleteEvent.fulfilled, (state, action) => {
                const { id, isHardDelete, result } = action.payload;
                if (isHardDelete) {
                    state.allEvents = state.allEvents.filter(
                        (event) => event.id !== id,
                    );
                } else {
                    const eventIndex = state.allEvents.findIndex(
                        (event) => event.id === id,
                    );
                    if (eventIndex !== -1) {
                        state.allEvents[eventIndex].deletedAt =
                            new Date().toISOString();
                    }
                }
                showCustomToast(
                    result.message,
                    'success',
                    result.status.toString(),
                );
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ?? 'Ошибка при удалении события';
            });
        builder
            .addCase(restoreEvent.fulfilled, (state, action) => {
                const { id, result } = action.payload;
                const eventIndex = state.allEvents.findIndex(
                    (event) => event.id === id,
                );
                if (eventIndex !== -1) {
                    state.allEvents[eventIndex].deletedAt = null;
                }
                showCustomToast(
                    result.message,
                    'success',
                    result.status.toString(),
                );
            })
            .addCase(restoreEvent.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ?? 'Ошибка при удалении события';
            });
    },
});

export const { filterEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
