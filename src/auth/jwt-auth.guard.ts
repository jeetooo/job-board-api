import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Use this decorator on any route you want to protect
// Same as ->middleware('auth') in Laravel routes
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}