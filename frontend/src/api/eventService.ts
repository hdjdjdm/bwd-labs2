import { EventDto } from '@/dtos';
import { baseApi } from '@api/axios.ts';
import { parseError } from '@utils/errorUtils.ts';
import { DeleteEventResponse } from '@/types';

export const getEvents = async (): Promise<EventDto[]> => {
    try {
        const { data } = await baseApi.get('/events');
        return data;
    } catch (e: unknown) {
        throw parseError(e);
    }
};

export const createEvent = async (
    title: string,
    description: string,
    date: Date,
): Promise<EventDto> => {
    try {
        const { data } = await baseApi.post('/events', {
            title,
            description,
            date,
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
): Promise<DeleteEventResponse> => {
    try {
        const { status, data } = await baseApi.delete(`/events/${eventId}`);
        const message = data.message;
        return { status, message };
    } catch (e: unknown) {
        throw parseError(e);
    }
};
