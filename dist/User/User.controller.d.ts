import { UserEntity } from './User.entity';
import { UserService } from './User.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getHello(): string;
    SearchByID(Id: number, req: any): Promise<null | UserEntity>;
    EditUserProfile(Id: number, updatedData: {
        name?: string;
        phone?: string;
        address?: string;
    }): Promise<UserEntity | null>;
    ChangeProfilePicture(Id: number, myfile: Express.Multer.File): Promise<{
        message: string;
    } | UserEntity>;
    ChangePassword(Id: number, Password: {
        oldPassword: string;
        newPassword: string;
    }): Promise<any>;
    newPassword(Id: number, newPassword: string): Promise<any>;
    Search(): Promise<UserEntity[] | null>;
    deleteUser(Id: number): Promise<{
        message: string;
    }>;
    forceFullyDelete(Id: number): Promise<{
        message: string;
    }>;
}
