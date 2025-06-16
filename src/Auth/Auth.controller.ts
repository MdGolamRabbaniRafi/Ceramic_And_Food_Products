import { Body, Controller, HttpException, HttpStatus, InternalServerErrorException, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";
import { extname, resolve } from "path";
import { UserEntity } from "src/User/User.entity";
import { AuthService } from "./Auth.service";
import { JwtGaurd } from "./Gaurds/jwt-auth.gaurd";
import { LocalGaurd } from "./Gaurds/local-auth.gaurd";
import { refreshJwtGaurd } from "./Gaurds/refresh-jwt-auth.gaurd";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalGaurd)
  @Post('login')
  async login(@Body() userEntity: UserEntity, @Request() req) {
    // console.log("ewasdcasd  :"+req.user.name)
    return await this.authService.login(req.user);
    //  return await this.authService.validateUser(userEntity.email,userEntity.password)

  }
  //   @Post('signup')
  //   @UseInterceptors(FileInterceptor('defaultPicture',
  //     {
  //         fileFilter: (req, file, cb) => {
  //             if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
  //                 cb(null, true);
  //             else {
  //                 cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  //             }
  //         },
  //         limits: { fileSize: 100000 },
  //         storage: diskStorage({
  //           destination: (req, file, cb) => {
  //               const dest = process.env.Auth_Image_Destination;
  //               const resolvedDest = resolve(dest); // Ensure the path is absolute
  //               cb(null, resolvedDest);
  //             },             
  //             filename: (req, file, cb) => {
  //               const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //               const extension = extname(file.originalname); 
  //               const filename = `${uniqueSuffix}${extension}`; 
  //               cb(null, filename);
  //             },
  //         })
  //     }
  // ))//process.env.Auth_Image_Destination
  //   async SignUp(@Body() userEntity: UserEntity,@UploadedFile() myfile: Express.Multer.File) {
  //     userEntity.Image=myfile.path;
  //       return await this.authService.SignUpOTPCheck(userEntity);

  //   }



  @Post('signup')
  @UseInterceptors(FileInterceptor('defaultPicture', {
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
          const localPath = urlPath.replace(process.env.Host_url, process.env.Host_path);
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
  async SignUp(@Body() userEntity: UserEntity, @UploadedFile() myfile: Express.Multer.File) {
    // Set the full URL of the uploaded image
    let imageUrl = process.env.Auth_Image_Destination;
    imageUrl = `${imageUrl}${myfile.filename}`;
    const isProduction = process.env.NODE_ENV === 'production';
    let finalUrl: string;
    const trimmedPath = imageUrl.replace(process.env.Host_path, '');
    if (isProduction) {
     finalUrl = `https://${trimmedPath}`;
    }
    else{
      finalUrl=trimmedPath;
    }
    userEntity.Image = finalUrl;
    // } 
    console.log("imageUrl", imageUrl)
    return await this.authService.SignUpOTPCheck(userEntity);
  }





  @Post('/SignupVerifyOTP')
  async checkOtp(@Body('email') email: string, @Body('otp') otp: string): Promise<any> {
    return await this.authService.Signup(email, otp);

  }
  @UseGuards(JwtGaurd)
  @UseGuards(refreshJwtGaurd)
  @Post('/RefreshToken')
  async RefreshToken(@Body('refreshToken') refreshToken: string, @Request() req) {
    return await this.authService.RefreshToken(refreshToken, req); //need to delete previous token
  }
  @UseGuards(JwtGaurd)
  @Post('logout')
  async logout(@Request() req) {
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      await this.authService.logout(token);
      return { message: 'Logout successful' };
    } else {
      return { message: 'Authorization header missing' };
    }
  }

  @Post('GoogleAuth')
  @UseInterceptors(FileInterceptor('googlePic',
    {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 100000 },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = process.env.Auth_Image_Destination;
          const resolvedDest = resolve(dest); // Ensure the path is absolute
          cb(null, resolvedDest);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = extname(file.originalname);
          const filename = `${uniqueSuffix}${extension}`;
          cb(null, filename);
        },
      })
    }
  ))
  async GoogleAuth(@Body() logindata: any, @UploadedFile() myfile: Express.Multer.File) {
    try {
      let imageUrl = process.env.Auth_Image_Destination;

      if (imageUrl.startsWith('https://farseit.com')) {
        // Append the filename to the base URL
        imageUrl = `${imageUrl}${myfile.filename}`;
      } console.log(logindata);
      const result = await this.authService.GoogleAuth(logindata);
      if (result) {

        return result;
      }
      else {
        throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
      }
    }
    catch (error) {
      console.error('Error during GoogleAuth:', error);
      throw new InternalServerErrorException("Failed to login");
    }
  }

} 