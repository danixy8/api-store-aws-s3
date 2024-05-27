import { Validators } from "../../../config";




export class DeleteCategoryDto {

  private constructor(
    public readonly id: string,
  ) {}


  static create( object: { [key: string]: any } ):[string?, DeleteCategoryDto?] {

    if(!object.id) return ['product ID is required'];
    const { id } = object;

    if (!id) return ['Category ID is required'];
    if (!Validators.isMongoID(id)) return ['Invalid Category ID'];

    return [undefined, new DeleteCategoryDto(id)];

  }


}



