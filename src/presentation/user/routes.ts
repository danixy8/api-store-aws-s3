import { envs } from './../../config';
import { Router } from 'express';
import { UserController } from './controller';
import { UserService } from '../services/user.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FileUploadService } from '../services/file-upload.service';


export class Userroutes {


  static get routes(): Router {

    const router = Router();

    const userService = new UserService(new FileUploadService);
    const controller = new UserController(userService);
    
    // Definir las rutas
    
    router.get('/', [ AuthMiddleware.validateJWT ], controller.getUser );
    router.delete('/', [ AuthMiddleware.validateJWT ], controller.deleteUser );

    return router;
  }


}

