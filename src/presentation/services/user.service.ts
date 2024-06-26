
import mongoose from 'mongoose';
import { UserModel } from '../../data';
import { CustomError, GetUserDto } from '../../domain';
import { DeleteUserDto } from '../../domain/dtos/user/delete-user.dto';
import { UploadModel } from '../../data/mongo';
import { ImageService } from './image.service';



export class UserService {
  private readonly fileDownloadService: ImageService;
  // DI
  constructor(downloadService: ImageService) {
    this.fileDownloadService = downloadService;
}
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

      const user = await UserModel.findOneAndDelete({ _id: deleteUserDto.id });
      
      const uploadRegistries = await UploadModel.find({ user: deleteUserDto.id });
      const filenames = uploadRegistries.map(registry => registry.name);
      if(filenames.length > 0) {
        this.fileDownloadService.deleteToS3(filenames, deleteUserDto.id);
      }

      await session.commitTransaction();
      console.log(`User with ID ${deleteUserDto.id} and its associated records have been deleted`);

      if(user){
        return {
          status: 'removed',
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