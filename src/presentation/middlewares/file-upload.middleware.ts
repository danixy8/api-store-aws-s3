import { NextFunction, Request, Response } from 'express';



export class FileUploadMiddleware {


  static containFiles(req: Request, res: Response, next: NextFunction ) {
    

    if ( !req.files || Object.keys(req.files).length === 0 ) {
      return res.status(400).json({ error: 'No files were selected' });
    }

    if ( !Array.isArray( req.files.file ) ) {
      req.body.files = [ req.files.file ];
    } else {
      req.body.files = req.files.file;
    }

    next();
  }

  static fileSizeLimit(req: Request, res: Response, next: NextFunction) {
    const maxSizeInMB: number = 3
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const files = req.body.files || [];

    for (const file of files) {
      if (file.size > maxSizeInBytes) {
        return res.status(400).json({ error: `File ${file.name} exceeds the size limit of ${maxSizeInMB} MB` });
      }
    }

    next();
  }

}