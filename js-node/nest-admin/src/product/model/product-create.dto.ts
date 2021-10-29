import { IsNotEmpty } from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  title: string;

  description: string;
  
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  price: number;
}
