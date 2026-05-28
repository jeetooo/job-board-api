import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

// Same as Laravel's Gate::authorize() or Policy check
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() decorator = route is open to all authenticated users
    if (!requiredRoles) return true;

    // Get user from request (set by JwtStrategy.validate)
    const { user } = context.switchToHttp().getRequest();

    // Check if user's role matches required roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRoles.join(' or ')}`
      );
    }

    return true;
  }
}