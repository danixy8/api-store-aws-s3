
import mongoose from 'mongoose';
import { UserModel } from '../../data';
import { CustomError, GetUserDto } from '../../domain';
import { DeleteUserDto } from '../../domain/dtos/user/delete-user.dto';
import { UploadModel } from '../../data/mongo';



export class UserService {

  // DI
  constructor() { }
  public async getUser( getUserDto: GetUserDto ) {

    try {
      let user;
      if (getUserDto.id) {
        user = await UserModel.findOne({ _id: getUserDto.id });
      } else if (getUserDto.email) {
        user = await UserModel.findOne({ email: getUserDto.email });
      }
      if (!user) {
        throw CustomError.badRequest('User not found');
      }
  
      return {
        id: user.id,
        name: user.name,
        mail: user.email,
        emailValidated: user.emailValidated,
        role: user.role,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

  }

  public async deleteUser( deleteUserDto: DeleteUserDto ) {
    let session = null;
    
    try {
      session = await mongoose.startSession();
      session.startTransaction();

        await UploadModel.deleteMany({ user: deleteUserDto.id });

        const user = await UserModel.findOneAndDelete({ _id: deleteUserDto.id });

        await session.commitTransaction();
        console.log(`User with ID ${deleteUserDto.id} and its associated records have been deleted`);

        if(user){
          return {
            state: 'deleted',
            id: user.id,
            name: user.name,
            mail: user.email
          };
        }
  

      } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        console.error('Error while deleting user and records:', error);
    } finally {
        if (session) {
            session.endSession();
        }
    }

  }

}