/// <reference types="multer" />
import { Response } from "express";
export declare class ProductUploadController {
    uploadFile(file: Express.Multer.File): {
        url: string;
    };
    getImage(path: any, res: Response): Promise<void>;
}
