import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import EventDto, { EventCreateDto, EventFormDto } from '@dtos/EventDto.ts';
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
import { Roles } from '@constants/Roles.ts';

interface EventsState {
    events: EventDto[];
    loading: boolean;
    error: string | null;
}

const initialState: EventsState = {
    events: [],
    loading: false,
    error: null,
};

export const fetchEvents = createAsyncThunk<EventDto[], Roles | undefined>(
    'events/getEvents',
    async (userRole, { rejectWithValue }) => {
        try {
            return await getEvents(userRole);
        } catch (e: unknown) {
            const { status, errorMessage } = parseError(e);
            showCustomToast(errorMessage, 'error', status.toString());
            return rejectWithValue(errorMessage);
        }
    },
);

export const addEvent = createAsyncThunk<
    EventDto,
    EventCreateDto,
    { rejectValue: string }
>('events/addEvent', async (newEvent, { rejectWithValue }) => {
    try {
        return await createEvent(newEvent);
    } catch (e) {
        const { status, errorMessage } = parseError(e);
        showCustomToast(errorMessage, 'error', status.toString());
        return rejectWithValue(errorMessage);
    }
});

export const updateEvent = createAsyncThunk<
    EventDto,
    { id: number; eventData: Partial<EventFormDto> },
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
        setEvents: (state, action: PayloadAction<EventDto[]>) => {
            state.events = action.payload;
        },
        clearEvents: (state) => {
            state.events = [];
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
                    state.events = action.payload;
                },
            )
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ?? 'Ошибка при загрузке событий';
            });
        builder.addCase(
            addEvent.fulfilled,
            (state, action: PayloadAction<EventDto>) => {
                const event = action.payload;
                state.events.push(event);
                showCustomToast(`Событие '${event.title} добавлено`, 'success');
            },
        );
        builder
            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                updateEvent.fulfilled,
                (state, action: PayloadAction<EventDto>) => {
                    state.loading = false;
                    const updatedEvent = action.payload;
                    const index = state.events.findIndex(
                        (event) => event.id === updatedEvent.id,
                    );
                    if (index !== -1) {
                        state.events[index] = updatedEvent;
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
                    state.events = state.events.filter(
                        (event) => event.id !== id,
                    );
                } else {
                    const eventIndex = state.events.findIndex(
                        (event) => event.id === id,
                    );
                    if (eventIndex !== -1) {
                        state.events[eventIndex].deletedAt =
                            result.event.deletedAt;
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
                const eventIndex = state.events.findIndex(
                    (event) => event.id === id,
                );
                if (eventIndex !== -1) {
                    state.events[eventIndex].deletedAt = null;
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

export const { setEvents, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
