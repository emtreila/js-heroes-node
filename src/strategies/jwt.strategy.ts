import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { db } from '../db';
import { users } from '../db/schema/users';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);

    if (user.length === 0) {
      return done(null, false);
    }

    return done(null, user[0]);
  } catch (error) {
    return done(error, false);
  }
});

