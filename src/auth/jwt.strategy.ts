import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// This is what validates the Bearer token on every protected request
// Same as Laravel's auth:sanctum middleware
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') ?? '',
    });
  }

  // This runs after token is verified — attaches user to request
  // Same as auth()->user() in Laravel
  validate(payload: { sub: number; email: string }) {
    return { id: payload.sub, email: payload.email };
  }
}