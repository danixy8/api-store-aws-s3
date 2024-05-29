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
            const response = await this.s3.deleteObjects(params).promise();
    
            if (response.Errors && response.Errors.length > 0) {
                const failedDeletes = response.Errors.map(error => error.Key).join(', ');
                console.error(`Failed to delete the following files: ${failedDeletes}`);
                throw new Error(`Error deleting files from S3: ${failedDeletes}`);
            }
        } catch (error) {
            console.error('Error while deleting files from S3:', error);
            throw new Error('Error deleting files from S3');
        }
    }

}
