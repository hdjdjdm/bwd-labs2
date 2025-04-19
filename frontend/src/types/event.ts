import EventDto from '@dtos/EventDto.ts';

export type EventModalType = 'info' | 'edit' | 'create';

export interface DeleteEventResponse {
    status: number;
    message: string;
    event: EventDto;
}
