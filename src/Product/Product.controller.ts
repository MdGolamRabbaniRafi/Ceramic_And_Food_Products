import { Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express'; // Ensure correct import
import { diskStorage } from 'multer';
import { extname, normalize, resolve } from 'path';
import { CategoryEntity } from 'src/Category/Category.entity';
import { ProductEntity } from './Product.entity';
import { ProductService } from './Product.service';


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

    return { message: "Product not found" };
  }

  @Get('/search')
  async Search(): Promise<{ message: string } | any[]> {

    const productEntities = await this.productService.Search();
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

  async SearchByCategoryID(@Param('CategoryId', ParseIntPipe) Id: number): Promise<{ message: string } | any[]> {
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

    return { message: "Not found" };
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


    let imageUrls = ""

    // Use the base URL for image paths
    const urls = files.map(file => {

      let imageBaseUrl = process.env.Product_Image_Destination;

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
      quantity: Number(quantity),
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
  async editProduct(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ): Promise<ProductEntity | { message: string }> {
    let imageUrls = ""

    // Use the base URL for image paths
    const urls = files.map(file => {

      let imageBaseUrl = process.env.Product_Image_Destination;

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
    const productData: Partial<ProductEntity> = {
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price !== undefined && req.body.price !== ''
        ? Number(req.body.price)
        : undefined,

      quantity: req.body.quantity !== undefined && req.body.quantity !== ''
        ? Number(req.body.quantity)
        : undefined,

      // date: new Date(),
      json_attribute: req.body.json_attribute,
      ...(req.body.categoryId && {
        category: { Id: req.body.categoryId } as CategoryEntity,
      }), 
      image: files.length > 0
        ? imageUrls
        : undefined,  // Only update the image if new files are uploaded
    };
    return await this.productService.editProduct(id, productData);
  }



  @Delete('/delete/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return await this.productService.deleteProduct(id);
  }
}
