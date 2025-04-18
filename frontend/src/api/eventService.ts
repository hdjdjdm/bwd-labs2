import { baseApi } from '@api/axios.ts';
import { parseError } from '@utils/errorUtils.ts';
import { DeleteEventResponse, EventPageCategory } from '@/types';
import EventDto from '@dtos/EventDto.ts';

export const getEvents = async (
    category: EventPageCategory,
    withDeleted: boolean = false,
): Promise<EventDto[]> => {
    try {
        const { data } = await baseApi.get(
            `/events/${category}?withDeleted=${withDeleted}`,
        );
        return data;
    } catch (e: unknown) {
        throw parseError(e);
    }
};

export const createEvent = async (
    title: string,
    description: string,
    date: Date,
    isPublic: boolean,
): Promise<EventDto> => {
    try {
        const { data } = await baseApi.post('/events', {
            title,
            description,
            date,
            isPublic,
        });
        return data;
    } catch (e: unknown) {
        throw parseError(e);
    }
};

export const updateEvent = async (
    eventId: number,
    updatedFields: Partial<EventDto>,
): Promise<EventDto> => {
    try {
        const { data } = await baseApi.put(`/events/${eventId}`, updatedFields);
        return data;
    } catch (e: unknown) {
        throw parseError(e);
    }
};

export const deleteEvent = async (
    eventId: number,
    hardDelete: boolean = false,
): Promise<DeleteEventResponse> => {
    try {
        const { status, data } = await baseApi.delete(
            `/events/${eventId}?hardDelete=${hardDelete}`,
        );
        const message = data.message;
        const event = data.event;
        return { status, message, event };
    } catch (e: unknown) {
        throw parseError(e);
    }
};

export const restoreEvent = async (
    eventId: number,
): Promise<DeleteEventResponse> => {
    try {
        const { status, data } = await baseApi.patch(
            `/events/${eventId}/restore`,
        );
        const message = data.message;
        const event = data.event;
        return { status, message, event };
    } catch (e: unknown) {
        throw parseError(e);
    }
};
