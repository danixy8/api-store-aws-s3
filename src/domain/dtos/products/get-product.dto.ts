import { Validators } from "../../../config";




export class GetProductDto {

  private constructor(
    public readonly id: string,
    public readonly name?: string,
  ) {}


  static create( object: { [key: string]: any } ):[string?, GetProductDto?] {

    const { id, name } = object;

    if (!id && !name) return ['Product id or name is required'];
    if (id && !Validators.isMongoID(id)) return ['Invalid product ID'];

    return [undefined, new GetProductDto(id, name)];

  }


}



