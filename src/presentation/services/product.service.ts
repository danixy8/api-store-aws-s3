import { ProductModel } from '../../data';
import { CreateProductDto, CustomError, PaginationDto, UserEntity } from '../../domain';
import { DeleteProductDto } from '../../domain/dtos/products/delete-product.dto';
import { GetProductDto } from '../../domain/dtos/products/get-product.dto';
import { UpdateProductDto } from '../../domain/dtos/products/update-product.dto';



export class ProductService {

  // DI
  constructor() { }


  async createProduct( createProductDto: CreateProductDto ) {

    const productExists = await ProductModel.findOne( { name: createProductDto.name } );
    if ( productExists ) throw CustomError.badRequest( 'Product already exists' );

    try {

      const product = new ProductModel( createProductDto );

      await product.save();

      return product;

    } catch ( error ) {
      throw CustomError.internalServer( `${ error }` );
    }

  }



  async getProducts( paginationDto: PaginationDto ) {

    const { page, limit } = paginationDto;


    try {

      const [ total, products ] = await Promise.all( [
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip( ( page - 1 ) * limit )
          .limit( limit )
          .populate('user')
          .populate('category')
          // .populate('user', 'name email')
      ] );


      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/products?page=${ ( page + 1 ) }&limit=${ limit }`,
        prev: ( page - 1 > 0 ) ? `/api/products?page=${ ( page - 1 ) }&limit=${ limit }` : null,

        products: products,
      };


    } catch ( error ) {
      throw CustomError.internalServer( 'Internal Server Error' );
    }

  }

  async getProductById(getProductDto: GetProductDto) {
    try {
  
      let product;
      if (getProductDto.id) {
        product = await ProductModel.findOne({ _id: getProductDto.id });
      } else if (getProductDto.name) {
        product = await ProductModel.findOne({ name: getProductDto.name });
      }
      if (!product) {
        throw CustomError.badRequest('Product not found');
      }
  
      return product
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateProduct( updateProductDto: UpdateProductDto, user: UserEntity ) {
    try {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: updateProductDto.id },
        {
          ...updateProductDto,
          user: user.id,
        },
        { new: true } 
      );
  
      if (!updatedProduct) {
        throw CustomError.badRequest('This product does not exist');
      }
  
      return {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        available: updatedProduct.available,
        price:updatedProduct.price,
        category: updatedProduct.category,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteProduct(deleteProductDto: DeleteProductDto, user: UserEntity) {
    try {
  
      const deletedProduct = await ProductModel.findByIdAndDelete(deleteProductDto.id);
  
      if (!deletedProduct) {
        throw CustomError.badRequest('Product not found');
      }
  
      return {
        id: deletedProduct.id,
        name: deletedProduct.name,
        available: deletedProduct.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


