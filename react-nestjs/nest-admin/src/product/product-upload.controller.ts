import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express, Response } from "express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller()
export class ProductUploadController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('product-image', {
    storage: diskStorage({
      destination: './uploads',
      filename(_, file, cb) {
        return cb(null, Date.now() + extname(file.originalname))
      }
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // console.log(file)
    return {
      url: `http://127.0.0.1:3000/api/uploads/${file.filename}`
    }
  }

  @Get('uploads/:path')
  async getImage(
    @Param('path') path,
    @Res() res: Response
  ) {
    res.sendFile(path, { root: 'uploads' })
  }
}
