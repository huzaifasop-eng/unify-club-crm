import { ForbiddenException } from '@nestjs/common';
import { AuthUser } from '../decorators/current-user.decorator';

/**
 * Returns a Prisma `where` fragment that scopes a query to the user's
 * accessible branches, unless the user has cross-branch visibility
 * (Super Admin / CEO / Director), in which case no restriction is applied
 * (or restricted to an explicitly requested branchId).
 */
export function branchScopeWhere(user: AuthUser, requestedBranchId?: string) {
  if (user.isCrossBranch) {
    return requestedBranchId ? { branchId: requestedBranchId } : {};
  }

  if (requestedBranchId && !user.branchIds.includes(requestedBranchId)) {
    throw new ForbiddenException('You do not have access to this branch');
  }

  if (requestedBranchId) {
    return { branchId: requestedBranchId };
  }

  if (user.branchIds.length === 0) {
    throw new ForbiddenException('You are not assigned to any branch');
  }

  return { branchId: { in: user.branchIds } };
}

export function assertBranchAccess(user: AuthUser, branchId: string) {
  if (user.isCrossBranch) return;
  if (!user.branchIds.includes(branchId)) {
    throw new ForbiddenException('You do not have access to this branch');
  }
}
