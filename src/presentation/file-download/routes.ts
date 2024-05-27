import { Router } from 'express';
import { FileDownloadService } from '../services/file-download.service';
import { FileDownloadController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';



export class FileDownloadRoutes {


  static get routes(): Router {

    const router = Router();
    const controller = new FileDownloadController(
      new FileDownloadService()
    );

    router.get( '/', [ AuthMiddleware.validateJWT ], controller.getFile );
    router.delete( '/', [ AuthMiddleware.validateJWT ], controller.deleteFile );
    return router;
  }


}

