import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './Product.service';
import { ProductEntity } from './Product.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'; // Ensure correct import
import { diskStorage } from 'multer';
import { CategoryEntity } from 'src/Category/Category.entity';
import { extname, normalize, resolve } from 'path';


@Controller('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  getHello(): string {
    return this.productService.getHello();
  }
  @Get('/search/:id')
  async SearchByID(@Param('id', ParseIntPipe) Id: number): Promise<any> {  
    const product = await this.productService.SearchByID(Id);
    if (product) {
      const productWithImages = {
        ...product,
        image: product.image.split(',').map((filename) => {
          const trimmedPath = filename.trim();
          return `$${normalize(trimmedPath).replace(/\\/g, '/')}`;
        }),
      };
  
      return productWithImages;
    }
  
    return {message:"Product not found"};
  }
  
  @Get('/search')
  async Search(): Promise<{message:string} | any[]> {

    const productEntities =await this.productService.Search();
    if (productEntities) {
      // const baseImageUrl = process.env.Product_Image_Destination;
  
      const productsWithImages = productEntities.map(product => {
        return {
          ...product,
          image: product.image.split(',').map((filename) => {
            const trimmedPath = filename.trim();
            return normalize(trimmedPath).replace(/\\/g, '/');
          }),
        };
      });
  
      return productsWithImages;
    }
  
    return null;
  }
  
  @Get('/searchByCategory/:CategoryId')
  
  async SearchByCategoryID(@Param('CategoryId', ParseIntPipe) Id: number): Promise<null | any[]> {
    const productEntities = await this.productService.SearchByCategoryID(Id);
  
    if (productEntities) {
     // const baseImageUrl = process.env.Product_Image_Destination;
  
      const productsWithImages = productEntities.map(product => {
        return {
          ...product,
          image: product.image.split(',').map((filename) => {
            const trimmedPath = filename.trim();
            return normalize(trimmedPath).replace(/\\/g, '/');
          }),
        };
      });
  
      return productsWithImages;
    }
  
    return null;
  }
  
  @Post('/add')
  @UseInterceptors(
    FilesInterceptor('ProductPicture', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let urlPath = process.env.Product_Image_Destination;
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
        },
      }),
    }),
  )
  async addProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ): Promise<boolean | ProductEntity> {
    const { name, desc, price, quantity, date, json_attribute, categoryId } = req.body;
  

        let imageBaseUrl = process.env.Product_Image_Destination;
        let imageUrls = ""

    // Use the base URL for image paths
    const urls=files.map(file=>{
      

    imageBaseUrl = `${imageBaseUrl}${file.filename}`;
    const trimmedPath = imageBaseUrl.replace(process.env.Host_path, '');
        const isProduction = process.env.NODE_ENV === 'production';
    let finalUrl: string;
    if (isProduction) {
      finalUrl = `https://${trimmedPath}`;
    }
    else {
      finalUrl = trimmedPath;
    }
      imageUrls += (imageUrls ? ',' : '') + finalUrl;

    })








    
    // const imageUrls = files.map(file => `${imageBaseUrl}${file.filename}`).join(',');
  
    const productData: Partial<ProductEntity> = {
      name,
      desc,
      price: Number(price),
      quantity:Number(quantity),
      date: new Date(date),
      json_attribute,
      category: { Id: categoryId } as CategoryEntity, 
      image: imageUrls,  
    };
  
    return await this.productService.addProduct(productData);
  }
  
  @Put('/edit/:id')
@UseInterceptors(
  FilesInterceptor('ProductPicture', 10, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        let urlPath = process.env.Product_Image_Destination;

        // Detect CPanel or similar hosting and convert URL to local directory path dynamically
        // if (urlPath.startsWith('https://farseit.com')) {
          // Convert the public URL path to the local file system path
          const localPath = urlPath.replace('https://farseit.com', '/home/farseit1/public_html');
          cb(null, resolve(localPath));  // Save to the local path in the server
        // } else {
        //   // For other environments, use the resolved path as it is
        //   cb(null, resolve(urlPath));
        // }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = extname(file.originalname);
        const filename = `${uniqueSuffix}${extension}`;
        cb(null, filename);
      },
    }),
  }),
)
async editProduct(
  @Param('id', ParseIntPipe) id: number,
  @UploadedFiles() files: Express.Multer.File[],
  @Req() req: any,
): Promise<ProductEntity> {
  const imageBaseUrl = process.env.Product_Image_Destination;

  const productData: Partial<ProductEntity> = {
    name: req.body.name,
    desc: req.body.desc,
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    // date: new Date(),
    json_attribute: req.body.json_attribute,
    category: { Id: req.body.categoryId } as CategoryEntity,
    image: files.length > 0 
      ? files.map(file => `${imageBaseUrl}${file.filename}`).join(',') 
      : undefined,  // Only update the image if new files are uploaded
  };

  return await this.productService.editProduct(id, productData);
}

  

  @Delete('/delete/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.productService.deleteProduct(id);
  }
}
