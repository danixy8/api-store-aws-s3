import { Request, Response } from 'express';
import { CustomError, GetUserDto } from '../../domain';
import { UserService } from '../services/user.service';
import { DeleteUserDto } from '../../domain/dtos/user/delete-user.dto';


export class UserController {

  // DI
  constructor(
    public readonly userService: UserService,
  ) {}

  private handleError = (error: unknown, res: Response ) => {
    if ( error instanceof CustomError ) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${ error }`);
    return res.status(500).json({ error: 'Internal server error' })
  } 


  getUser = (req: Request, res: Response) => {

    const [error, getUserDto] = GetUserDto.create(req.query);
    if ( error ) return res.status(400).json({error})


    this.userService.getUser(getUserDto!)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
      
  }

  deleteUser = (req: Request, res: Response) => {

    const [error, deleteUserDto] = DeleteUserDto.create(req.query);
    if ( error ) return res.status(400).json({error})


    this.userService.deleteUser(deleteUserDto!)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
      
  }


}