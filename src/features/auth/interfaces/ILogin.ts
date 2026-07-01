import { IAuthUser } from "./IAuthUser";
import { IToken } from "./IToken";

export interface ILogin extends IAuthUser, IToken {}