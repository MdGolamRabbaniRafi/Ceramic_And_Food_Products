import { UserEntity } from 'src/User/User.entity';
export declare class OTPEntity {
    Id: number;
    otp: string;
    Expire_Time: Date;
    email: string;
    User: UserEntity;
}
