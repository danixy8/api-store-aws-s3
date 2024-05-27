import { Validators } from "../../../config";




export class GetCategoryDto {

  private constructor(
    public readonly id: string,
    public readonly name?: string,
  ) {}


  static create( object: { [key: string]: any } ):[string?, GetCategoryDto?] {

    const { id, name } = object;

    if (!id && !name) return ['Category id or name is required'];
    if (id && !Validators.isMongoID(id)) return ['Invalid Category ID'];

    return [undefined, new GetCategoryDto(id, name)];

  }


}



