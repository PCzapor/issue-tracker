import { MinLength, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(3)
  password: string;
}
