import { Repository } from 'typeorm';
import { TokenEntity } from './Token.entity';
export declare class TokenService {
    private readonly tokenRepository;
    constructor(tokenRepository: Repository<TokenEntity>);
    saveToken(token: string, expireTime: Date): Promise<TokenEntity>;
    findToken(token: string): Promise<TokenEntity | null>;
    deleteToken(token: string): Promise<void>;
    deleteExpiredTokens(): Promise<void>;
}
