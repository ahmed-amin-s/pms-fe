import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-update-product',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css',
})
export class UpdateProductComponent {
  productForm: FormGroup;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private messageService: MessageService,

    private router: Router
  ) {
    this.productForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getById(this.productId).subscribe((response) => {
      const product = response.data;
      this.productForm.patchValue({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
      });
    });
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      this.productService
        .update(this.productForm.value, this.productId)
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product added successfully!',
            });
            // this.router.navigate(['/products']);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add product. Please try again.',
            });
          }
        );
    }
  }
}
