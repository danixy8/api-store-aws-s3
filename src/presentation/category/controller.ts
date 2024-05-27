import { Response, Request } from 'express';
import { CreateCategoryDto, CustomError, PaginationDto } from '../../domain';
import { CategoryService } from '../services/category.service';
import { UpdateCategoryDto } from '../../domain/dtos/category/update-category.dto';
import { DeleteCategoryDto } from '../../domain/dtos/category/delete-category.dto';
import { GetCategoryByIdDto } from '../../domain/dtos/category/get-category-by-id.dto';



export class CategoryController {

  // DI
  constructor(
    private readonly categoryService: CategoryService,
  ) { }


  private handleError = ( error: unknown, res: Response ) => {
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json( { error: error.message } );
    }

    console.log( `${ error }` );
    return res.status( 500 ).json( { error: 'Internal server error' } );
  };


  createCategory = ( req: Request, res: Response ) => {

    const [ error, createCategoryDto ] = CreateCategoryDto.create( req.body );
    if ( error ) return res.status( 400 ).json( { error } );


    this.categoryService.createCategory( createCategoryDto!, req.body.user )
      .then( category => res.status( 201 ).json( category ) )
      .catch( error => this.handleError( error, res ) );


  };

  getCategories = async ( req: Request, res: Response ) => {

    const { page = 1, limit = 10 } = req.query;
    const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
    if ( error ) return res.status(400).json({ error });
    
    this.categoryService.getCategories( paginationDto! )
      .then( categories => res.json( categories ))
      .catch( error => this.handleError( error, res ) );

  };

  getCategoriesByID = async ( req: Request, res: Response ) => {

    const [ error, getCategoryByIdDto ] = GetCategoryByIdDto.create( req.query );
    if ( error ) return res.status(400).json({ error });
    
    this.categoryService.getCategoryById( getCategoryByIdDto! )
      .then( categories => res.json( categories ))
      .catch( error => this.handleError( error, res ) );

  };

  updateCategory = ( req: Request, res: Response ) => {

    const [ error, updateCategoryDto ] = UpdateCategoryDto.create( req.body, req.query );
    if ( error ) return res.status( 400 ).json( { error } );


    this.categoryService.updateCategory( updateCategoryDto!, req.body.user )
      .then( category => res.status( 201 ).json( category ) )
      .catch( error => this.handleError( error, res ) );


  };

  deleteCategory = ( req: Request, res: Response ) => {

    const [ error, deleteCategoryDto ] = DeleteCategoryDto.create( req.query );
    if ( error ) return res.status( 400 ).json( { error } );


    this.categoryService.deleteCategory( deleteCategoryDto!, req.body.user )
      .then( category => res.status( 201 ).json( category ) )
      .catch( error => this.handleError( error, res ) );


  };


}