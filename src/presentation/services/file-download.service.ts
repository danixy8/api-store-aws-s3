
import { AmazonS3Adapter, envs } from '../../config';
import { UserEntity } from '../../domain';
import CloudStorageInterface from '../../config/amazon-s3.adapter';
import AWS from 'aws-sdk';
import { UploadModel } from '../../data/mongo';



export class FileDownloadService {

  private adapter: CloudStorageInterface = new AmazonS3Adapter();


  constructor(
  ) {}


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

}


