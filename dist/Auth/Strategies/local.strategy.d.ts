import { Strategy } from "passport-local";
import { AuthService } from "../Auth.service";
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authservice;
    constructor(authservice: AuthService);
    validate(username: string, password: string): Promise<import("../../User/User.entity").UserEntity>;
}
export {};
