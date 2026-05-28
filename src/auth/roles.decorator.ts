import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Custom decorator — same as Laravel's ->middleware('role:employer')
// Usage: @Roles('employer') or @Roles('admin', 'employer')
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);