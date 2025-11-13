import { User as SchemaUser } from '../db/schema/users';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends SchemaUser {}

    interface Request {
      user?: User;
    }
  }
}
