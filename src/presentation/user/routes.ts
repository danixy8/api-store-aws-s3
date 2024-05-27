import { envs } from './../../config';
import { Router } from 'express';
import { UserController } from './controller';
import { UserService } from '../services/user.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FileDownloadService } from '../services/file-download.service';


export class Userroutes {


  static get routes(): Router {

    const router = Router();

    const userService = new UserService(new FileDownloadService);
    const controller = new UserController(userService);
    
    // Definir las rutas
    
    router.get('/', [ AuthMiddleware.validateJWT ], controller.getUser );
    router.delete('/', [ AuthMiddleware.validateJWT ], controller.deleteUser );

    return router;
  }


}

