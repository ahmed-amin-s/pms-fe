import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProductDto } from '../../dto/product-dto';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  imports: [
    TableModule,
    SliderModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    CommonModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: ProductDto[] = [];
  filters: any = {};
  minPrice: number = 0;
  maxPrice: number = 0;
  priceRange: number[] = [0, 0];
  constructor(
    private productService: ProductService = inject(ProductService),
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef),
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts() {
    this.productService.getList().subscribe(
      (res) => {
        console.log(res);
        this.products = res.data;
        this.minPrice = Math.min(
          ...this.products.map((product) => product.price)
        );
        this.maxPrice = Math.max(
          ...this.products.map((product) => product.price)
        );

        this.priceRange = [this.minPrice, this.maxPrice];
        if (this.products.length == 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'No products available. Please add a new product.',
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete product. Please try again.',
        });
      }
    );
  }

  onGlobalSearch(event: any) {
    const query = event.target.value;
    this.filters['global'] = { value: query, matchMode: 'contains' };
    console.log(this.filters); // Debugging: see the filter value
    this.cdr.detectChanges();
    this.products = [...this.products];
  }
  onPriceRangeChange() {
    const [minPrice, maxPrice] = this.priceRange;

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      console.error('Invalid price range values');
      return;
    }

    this.filters['price'] = {
      value: [minPrice, maxPrice],
      matchMode: 'between',
    };

    this.products = [...this.products];
  }

  goToAddProduct(): void {
    this.router.navigate(['/add-product']);
  }

  navigateToUpdate(productId: number): void {
    this.router.navigate(['/update-product', productId]);
  }
  confirmDelete(product: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the product "${product.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProduct(product.id);
      },
    });
  }

  deleteProduct(productId: number): void {
    this.productService.delete(productId).subscribe(
      () => {
        this.products = this.products.filter((p) => p.id !== productId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product deleted successfully!',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete product. Please try again.',
        });
      }
    );
  }
}
