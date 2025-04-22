import EventDto from '@dtos/EventDto.ts';

export interface DeleteEventResponse {
    status: number;
    message: string;
    event: EventDto;
}
