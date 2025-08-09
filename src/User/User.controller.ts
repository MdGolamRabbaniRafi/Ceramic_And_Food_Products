import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { extname, resolve } from 'path';
import { JwtGaurd } from 'src/Auth/Gaurds/jwt-auth.gaurd';
import { Role } from 'src/Auth/Role/Role.enum';
import { Roles } from 'src/Auth/Role/Roles.decorate';
import { RolesGaurd } from 'src/Auth/Role/Roles.gaurd';
import { UserEntity } from './User.entity';
import { UserService } from './User.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Roles(Role.User)
  @UseGuards(JwtGaurd, RolesGaurd)
  @Get('/search/:id')
  async SearchByID(
    @Param('id', ParseIntPipe) Id: number,
    @Request() req,
  ): Promise<null | UserEntity> {
    console.log(req.headers['authorization']); // Optional: Debug token presence
    return await this.userService.SearchByID(Id);
  }

  @Put('/profile/edit/:id')
  async EditUserProfile(
    @Param('id', ParseIntPipe) Id: number,
    @Body() updatedData: { name?: string; phone?: string; address?: string },
  ): Promise<UserEntity | null> {
    return await this.userService.EditUserProfileByID(Id, updatedData);
  }

  @Put('/ChangeProfilePicture/:id')
  @UseInterceptors(
    FileInterceptor('ProfilePicture', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 1000000 }, // 100 KB limit
      storage: diskStorage({
        destination: (req, file, cb) => {
          let urlPath = process.env.Auth_Image_Destination;

          // Detect CPanel or similar hosting and convert URL to local directory path dynamically
          if (urlPath.startsWith(process.env.Host_url)) {
            // Convert the public URL path to the local file system path
            const localPath = urlPath.replace(
              process.env.Host_url,
              process.env.Host_path,
            );
            cb(null, resolve(localPath)); // Save to the local path in the server
          } else {
            // For other environments, use the resolved path as it is
            cb(null, resolve(urlPath));
          }
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          const filename = `${uniqueSuffix}${extension}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async ChangeProfilePicture(
    @Param('id', ParseIntPipe) Id: number,
    @UploadedFile() myfile: Express.Multer.File,
  ): Promise<{ message: string } | UserEntity> {
    let imageUrl = process.env.Auth_Image_Destination;
    imageUrl = `${imageUrl}${myfile.filename}`;
    const trimmedPath = imageUrl.replace(process.env.Host_path, '');
    const isProduction = process.env.NODE_ENV === 'production';
    let finalUrl: string;
    if (isProduction) {
      finalUrl = `${process.env.Host_url}${trimmedPath}`;
    } else {
      finalUrl = trimmedPath;
    }
    const Image = finalUrl;
    return await this.userService.ChangeProfilePicture(Id, Image);
  }

  @Put('/ChangePassword/:id')
  async ChangePassword(
    @Param('id', ParseIntPipe) Id: number,
    @Body() Password: { oldPassword: string; newPassword: string },
  ): Promise<any> {
    return await this.userService.ChangePassword(Password, Id);
  }

  @Put('/newPassword/:id')
  async newPassword(
    @Param('id', ParseIntPipe) Id: number,
    @Body('newPassword') newPassword: string,
  ): Promise<any> {
    return await this.userService.newPassword(newPassword, Id);
  }

  @Get('/Search')
  async Search(): Promise<UserEntity[] | null> {
    return await this.userService.getAllUsers();
  }

  @Delete('/delete/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) Id: number,
  ): Promise<{ message: string }> {
    const deletionResult = await this.userService.deleteUser(Id);
    if (deletionResult) {
      return { message: 'User and profile image deleted successfully' };
    } else {
      return { message: 'User not found or deletion failed' };
    }
  }

  @Delete('/forceFullyDelete/:id')
  async forceFullyDelete(
    @Param('id', ParseIntPipe) Id: number,
  ): Promise<{ message: string }> {
    const deletionResult = await this.userService.forceFullyDelete(Id);
    if (deletionResult) {
      return { message: 'User and profile deleted successfully' };
    } else {
      return { message: 'User not found or deletion failed' };
    }
  }
}
