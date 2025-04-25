import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Res,
  UseGuards,
  Req,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten-url')
  @UseGuards(JwtAuthGuard)
  async shortenUrl(@Body() createUrlDto: CreateUrlDto, @Req() req: Request) {
    const userId = req.user?.['userId'];
    const shortUrl = await this.urlService.createShortUrl(
      createUrlDto.originalUrl,
      userId,
    );

    return {
      success: true,
      shortUrl,
    };
  }

  @Get('urls')
  @UseGuards(JwtAuthGuard)
  async getAllUrls(@Req() req: Request) {
    const userId = req.user?.['userId'];
    console.log('userId for urls:', userId);
    const urls = await this.urlService.getAllUrlsByUser(userId);

    return {
      success: true,
      urls,
    };
  }

  @Get(':shortcode')
  async redirectToOriginalUrl(
    @Param('shortcode') shortcode: string,
    @Res() res: Response,
  ) {
    try {
      const url = await this.urlService.getUrlByShortcode(shortcode);
      // Increment click count
      await this.urlService.incrementClickCount(shortcode);

      // Redirect to the original URL
      return res.redirect(url.originalUrl);
    } catch (error) {
      console.log('error in shortcode:', error);
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Short URL not found',
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred',
      });
    }
  }
}
