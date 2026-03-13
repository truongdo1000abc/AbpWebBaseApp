import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Thêm ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Thêm CommonModule để dùng currency pipe
import { ListService, PagedResultDto, CoreModule } from '@abp/ng.core';
import { ConfirmationService, Confirmation, ThemeSharedModule } from '@abp/ng.theme.shared'; // Thêm ThemeSharedModule cho abp-modal
import { NgxDatatableModule } from '@swimlane/ngx-datatable'; // Thêm thư viện datatable
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'; // Thêm nút dropdown action
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Định nghĩa Interface tạm thời (thay vì lấy từ @proxy/products)
export interface ProductDto {
  id: string;
  name: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './products.html',
  imports: [
    CoreModule,
    CommonModule,
    ReactiveFormsModule,   // Bắt buộc cho [formGroup]
    NgxDatatableModule,    // Bắt buộc cho <ngx-datatable>
    ThemeSharedModule,     // Bắt buộc cho <abp-modal> và pipe abpLocalization (nếu dùng)
    NgbDropdownModule      // Bắt buộc cho <div ngbDropdown>
  ],
  providers: [ListService],
})
export class Products implements OnInit {
  product = { items: [], totalCount: 0 } as PagedResultDto<ProductDto>;
  
  isModalOpen = false;
  form: FormGroup;
  selectedProduct = {} as ProductDto;

  // 1. Dữ liệu giả lập (Mock Data)
  mockProducts: ProductDto[] = [
    { id: '1', name: 'Bàn phím cơ', price: 1500000, stock: 50 },
    { id: '2', name: 'Chuột Logitech', price: 500000, stock: 120 },
    { id: '3', name: 'Màn hình Dell 24 inch', price: 3500000, stock: 15 }
  ];

  constructor(
    public readonly list: ListService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit() {
    // 2. Giả lập luồng dữ liệu API trả về bằng RxJS `of`
    const productStreamCreator = (query) => {
      // Ép kiểu về PagedResultDto của ABP
      const response: PagedResultDto<ProductDto> = {
        items: this.mockProducts,
        totalCount: this.mockProducts.length
      };
      // Trả về luồng dữ liệu, delay 300ms để tạo cảm giác giống đang gọi server
      return of(response).pipe(delay(300)); 
    };

    this.list.hookToQuery(productStreamCreator).subscribe((response) => {
      this.product = response;
    });
  }

  createProduct() {
    this.selectedProduct = {} as ProductDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  editProduct(id: string) {
    // 3. Giả lập GetById
    const foundProduct = this.mockProducts.find(p => p.id === id);
    if (foundProduct) {
      this.selectedProduct = { ...foundProduct }; // Clone ra object mới để không ảnh hưởng dữ liệu gốc khi chưa nhấn "Lưu"
      this.buildForm();
      this.isModalOpen = true;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedProduct.name || '', Validators.required],
      price: [this.selectedProduct.price || null, Validators.required],
      stock: [this.selectedProduct.stock || 0],
    });
  }

  save() {
    if (this.form.invalid) return;

    if (this.selectedProduct.id) {
      // 4. Giả lập Update (Tìm index và cập nhật)
      const index = this.mockProducts.findIndex(p => p.id === this.selectedProduct.id);
      if (index > -1) {
        this.mockProducts[index] = { ...this.selectedProduct, ...this.form.value };
      }
    } else {
      // 5. Giả lập Create (Tạo ID ngẫu nhiên và push vào mảng)
      const newProduct: ProductDto = {
        id: Math.random().toString(36).substring(2, 9), // Random ID
        ...this.form.value
      };
      this.mockProducts.unshift(newProduct); // Thêm lên đầu danh sách
    }

    this.isModalOpen = false;
    this.form.reset();
    
    // Yêu cầu ListService load lại dữ liệu (sẽ gọi lại productStreamCreator)
    this.list.get(); 
  }

  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        // 6. Giả lập Delete (Lọc bỏ item ra khỏi mảng)
        this.mockProducts = this.mockProducts.filter(p => p.id !== id);
        
        // Cập nhật lại danh sách hiển thị
        this.list.get();
      }
    });
  }
}