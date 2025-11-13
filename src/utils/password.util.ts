/**
 * Password utility functions
 * TODO: Implement password hashing and comparison using bcrypt
 */

/**
 * Hash a password
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  // TODO: Implement password hashing using bcrypt
  throw new Error('Not implemented yet');
};

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  // TODO: Implement password comparison using bcrypt
  throw new Error('Not implemented yet');
};
