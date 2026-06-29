export interface IAuthLoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}