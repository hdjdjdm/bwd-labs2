import Event from '@models/Event.js';
import { EventResponseDto } from '@dto/EventDto.js';
import { UserShortDto } from '@dto/UserDto.js';

class EventMapper {
    static toResponseDto(event: Event): EventResponseDto {
        const fallbackUser: UserShortDto = {
            id: event.createdBy,
            name: 'Deleted User',
        };

        return {
            id: event.id,
            title: event.title,
            description: event.description ?? '',
            date: event.date,
            createdBy: event.creator
                ? {
                      id: event.creator.id,
                      name: event.creator.name,
                  }
                : fallbackUser,
            deletedAt: event.deletedAt ?? null,
            isPublic: event.isPublic ?? false,
        };
    }
}

export default EventMapper;
