import { Response, Request } from 'express';
import { CustomError } from '../../domain';
import { FileUploadService } from '../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';



export class FileUploadController {

  // DI
  constructor(
    private readonly fileUploadService: FileUploadService,
  ) { }


  private handleError = ( error: unknown, res: Response ) => {
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json( { error: error.message } );
    }

    console.log( `${ error }` );
    return res.status( 500 ).json( { error: 'Internal server error' } );
  };


  uploadFile = ( req: Request, res: Response ) => {

    const type = req.params.type;
    const file = req.body.files.at(0) as UploadedFile;

    console.log('llego 1');
    this.fileUploadService.uploadToS3( file, req.body.user )
      .then( uploaded => res.json(uploaded) )
      .catch(  error => this.handleError( error, res ) )    
    // this.fileUploadService.uploadSingle( file, `uploads/${ type }` )
    //   .then( uploaded => res.json(uploaded) )
    //   .catch(  error => this.handleError( error, res ) )

  };

  
  uploadMultipleFiles = ( req: Request, res: Response ) => {

    const type = req.params.type;
    const files = req.body.files as UploadedFile[];

    console.log('llego 1');
    this.fileUploadService.multipleUploadToS3( files, req.body.user )
      .then( uploaded => res.json(uploaded) )
      .catch(  error => this.handleError( error, res ) )    

  };

}