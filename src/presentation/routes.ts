import { Router } from 'express';

import { Authroutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';
import { ProductRoutes } from './products/routes';
import { Userroutes } from './user/routes';
import { ImageRoutes } from './image/routes';



export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', Authroutes.routes );
    router.use('/api/user', Userroutes.routes );
    router.use('/api/categories', CategoryRoutes.routes );
    router.use('/api/products', ProductRoutes.routes );
    // router.use('/api/upload', FileUploadRoutes.routes );
    router.use('/api/files', ImageRoutes.routes);
    


    return router;
  }


}

