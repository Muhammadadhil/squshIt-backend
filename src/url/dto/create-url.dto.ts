import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty()
  @IsUrl(
    { require_protocol: true },
    { message: 'Please provide a valid URL with protocol (http/https)' },
  )
  @MaxLength(2048)
  originalUrl: string;
}

export class UrlResponseDto {
  id: number;
  originalUrl: string;
  shortcode: string;
  clickCount: number;
  createdAt: Date;
}
