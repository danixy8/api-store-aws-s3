import { Validators } from "../../../config";




export class DeleteProductDto {

  private constructor(
    public readonly id: string,
  ) {}


  static create( object: { [key: string]: any } ):[string?, DeleteProductDto?] {

    const { id } = object;

    if (!id) return ['Product ID is required'];
    if (!Validators.isMongoID(id)) return ['Invalid Product ID'];

    return [undefined, new DeleteProductDto(id)];

  }


}



