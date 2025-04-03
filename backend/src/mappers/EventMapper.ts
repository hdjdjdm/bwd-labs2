import Event from '@models/Event.js';
import { EventResponseDto } from '@dto/EventDto.js';
import UserMapper from '@mappers/UserMapper.js';
import { Roles } from '@constants/Roles.js';

class EventMapper {
    static toResponseDto(event: Event): EventResponseDto {
        const fallbackUser = {
            id: event.createdBy,
            name: 'Deleted User',
            email: '',
            role: Roles.USER,
        };

        return {
            id: event.id,
            title: event.title,
            description: event.description ?? '',
            date: event.date,
            createdBy: event.creator ? UserMapper.toResponseDto(event.creator) : fallbackUser,
            deletedAt: event.deletedAt ?? null,
            isPublic: event.isPublic ?? false,
        };
    }
}

export default EventMapper;
