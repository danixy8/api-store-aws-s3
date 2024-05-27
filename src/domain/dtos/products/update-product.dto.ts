import { Validators } from '../../../config';

export class UpdateProductDto {

  private constructor(
    public readonly id: string,
    public readonly category: string, // ID
    public readonly name?: string,
    public readonly available=true,
    public readonly price?: number,
    public readonly description?: string
  ) { }

  static create( props: { [ key: string ]: any; }, query: { [key: string]: any } ): [ string?, UpdateProductDto?] {

    const {
      category,
      name,
      available,
      price,
      description,
    } = props;

    if(!query.id) return ['product ID is required'];
    
    if ( !Validators.isMongoID(category) ) return ['Invalid Category ID'];
    if ( !Validators.isMongoID(query.id) ) return ['Invalid Product ID'];

    return [
      undefined,
      new UpdateProductDto(
        query.id,
        category,
        name,
        available,
        price,
        description,
      )
    ];


  }


}