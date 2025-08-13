import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: { name: string; email: string; password: string }) {
    const user = await this.auth.register(dto.name, dto.email, dto.password);
    return { id: user._id, name: user.name, email: user.email };
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('validate-token')
  async validate(@Body() dto: { token: string }) {
    const decoded = await this.auth.validateToken(dto.token);
    if (!decoded) throw new UnauthorizedException('Invalid or expired token');
    return decoded;
  }

  @Post('logout')
  async logout(@Body() dto: { token: string }) {
    const payload = await this.auth.validateToken(dto.token);
    if (!payload) throw new UnauthorizedException('Invalid token');
    return this.auth.logout(payload.sub);
  }
}