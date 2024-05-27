
import { AmazonS3Adapter, Uuid, envs } from '../../config';
import { CustomError, UserEntity } from '../../domain';
import CloudStorageInterface from '../../config/amazon-s3.adapter';
import AWS from 'aws-sdk';
import { UploadModel } from '../../data/mongo';
import { UploadedFile } from 'express-fileupload';



export class ImageService {

  private adapter: CloudStorageInterface = new AmazonS3Adapter();


  constructor(
    private readonly uuid = Uuid.v4,
  ) { }


  async getToS3(user: UserEntity){

    const expirationSeconds = 3600; 

    try {
      const uploads = await UploadModel.find({ user: user.id });
      const filesUrls = [];

      for (const upload of uploads) {
        const params = {
          Bucket: envs.BUCKET_NAME,
          Key: upload.name, 
          Expires: expirationSeconds,
        };

        const s3 = new AWS.S3();
        const url = s3.getSignedUrl('getObject', params);
        filesUrls.push(url);
      }

      return filesUrls;
    }  catch (error) {
      throw error
    }
  
  }

  async deleteToS3(filenames: string | string[], userId: string) {
    try {
        if (typeof filenames === 'string') {
            await this.adapter.deleteFile(filenames);
            const deleteResult = await UploadModel.findOneAndDelete({ name: filenames, user: userId });
            if (!deleteResult) {
              throw CustomError.badRequest('upload not found');
            }
            return {status: 'removed', filenames};
        } else if (Array.isArray(filenames)) {
            await this.adapter.deleteFiles(filenames); 
            const deleteResult = await UploadModel.deleteMany({ name: { $in: filenames }, user: userId });
            if (!deleteResult) {
              throw CustomError.badRequest('uploads not found');
            }
            return {status: 'removed',filenames};
        } else {
            throw new Error('El parámetro "filenames" debe ser un string o un arreglo de strings');
        }
    } catch (error) {
        throw error;
    }
  }

  async multipleUploadToS3(
    files: UploadedFile[],
    user: UserEntity,
    validExtensions: string[] = ['png', 'gif', 'jpg', 'jpeg']
  ){
    const uploadedFiles = [];

    try {
      for (const file of files) {
        const fileExtension = file.mimetype.split('/').at(1) ?? '';

        if (!validExtensions.includes(fileExtension)) {
          throw CustomError.badRequest(
            `Invalid extension: ${fileExtension}, valid ones ${validExtensions}`
          );
        }

        const filename = file.name;
        const [nameWithoutExtension, extension] = [
          filename.slice(0, filename.lastIndexOf('.')),
          filename.split('.').pop(),
        ];
        const filenameForUpload = `${nameWithoutExtension}-${this.uuid()}.${extension}`;
        await this.adapter.uploadFile(file, filenameForUpload);

        const upload = new UploadModel({
          name: filenameForUpload,
          type: fileExtension,
          user: user.id,
          uploadedAt: new Date(),
        });

        const saveUpload = await upload.save();
        uploadedFiles.push(saveUpload);

      }

      return uploadedFiles;
    } catch (error) {
      throw error;
    }
  }

  async uploadToS3(file: UploadedFile, user: UserEntity,
    validExtensions: string[] = ['png','gif', 'jpg','jpeg']){

    const fileExtension = file.mimetype.split('/').at(1) ?? '';

    if ( !validExtensions.includes(fileExtension) ) {
      throw CustomError
        .badRequest(`Invalid extension: ${ fileExtension }, valid ones ${ validExtensions }`);
    }


    try {
      const filename = file.name;
      const [nameWithoutExtension, extension] = [filename.slice(0, filename.lastIndexOf('.')), filename.split('.').pop()];
      const filenameForUpload = `${nameWithoutExtension}-${this.uuid()}.${extension}`;
      await this.adapter.uploadFile(file, filenameForUpload);

      const upload = new UploadModel({
        name: filenameForUpload,
        type: fileExtension,
        user: user.id,
        uploadedAt: new Date(), 
      });

      const saveUpload = await upload.save();

      return saveUpload;
    
    } catch (error) {
      throw error;
    }
  }

}


