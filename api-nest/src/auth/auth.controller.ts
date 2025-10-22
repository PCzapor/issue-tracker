import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: { username: string; password: string }) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: { username: string; password: string }) {
    return this.auth.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    return this.auth.me(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('password')
  changePassword(
    @Req() req: any,
    @Body() dto: { current: string; next: string },
  ) {
    return this.auth.changePassword(req.user.userId, dto.current, dto.next);
  }
}
