import { Router } from 'express';
import { ImageService } from '../services/image.service';
import { ImageController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';



export class ImageRoutes {


  static get routes(): Router {

    const router = Router();
    const controller = new ImageController(
      new ImageService()
    );

    router.get( '/', [ AuthMiddleware.validateJWT ], controller.getFile );
    router.delete( '/', [ AuthMiddleware.validateJWT ], controller.deleteFile );

    router.post( 
      '/single/:type', 
      [
        FileUploadMiddleware.containFiles,
        FileUploadMiddleware.fileSizeLimit,
        TypeMiddleware.validTypes(['users']),
        AuthMiddleware.validateJWT 
      ], 
      controller.uploadFile 
    );

    router.post( 
      '/multiple/:type', 
      [
        FileUploadMiddleware.containFiles,
        FileUploadMiddleware.fileSizeLimit,
        TypeMiddleware.validTypes(['users']),
        AuthMiddleware.validateJWT 
      ], 
      controller.uploadMultipleFiles 
    );

    return router;
  }


}

