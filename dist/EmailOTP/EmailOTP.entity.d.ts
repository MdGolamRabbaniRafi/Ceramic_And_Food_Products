import { UserEntity } from "src/User/User.entity";
export declare class OTPEntity {
    Id: number;
    OTP: string;
    Expire_Time: Date;
    EMAIL: string;
    User: UserEntity;
}
