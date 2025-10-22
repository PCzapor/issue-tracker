import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class QueryIssuesDto {
  @IsOptional()
  @IsString()
  q?: string;
  @IsOptional()
  @IsIn(['open', 'closed', 'in_progress'])
  status?: 'open' | 'closed' | 'in_progress';

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'priority', 'status', 'title'])
  sort?: 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'title';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
