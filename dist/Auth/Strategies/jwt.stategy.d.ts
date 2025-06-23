import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenService } from '../token/token.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    validate(request: Request, payload: any): Promise<{
        userId: any;
        username: any;
    }>;
}
export {};
