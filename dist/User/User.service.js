"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const fs_1 = require("fs");
const path = require("path");
const path_1 = require("path");
const typeorm_2 = require("typeorm");
const User_entity_1 = require("./User.entity");
let UserService = class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    getHello() {
        return 'Hello User!';
    }
    async SearchByID(Id) {
        const userEntity = await this.userRepo.findOne({ where: { Id } });
        if (userEntity != null && typeof userEntity.Image === 'string') {
            const trimmed = userEntity.Image.trim();
            const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
            userEntity.Image = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
        }
        return userEntity;
    }
    async EditUserProfileByID(Id, updatedData) {
        const result = await this.userRepo.update(Id, {
            name: updatedData.name,
            phone: updatedData.phone,
            address: updatedData.address,
        });
        if (result.affected > 0) {
            return await this.userRepo.findOne({ where: { Id } });
        }
        return null;
    }
    async deleteImageFile(imagePath) {
        if (!imagePath) {
            return { message: 'No image path provided' };
        }
        if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
            imagePath = imagePath.replace('https:/', 'https://');
        }
        const fileName = path.basename(imagePath);
        console.log('basename:', fileName);
        const isProduction = process.env.NODE_ENV === 'production' || process.platform !== 'win32';
        let uploadDir = process.env.Auth_Image_Destination || '';
        if (isProduction &&
            process.env.Host_url &&
            imagePath.startsWith(process.env.Host_url)) {
            uploadDir = process.env.Host_path
                ? path.join(process.env.Host_path, uploadDir.replace(process.env.Host_path, ''))
                : uploadDir;
        }
        const localImagePath = path.join(uploadDir, fileName);
        console.log('Resolved path for deletion:', localImagePath);
        try {
            await fs_1.promises.access(localImagePath);
        }
        catch (err) {
            console.error('File not found:', localImagePath);
            return { message: 'File not found' };
        }
        try {
            await fs_1.promises.unlink(localImagePath);
            console.log('File deleted:', fileName);
            return { message: 'File deleted successfully' };
        }
        catch (err) {
            console.error('Failed to delete:', localImagePath, err);
            return { message: 'Failed to delete file' };
        }
    }
    async ChangeProfilePicture(Id, path) {
        const userDetails = await this.SearchByID(Id);
        const OldPath = userDetails.Image;
        console.log('Old Path from database:', OldPath);
        const removeOldPath = await this.deleteImageFile(OldPath);
        if (removeOldPath.message != 'File deleted successfully') {
            return removeOldPath;
        }
        const result = await this.userRepo.update(Id, { Image: path });
        if (result.affected > 0) {
            const updatedUser = await this.userRepo.findOne({ where: { Id } });
            if (updatedUser) {
                return updatedUser;
            }
            else {
                return {
                    message: 'Profile picture updated, but failed to fetch updated user details.',
                };
            }
        }
        else {
            return { message: 'Failed to update profile picture in database.' };
        }
    }
    async getAllUsers() {
        const userEntity = await this.userRepo.find();
        userEntity.forEach((user) => {
            if (typeof user.Image === 'string') {
                const trimmed = user.Image.trim();
                const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
                user.Image = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
            }
        });
        return userEntity;
    }
    async findByEmail(email) {
        let user = await this.userRepo.findOne({ where: { email: email } });
        if (user != null) {
            const userImage = (0, path_1.normalize)(user.Image).replace(/\\/g, '/');
            user.Image = userImage.replace(process.env.Host_path, process.env.Host_url);
            return user;
        }
        return null;
    }
    async validate(email, password) {
        let findUser = await this.findByEmail(email);
        if (findUser == null) {
            return null;
        }
        let HashPassword = await bcrypt.compare(password, findUser.password);
        if (findUser != null && HashPassword) {
            return findUser;
        }
        return null;
    }
    async ChangePassword(Password, Id) {
        const findUser = await this.SearchByID(Id);
        let HashPassword = await bcrypt.compare(Password.oldPassword, findUser.password);
        if (!HashPassword) {
            return { message: 'Incorrect Old Password' };
        }
        if (findUser != null && HashPassword) {
            const hashedNewPassword = await bcrypt.hash(Password.newPassword, 10);
            const result = await this.userRepo.update(Id, {
                password: hashedNewPassword,
            });
            if (result.affected > 0) {
                return { message: 'Password updated successfully' };
            }
            return { message: 'Error updating password' };
        }
    }
    async newPassword(newPassword, Id) {
        const findUser = await this.SearchByID(Id);
        if (findUser != null) {
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            const result = await this.userRepo.update(Id, {
                password: hashedNewPassword,
            });
            if (result.affected > 0) {
                return { message: 'Password updated successfully' };
            }
            return { message: 'Error updating password' };
        }
    }
    async SignUp(userEntity) {
        try {
            const saltRounds = 10;
            userEntity.password = await bcrypt.hash(userEntity.password, saltRounds);
            console.log('Attempting to save user:', JSON.stringify(userEntity));
            const UserDetails = await this.userRepo.save(userEntity);
            console.log('User saved:', JSON.stringify(UserDetails));
            if (UserDetails) {
                return UserDetails;
            }
            return null;
        }
        catch (error) {
            console.error('Error caught in SignUp:', error);
            if (error.code === '23505') {
                throw new common_1.ConflictException('Email already exists');
            }
            throw error;
        }
    }
    async deleteUser(Id) {
        const user = await this.SearchByID(Id);
        if (user) {
            try {
                const imageDeletionResult = await this.deleteImageFile(user.Image);
                const deleteResult = await this.userRepo.delete(Id);
                if (deleteResult.affected > 0) {
                    return true;
                }
            }
            catch {
                const deleteResult = await this.userRepo.delete(Id);
                if (deleteResult.affected > 0) {
                    return true;
                }
            }
            const deleteResult = await this.userRepo.delete(Id);
            if (deleteResult.affected > 0) {
                return true;
            }
        }
        return false;
    }
    async forceFullyDelete(Id) {
        const user = await this.SearchByID(Id);
        if (user) {
            try {
                const deleteResult = await this.userRepo.delete(Id);
                if (deleteResult.affected > 0) {
                    return true;
                }
            }
            catch {
                const deleteResult = await this.userRepo.delete(Id);
                if (deleteResult.affected > 0) {
                    return true;
                }
            }
            const deleteResult = await this.userRepo.delete(Id);
            if (deleteResult.affected > 0) {
                return true;
            }
        }
        return false;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=User.service.js.map