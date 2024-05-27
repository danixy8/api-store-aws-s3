import path from 'path';
import fs from 'fs';

import { UploadedFile } from 'express-fileupload';

import { Uuid, AmazonS3Adapter, envs } from '../../config';
import { CustomError, UserEntity } from '../../domain';
import CloudStorageInterface from '../../config/amazon-s3.adapter';
import AWS from 'aws-sdk';
import { UploadModel } from '../../data/mongo';
import { EncodeFilename } from '../../config/encode-filename';


export class FileUploadService{

  private adapter: CloudStorageInterface = new AmazonS3Adapter();


  constructor(
    private readonly uuid = Uuid.v4,
  ) {}

  
  private checkFolder( folderPath: string ) {
    if ( !fs.existsSync(folderPath) ) {
      fs.mkdirSync(folderPath);
    }
  }


  async uploadSingle(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensions: string[] = ['png','gif', 'jpg','jpeg']
  ) {

    try {
      
      const fileExtension = file.mimetype.split('/').at(1) ?? '';
      
      if ( !validExtensions.includes(fileExtension) ) {
        throw CustomError
          .badRequest(`Invalid extension: ${ fileExtension }, valid ones ${ validExtensions }`);
      }

      const destination = path.resolve( __dirname, '../../../', folder );
      this.checkFolder( destination );

      const fileName = `${ this.uuid() }.${ fileExtension }`;

      file.mv(`${destination}/${ fileName }`);

      return { fileName };

    } catch (error) {
      
      // console.log({error});
      throw error;

    }



  }

  async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensions: string[] = ['png','jpg','jpeg','gif']
  ) {

    const fileNames = await Promise.all(
      files.map( file => this.uploadSingle(file, folder, validExtensions) )
    );

    return fileNames;

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

        console.log('Transformed filename:', EncodeFilename.encodeFilenameForUrl(filenameForUpload));
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

      console.log('tranform nombre', EncodeFilename.encodeFilenameForUrl(filenameForUpload));
      return saveUpload;
    
    } catch (error) {
      throw error;
    }
  }

  async deleteToS3(filenames: string | string[], userId: string) {
    try {
        if (typeof filenames === 'string') {
            await this.adapter.deleteFile(filenames);
            const deleteUpload = await UploadModel.findOneAndDelete({ name: filenames, user: userId });
            return deleteUpload;
        } else if (Array.isArray(filenames)) {
            await this.adapter.deleteFiles(filenames); 
            const deleteResult = await UploadModel.deleteMany({ name: { $in: filenames }, user: userId });
            return deleteResult;
        } else {
            throw new Error('El parámetro "filenames" debe ser un string o un arreglo de strings');
        }
    } catch (error) {
        throw error;
    }
}

}


