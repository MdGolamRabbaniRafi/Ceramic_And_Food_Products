import { Repository } from 'typeorm';
import { TokenEntity } from './Token.entity';
export declare class CleanupService {
    private readonly tokenRepository;
    constructor(tokenRepository: Repository<TokenEntity>);
    deleteExpiredTokens(): Promise<void>;
}
