export interface ProductDto {
  id?: number;
  name: string;
  price: number;
  description: string;
  createDate: Date;
}
export interface CreateProductDto {
  id?: number;
  name: string;
  price: number;
  description: string;
}
