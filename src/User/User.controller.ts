import { Body, Controller, Get, Param, ParseIntPipe, Req, UseGuards,Request, Put, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { UserEntity } from './User.entity';
import { UserService } from './User.service';
import { Request as ExpressRequest } from 'express';
import { Roles } from 'src/Auth/Role/Roles.decorate';
import { Role } from 'src/Auth/Role/Role.enum';
import { JwtGaurd } from 'src/Auth/Gaurds/jwt-auth.gaurd';
import { RolesGaurd } from 'src/Auth/Role/Roles.gaurd';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { extname, resolve } from 'path';


@Controller('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Roles(Role.User)
//   //@UseGuards(jwtGaurd,RolesGaurd)
//   @UseGuards(JwtGaurd,RolesGaurd)
  @Get('/search/:id')
  async SearchByID(@Param('id', ParseIntPipe) Id: number, @Request() req): Promise<null | UserEntity> {
      console.log(req.headers['authorization']); // To see if the token is present
      return await this.userService.SearchByID(Id);
  }
  @Put('/profile/edit/:id')
  async EditUserProfile(
    @Param('id', ParseIntPipe) Id: number,
    @Body() updatedData: { name?: string; phone?: string; address?: string }
  ): Promise<UserEntity | null> {
    return await this.userService.EditUserProfileByID(Id, updatedData);
  }
  @Put('/ChangeProfilePicture/:id')
  @UseInterceptors(FileInterceptor('ProfilePicture', {
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
        if (urlPath.startsWith('https://farseit.com')) {
          // Convert the public URL path to the local file system path
          const localPath = urlPath.replace('https://farseit.com', '/home/farseit1/public_html');
          cb(null, resolve(localPath));  // Save to the local path in the server
        } else {
          // For other environments, use the resolved path as it is
          cb(null, resolve(urlPath));
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = extname(file.originalname);
        const filename = `${uniqueSuffix}${extension}`;
        cb(null, filename);
      }
    })
  }))
  async ChangeProfilePicture(@Param('id', ParseIntPipe) Id: number,@UploadedFile() myfile: Express.Multer.File): Promise<null |UserEntity>
  {
    let filePath=myfile.path;
    let imageUrl = process.env.Auth_Image_Destination;
  
    // if (imageUrl.startsWith('https://farseit.com')) {
      // Append the filename to the base URL
      imageUrl = `${imageUrl}${myfile.filename}`;
    // }    
    
    filePath=imageUrl;
    return await this.userService.ChangeProfilePicture(Id,filePath);

  }
  @Put('/ChangePassword/:id')
  async ChangePassword(
    @Param('id',ParseIntPipe) Id:number,
    @Body() Password:{oldPassword:string,newPassword:string}
  ): Promise<any>
  {
    return await this.userService.ChangePassword(Password,Id);
  }
  @Get('/Search')
  async Search(): Promise<UserEntity[]|null>
  {
    return await this.userService.getAllUsers();
  }
  @Delete('/delete/:id')
async deleteUser(@Param('id', ParseIntPipe) Id: number): Promise<{ message: string }> {
  const deletionResult = await this.userService.deleteUser(Id);
  if (deletionResult) {
    return { message: 'User and profile image deleted successfully' };
  } else {
    return { message: 'User not found or deletion failed' };
  }
}

}
