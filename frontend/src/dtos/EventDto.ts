export interface EventDto {
    id: number;
    title: string;
    description?: string | null;
    date?: Date;
    createdBy: number;
    deletedAt?: Date | null;
}
