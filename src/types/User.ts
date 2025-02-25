export interface UserPayload {
  name: string;
  username: string;
  email: string;
  salt: string;
  hash: string;
  createdAt?: Date;
  updatedAt?: Date;
}
