import { baseApi } from '@api/axios.ts';
import { parseError } from '@utils/errorUtils.ts';
import { DeleteEventResponse } from '@/types';
import EventDto, { EventCreateUpdateDto } from '@dtos/EventDto.ts';

export const getEvents = async (): Promise<EventDto[]> => {
    try {
        const { data } = await baseApi.get(`/events`);
        return data;
    } catch (e: unknown) {
        throw parseError(e);
    }
};

export const createEvent = async (
    newEvent: EventCreateUpdateDto,
): Promise<EventDto> => {
    try {
        const { data } = await baseApi.post('/events', newEvent);
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
