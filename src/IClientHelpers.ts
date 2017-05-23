// Interface to support the client helper methods

import { IData } from "./dataApi";
import { IAuth } from "./auth";

export interface IClientHelpers {
    data: IData;
    auth: IAuth;
}