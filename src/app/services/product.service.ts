import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductDto, ProductDto } from '../dto/product-dto';
import { ApiResponse } from '../dto/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl: string = `https://localhost:44332/api/products`;

  constructor(private httpClient: HttpClient = inject(HttpClient)) {}

  create(obj: CreateProductDto): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(`${this.apiUrl}`, obj);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.httpClient.delete<ApiResponse<any>>(
      `${this.apiUrl}` + `/${id}`
    );
  }

  update(obj: CreateProductDto, id: number): Observable<ApiResponse<any>> {
    return this.httpClient.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, obj);
  }

  getList(): Observable<ApiResponse<ProductDto[]>> {
    return this.httpClient.get<ApiResponse<ProductDto[]>>(`${this.apiUrl}`);
  }
  getById(id: number): Observable<ApiResponse<ProductDto>> {
    return this.httpClient.get<ApiResponse<ProductDto>>(
      `${this.apiUrl}` + `/${id}`
    );
  }
}
