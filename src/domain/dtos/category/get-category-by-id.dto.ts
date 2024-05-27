import { Validators } from "../../../config";




export class GetCategoryByIdDto {

  private constructor(
    public readonly id: string,
  ) {}


  static create( object: { [key: string]: any } ):[string?, GetCategoryByIdDto?] {

    const { id } = object;

    if (!id) return ['Category ID is required'];
    if (!Validators.isMongoID(id)) return ['Invalid Category ID'];

    return [undefined, new GetCategoryByIdDto(id)];

  }


}



