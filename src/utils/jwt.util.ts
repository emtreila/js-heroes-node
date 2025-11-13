import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN: StringValue = (process.env.JWT_EXPIRES_IN as StringValue) || '7d';

export interface JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
