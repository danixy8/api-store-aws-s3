// amazonS3Adapter.js
import AWS from 'aws-sdk';
import { envs } from './envs';
import { UploadedFile } from 'express-fileupload';
import { Uuid } from './uuid.adapter';

export default interface CloudStorageInterface {
  uploadFile(file: UploadedFile, fileName: string): Promise<string>;
}


export class AmazonS3Adapter implements CloudStorageInterface {
    private readonly uuid = Uuid.v4;
    private s3: AWS.S3;
    constructor() {
        this.s3 = new AWS.S3();
    }

    async uploadFile(file: UploadedFile, fileName: string): Promise<string> {

        const params = {
            Bucket: envs.BUCKET_NAME,
            Key: fileName,
            Body: file.data,
            ACL: 'private',
        };

        try {
            const data = await this.s3.upload(params).promise();
            return data.Location;
        } catch (error) {
            console.log(error);
            throw new Error('Error al subir el archivo a S3');
        }
    }
}
