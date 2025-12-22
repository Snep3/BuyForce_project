import { Expose } from 'class-transformer';

export class GroupCardDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  minParticipants: number;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;
}