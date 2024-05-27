import { Validators } from "../../../config";




export class UpdateCategoryDto {

  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly id: string,
  ) {}


  static create( object: { [key: string]: any }, query: { [key: string]: any } ):[string?, UpdateCategoryDto?] {

    const { name, available=true, id } = object;

    if (!query.id) return ['Category ID is required'];
    if (!Validators.isMongoID(query.id)) return ['Invalid Category ID'];
    //if (!name) return ['Name property is necessary'];
    //if (available === undefined) return ['Available property is necessary'];

    const availableBoolean = typeof available === 'boolean' ? available : available === 'true';
    return [undefined, new UpdateCategoryDto(name, availableBoolean, query.id)];

  }


}



