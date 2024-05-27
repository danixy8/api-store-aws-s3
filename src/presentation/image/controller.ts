import { Response, Request } from 'express';
import { CustomError } from '../../domain';
import { ImageService } from '../services/image.service';
import { UploadedFile } from 'express-fileupload';



export class ImageController {

  // DI
  constructor(
    private readonly imageService: ImageService,
  ) { }


  private handleError = ( error: unknown, res: Response ) => {
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json( { error: error.message } );
    }

    console.log( `${ error }` );
    return res.status( 500 ).json( { error: 'Internal server error' } );
  };


  getFile = (req: Request, res: Response) => {
    this.imageService.getToS3(req.body.user)
      .then(uploaded => res.json(uploaded))
      .catch(error => this.handleError(error, res));

  };

  deleteFile = ( req: Request, res: Response ) => {

    const type = req.params.type;
    const file = req.query.filename;

    if (typeof file === 'string') {
      this.imageService.deleteToS3(file, req.body.user.id)
        .then(uploaded => res.json(uploaded))
        .catch(error => this.handleError(error, res));
    } else {
      res.status(400).json({ error: 'Invalid file parameter' });
    }
  };

  uploadFile = ( req: Request, res: Response ) => {

    const type = req.params.type;
    const file = req.body.files.at(0) as UploadedFile;

    this.imageService.uploadToS3( file, req.body.user )
      .then( uploaded => res.json(uploaded) )
      .catch(  error => this.handleError( error, res ) )    
    // this.fileUploadService.uploadSingle( file, `uploads/${ type }` )
    //   .then( uploaded => res.json(uploaded) )
    //   .catch(  error => this.handleError( error, res ) )

  };

  
  uploadMultipleFiles = ( req: Request, res: Response ) => {

    const type = req.params.type;
    const files = req.body.files as UploadedFile[];

    this.imageService.multipleUploadToS3( files, req.body.user )
      .then( uploaded => res.json(uploaded) )
      .catch(  error => this.handleError( error, res ) )    

  };
}