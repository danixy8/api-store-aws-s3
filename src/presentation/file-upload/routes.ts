import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';





export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const controller = new FileUploadController(
      new FileUploadService()
    );


    router.use( FileUploadMiddleware.containFiles );
    router.use( FileUploadMiddleware.fileSizeLimit );
    // router.use( TypeMiddleware.validTypes(['users','products','categories']) );
    router.use( TypeMiddleware.validTypes(['users']) );

    
    // Definir las rutas
    // api/upload/single/<user|category|product>/
    // api/upload/multiple/<user|category|product>/
    router.post( '/single/:type', [ AuthMiddleware.validateJWT ], controller.uploadFile );
    router.post( '/multiple/:type', [ AuthMiddleware.validateJWT ], controller.uploadMultipleFiles );

    return router;
  }


}

