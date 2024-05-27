// amazonS3Adapter.js
import AWS from 'aws-sdk';
import { envs } from './envs';
import { UploadedFile } from 'express-fileupload';
import { Uuid } from './uuid.adapter';

export default interface CloudStorageInterface {
  uploadFile(file: UploadedFile, fileName: string): Promise<string>;
  deleteFile(fileName: string): Promise<string>;
  deleteFiles(fileNames: string[]): Promise<void>; 
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

    async deleteFile(fileName: string): Promise<string> {

        const params = {
            Bucket: envs.BUCKET_NAME,
            Key: fileName
        };

        try {
            await this.s3.deleteObject(params).promise();
            return 'Archivo borrado exitosamente';
        } catch (error) {
            console.log(error);
            throw new Error('Error al borrar el archivo a S3');
        }
    }

    async deleteFiles(fileNames: string[]): Promise<void> {
        const objectsToDelete = fileNames.map(fileName => ({ Key: fileName }));

        const params = {
            Bucket: envs.BUCKET_NAME,
            Delete: { Objects: objectsToDelete }
        };

        try {
            await this.s3.deleteObjects(params).promise();
        } catch (error) {
            console.log(error);
            throw new Error('Error al borrar los archivos a S3');
        }
    }

}
