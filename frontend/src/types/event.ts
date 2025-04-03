import EventDto from '@dtos/EventDto.ts';

export type EventPageCategory = 'my' | 'public';

export type EventModalType = 'info' | 'edit' | 'create';

export interface DeleteEventResponse {
    status: number;
    message: string;
    event: EventDto;
}
