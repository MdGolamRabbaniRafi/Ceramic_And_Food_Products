import { Strategy } from "passport-jwt";
declare const refreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class refreshTokenStrategy extends refreshTokenStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        user: any;
        username: any;
    }>;
}
export {};
