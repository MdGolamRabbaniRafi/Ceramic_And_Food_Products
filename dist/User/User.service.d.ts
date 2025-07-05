import { Repository } from 'typeorm';
import { UserEntity } from './User.entity';
export declare class UserService {
    private userRepo;
    constructor(userRepo: Repository<UserEntity>);
    getHello(): string;
    SearchByID(Id: number): Promise<UserEntity | null>;
    EditUserProfileByID(Id: number, updatedData: Partial<UserEntity>): Promise<UserEntity | null>;
    deleteImageFile(imagePath: string): Promise<{
        message: string;
    }>;
    ChangeProfilePicture(Id: number, path: string): Promise<UserEntity | {
        message: string;
    }>;
    getAllUsers(): Promise<UserEntity[] | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    validate(email: string, password: string): Promise<UserEntity | null>;
    ChangePassword(Password: {
        oldPassword: string;
        newPassword: string;
    }, Id: number): Promise<any>;
    newPassword(newPassword: string, Id: number): Promise<any>;
    SignUp(userEntity: UserEntity): Promise<UserEntity | boolean>;
    deleteUser(Id: number): Promise<boolean>;
    forceFullyDelete(Id: number): Promise<boolean>;
}
