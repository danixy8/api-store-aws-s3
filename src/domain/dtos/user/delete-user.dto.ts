import { Validators, regularExps } from '../../../config';


export class DeleteUserDto {
  private constructor(
    public id: string,
  ) {}

  static create(query: { [key: string]: any }): [string?, DeleteUserDto?] {
    const { id } = query;

    if (!id) return ['User id is required'];
    if (!Validators.isMongoID(id)) return ['Invalid User ID'];

    return [undefined, new DeleteUserDto(id)];
  }
}