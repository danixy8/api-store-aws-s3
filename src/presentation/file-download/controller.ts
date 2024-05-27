import { Response, Request } from 'express';
import { CustomError } from '../../domain';
import { FileUploadService } from '../services/file-upload.service';
import { FileDownloadService } from '../services/file-download.service';



export class FileDownloadController {

  // DI
  constructor(
    private readonly fileDownloadService: FileDownloadService,
  ) { }


  private handleError = ( error: unknown, res: Response ) => {
    console.log('entro a aqui33');
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json( { error: error.message } );
    }

    console.log( `${ error }` );
    return res.status( 500 ).json( { error: 'Internal server error' } );
  };


  getFile = (req: Request, res: Response) => {
    this.fileDownloadService.getToS3(req.body.user)
      .then(uploaded => res.json(uploaded))
      .catch(error => this.handleError(error, res));

  };

  deleteFile = ( req: Request, res: Response ) => {

    const type = req.params.type;
    const file = req.query.filename;

    if (typeof file === 'string') {
      this.fileDownloadService.deleteToS3(file, req.body.user.id)
        .then(uploaded => res.json(uploaded))
        .catch(error => this.handleError(error, res));
    } else {
      res.status(400).json({ error: 'Invalid file parameter' });
    }
  };
}