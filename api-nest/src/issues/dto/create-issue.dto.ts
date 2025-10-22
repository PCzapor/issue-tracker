import { $Enums } from '@prisma/client';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateIssueDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsIn(['open', 'closed', 'in_progress'])
  status?: $Enums.Status;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: $Enums.Priority;
}
