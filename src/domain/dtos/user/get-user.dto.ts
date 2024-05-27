import { Validators, regularExps } from '../../../config';


export class GetUserDto {
  private constructor(
    public id?: string,
    public email?: string,
  ) {}

  static create(query: { [key: string]: any }): [string?, GetUserDto?] {
    const { id, email } = query;

    if (!id && !email) return ['User id or email is required'];
    if (id && !Validators.isMongoID(id)) return ['Invalid User ID'];
    if (email && !regularExps.email.test(email)) return ['Email is not valid'];

    return [undefined, new GetUserDto(id, email)];
  }
}