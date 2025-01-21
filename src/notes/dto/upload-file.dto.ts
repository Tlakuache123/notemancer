import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
