import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
import * as path from 'path';
import { normalize } from 'path';
import { Repository } from 'typeorm';
import { UserEntity } from './User.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}
  getHello(): string {
    return 'Hello User!';
  }
  async SearchByID(Id: number): Promise<UserEntity | null> {
    const userEntity = await this.userRepo.findOne({ where: { Id } });

    if (userEntity != null && typeof userEntity.Image === 'string') {
      const trimmed = userEntity.Image.trim();
      const relativePath = trimmed.replace(/^https?:\/\/[^/]+/, '');
      userEntity.Image = `https:/${relativePath.startsWith('/') ? relativePath.slice(1) : relativePath}`;
    }

    return userEntity;
  }

  async EditUserProfileByID(
    Id: number,
    updatedData: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const result = await this.userRepo.update(Id, {
      name: updatedData.name,
      phone: updatedData.phone,
      address: updatedData.address,
    });

    if (result.affected > 0) {
      // Return the updated user if the update was successful
      return await this.userRepo.findOne({ where: { Id } });
    }
    return null;
  }

  async deleteImageFile(imagePath: string): Promise<{ message: string }> {
    if (!imagePath) {
      return { message: 'No image path provided' };
    }

    // Normalize incorrect slashes
    if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
      imagePath = imagePath.replace('https:/', 'https://');
    }

    // Extract filename from URL
    const fileName = path.basename(imagePath);
    console.log('basename:', fileName);

    // Determine environment
    const isProduction =
      process.env.NODE_ENV === 'production' || process.platform !== 'win32';

    // Get upload path from .env
    let uploadDir = process.env.Auth_Image_Destination || '';

    // If in production and image path starts with Host_url, convert URL to local path
    if (
      isProduction &&
      process.env.Host_url &&
      imagePath.startsWith(process.env.Host_url)
    ) {
      uploadDir = process.env.Host_path
        ? path.join(
            process.env.Host_path,
            uploadDir.replace(process.env.Host_path, ''),
          )
        : uploadDir;
    }

    // Construct local file path
    const localImagePath = path.join(uploadDir, fileName);
    console.log('Resolved path for deletion:', localImagePath);

    // Check if file exists
    try {
      await fs.access(localImagePath);
    } catch (err) {
      console.error('File not found:', localImagePath);
      return { message: 'File not found' };
    }

    // Attempt deletion
    try {
      await fs.unlink(localImagePath);
      console.log('File deleted:', fileName);
      return { message: 'File deleted successfully' };
    } catch (err) {
      console.error('Failed to delete:', localImagePath, err);
      return { message: 'Failed to delete file' };
    }
  }

  async ChangeProfilePicture(
    Id: number,
    path: string,
  ): Promise<UserEntity | { message: string }> {
    const userDetails = await this.SearchByID(Id);
    const OldPath = userDetails.Image;

    // Log the old path to check its format
    console.log('Old Path from database:', OldPath);

    // Attempt to delete the old image and capture the result message
    const removeOldPath = await this.deleteImageFile(OldPath);

    // If failed to delete old image
    if (removeOldPath.message != 'File deleted successfully') {
      return removeOldPath;
    }

    // Try to update the profile picture path in the database
    const result = await this.userRepo.update(Id, { Image: path });

    if (result.affected > 0) {
      const updatedUser = await this.userRepo.findOne({ where: { Id } });
      if (updatedUser) {
        return updatedUser;
      } else {
        return {
          message:
            'Profile picture updated, but failed to fetch updated user details.',
        };
      }
    } else {
      return { message: 'Failed to update profile picture in database.' };
    }
  }

  // In UserService
  async getAllUsers(): Promise<UserEntity[] | null> {
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

  async findByEmail(email: string): Promise<UserEntity | null> {
    // console.log("email:"+email)

    let user = await this.userRepo.findOne({ where: { email: email } });
    if (user != null) {
      const userImage = normalize(user.Image).replace(/\\/g, '/');
      // user.Image = userImage.replace('/home/farseit1/public_html', 'https://farseit.com');
      user.Image = userImage.replace(
        process.env.Host_path,
        process.env.Host_url,
      );

      // console.log("Useremail:"+user.email)
      return user;
    }
    return null;
  }
  
  async validate(email: string, password: string): Promise<UserEntity | null> {
    // console.log("email:"+email)
    let findUser = await this.findByEmail(email);
    if (findUser == null) {
      return null;
    }
    let HashPassword = await bcrypt.compare(password, findUser.password);
    // console.log("H:"+HashPassword)
    if (findUser != null && HashPassword) {
      return findUser;
    }

    return null;
  }

  async ChangePassword(
    Password: { oldPassword: string; newPassword: string },
    Id: number,
  ): Promise<any> {
    const findUser = await this.SearchByID(Id);
    let HashPassword = await bcrypt.compare(
      Password.oldPassword,
      findUser.password,
    );
    if (!HashPassword) {
      return { message: 'Incorrect Old Password' };
    }
    if (findUser != null && HashPassword) {
      const hashedNewPassword = await bcrypt.hash(Password.newPassword, 10); // Salt rounds = 10

      // Update the user's password with the hashed new password
      const result = await this.userRepo.update(Id, {
        password: hashedNewPassword,
      });

      if (result.affected > 0) {
        return { message: 'Password updated successfully' };
      }

      return { message: 'Error updating password' };
    }
  }




   async newPassword(
    newPassword: string ,
    Id: number,
  ): Promise<any> {
    const findUser = await this.SearchByID(Id);

    if (findUser != null) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Salt rounds = 10

      // Update the user's password with the hashed new password
      const result = await this.userRepo.update(Id, {
        password: hashedNewPassword,
      });

      if (result.affected > 0) {
        return { message: 'Password updated successfully' };
      }

      return { message: 'Error updating password' };
    }
  }
  // async SignUp(userEntity: UserEntity): Promise<UserEntity | boolean> {
  //   try {
  //     const saltRounds = 10;
  //     userEntity.password = await bcrypt.hash(userEntity.password, saltRounds);

  //     const UserDetails = await this.userRepo.save(userEntity);
  //     console.log('User saved:', JSON.stringify(UserDetails));
  //     if (UserDetails != null) {
  //       return UserDetails;
  //     }

  //     return null;
  //   } catch (error) {
  //     console.error('Error caught in SignUp:', error); // Log the error details
  //     if (error.code === '23505') {
  //       throw new ConflictException('Email already exists');
  //     }
  //     throw error;
  //   }
  // }
  async SignUp(userEntity: UserEntity): Promise<UserEntity | boolean> {
    try {
      const saltRounds = 10;
      userEntity.password = await bcrypt.hash(userEntity.password, saltRounds);

      console.log('Attempting to save user:', JSON.stringify(userEntity));

      // Attempt to save the user
      const UserDetails = await this.userRepo.save(userEntity);
      console.log('User saved:', JSON.stringify(UserDetails));

      if (UserDetails) {
        return UserDetails;
      }

      return null;
    } catch (error) {
      console.error('Error caught in SignUp:', error);

      // Handle unique constraint violation for email
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }

      // Re-throw other unexpected errors
      throw error;
    }
  }

  async deleteUser(Id: number): Promise<boolean> {
    const user = await this.SearchByID(Id);

    if (user) {
      try {
        const imageDeletionResult = await this.deleteImageFile(user.Image);
        const deleteResult = await this.userRepo.delete(Id);

        if (deleteResult.affected > 0) {
          return true;
        }
      } catch {
        const deleteResult = await this.userRepo.delete(Id);

        if (deleteResult.affected > 0) {
          return true;
        }
      }

      // If the image is successfully deleted, proceed to delete the user
      const deleteResult = await this.userRepo.delete(Id);

      if (deleteResult.affected > 0) {
        return true;
      }
    }

    return false;
  }

  async forceFullyDelete(Id: number): Promise<boolean> {
    const user = await this.SearchByID(Id);

    if (user) {
      try {
        // const imageDeletionResult = await this.deleteImageFile(user.Image);
        const deleteResult = await this.userRepo.delete(Id);

        if (deleteResult.affected > 0) {
          return true;
        }
      } catch {
        const deleteResult = await this.userRepo.delete(Id);

        if (deleteResult.affected > 0) {
          return true;
        }
      }

      // If the image is successfully deleted, proceed to delete the user
      const deleteResult = await this.userRepo.delete(Id);

      if (deleteResult.affected > 0) {
        return true;
      }
    }

    return false;
  }
}
