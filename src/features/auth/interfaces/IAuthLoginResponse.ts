import { IAuthUser } from "./IAuthUser";

export interface IAuthLoginResponse extends IAuthUser {
  accessToken: string;
  refreshToken: string;
}