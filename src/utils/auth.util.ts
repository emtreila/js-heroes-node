/**
 * Type guard to ensure user is authenticated
 * Use this in controllers after passport.authenticate middleware
 * 
 * This function narrows the type so TypeScript knows req.user is defined
 * and throws an error if it's not (which should never happen if auth middleware is properly configured)
 */
export function assertAuthenticated(req: Express.Request): asserts req is Express.Request & { user: Express.User } {
  if (!req.user) {
    throw new Error('User is not authenticated. This should never happen if authentication middleware is properly configured.');
  }
}

