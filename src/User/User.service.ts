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
  ) { }
  getHello(): string {
    return 'Hello User!';
  }
  async SearchByID(Id: number): Promise<UserEntity | null> {
    let userEntity = await this.userRepo.findOne({ where: { Id } });
    if (userEntity != null) {
      const userImage = normalize(userEntity.Image).replace(/\\/g, '/');
      // userEntity.Image = userImage.replace('/home/farseit1/public_html', 'https://farseit.com');
            userEntity.Image = userImage.replace(process.env.Host_path, process.env.Host_url);

      return userEntity;
    }
    return null;
  }
  async EditUserProfileByID(Id: number, updatedData: Partial<UserEntity>): Promise<UserEntity | null> {
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
  async deleteImageFile(imagePath: string): Promise<boolean> {
    // Log the received imagePath to see if it is already altered
    if (imagePath.startsWith('https:/') && !imagePath.startsWith('https://')) {
      imagePath = imagePath.replace('https:/', 'https://');
    }
    let localImagePath: string = imagePath;

    // Check for production environment and transform URL to local path
    if (process.env.NODE_ENV === 'production') {
      // Ensure imagePath starts with 'https://farseit.com/Upload' before replacing it
      if (imagePath.startsWith('https://farseit.com/Upload')) {
        localImagePath = imagePath.replace('https://farseit.com/Upload', '/home/farseit1/public_html/Upload');
      } else {
        return false;
      }
    }

    // Resolve the absolute file path for the localImagePath
    const resolvedPath = path.resolve(localImagePath);

    // Check if the file exists before attempting to delete it
    try {
      await fs.access(resolvedPath);  // Check if file exists
    } catch (err) {
      return false;
    }

    try {
      // Attempt to delete the image file from the server
      await fs.unlink(resolvedPath);
      return true;
    } catch (err) {
      return false;
    }
  }

  async ChangeProfilePicture(Id: number, path: string): Promise<UserEntity | null> {
    const userDetails = await this.SearchByID(Id);
    const OldPath = (await userDetails).Image;

    // Log the old path to check its format
    console.log("Old Path from database:", OldPath);

    // Attempt to delete the old image and capture the result message
    const removeOldPath = await this.deleteImageFile(OldPath);

    // Check the result of the image deletion step
    if (removeOldPath) {
      // Try to update the profile picture path in the database
      const result = await this.userRepo.update(Id, {
        Image: path,
      });

      if (result.affected > 0) {
        const updatedUser = await this.userRepo.findOne({ where: { Id } });
        if (updatedUser) {
          return updatedUser;
        }
      }
      return null;
    } else {
      return null;
    }
  }

  // In UserService
  async getAllUsers(): Promise<UserEntity[] | null> {
    let userEntity = await this.userRepo.find();
    userEntity.forEach(user => {
      const userImage = normalize(user.Image).replace(/\\/g, '/');
      // user.Image=userImage.replace('/home/farseit1/public_html', 'https://farseit.com');

      user.Image = userImage.replace(process.env.Host_path, process.env.Host_url);
    })

    return userEntity;
  }


  async findByEmail(email: string): Promise<UserEntity | null> {
    // console.log("email:"+email)

    let user = await this.userRepo.findOne({ where: { email: email } });
    if (user != null) {
      const userImage = normalize(user.Image).replace(/\\/g, '/');
      // user.Image = userImage.replace('/home/farseit1/public_html', 'https://farseit.com');
            user.Image = userImage.replace(process.env.Host_path, process.env.Host_url);

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
    let HashPassword = await bcrypt.compare(password, findUser.password)
    // console.log("H:"+HashPassword)
    if (findUser != null && HashPassword) {
      return findUser;
    }

    return null;

  }
  async ChangePassword(Password: { oldPassword: string, newPassword: string }, Id: number): Promise<any> {
    const findUser = await this.SearchByID(Id)
    let HashPassword = await bcrypt.compare(Password.oldPassword, findUser.password)
    if (!HashPassword) {
      return { message: "Incorrect Old Password" }
    }
    if (findUser != null && HashPassword) {
      const hashedNewPassword = await bcrypt.hash(Password.newPassword, 10); // Salt rounds = 10

      // Update the user's password with the hashed new password
      const result = await this.userRepo.update(Id, { password: hashedNewPassword });

      if (result.affected > 0) {
        return { message: "Password updated successfully" };
      }

      return { message: "Error updating password" };
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
      const imageDeletionResult = await this.deleteImageFile(user.Image);

      // If the image is successfully deleted, proceed to delete the user
      const deleteResult = await this.userRepo.delete(Id);

      if (deleteResult.affected > 0) {
        return true;
      }
    }

    return false;
  }


}
