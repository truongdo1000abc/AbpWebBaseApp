import { Component, OnInit, inject } from '@angular/core';
// 1. CÁC IMPORT BẮT BUỘC CHO GIAO DIỆN
import { CommonModule } from '@angular/common'; // Để dùng *ngIf, pipe number
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Để dùng formGroup
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Observable } from 'rxjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'; // Để dùng menu dropdown Thao tác
import { NgxDatatableModule } from '@swimlane/ngx-datatable'; // Để dùng ngx-datatable
import { CoreModule, ListService, PagedResultDto } from '@abp/ng.core'; // Để dùng pipe abpLocalization
import { ThemeSharedModule, Confirmation, ConfirmationService } from '@abp/ng.theme.shared'; // Để dùng abp-modal và thông báo xóa

import { ProductService, ProductDto } from '../proxy/services/product' // Đường dẫn có thể thay đổi tùy cấu trúc proxy của bạn
import { environment } from '../../environments/environment';
import { FileService } from '../proxy/services/files'; // Đường dẫn file service proxy
import { ProductGroupService, ProductGroupDto } from '../proxy/services/product-group';


@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
  imports: [
    // 3. KHAI BÁO CÁC MODULE VÀO ĐÂY ĐỂ HTML NHẬN DIỆN ĐƯỢC THẺ
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    ThemeSharedModule,
    NgxDatatableModule,
    CKEditorModule,
    NgbDropdownModule
  ],
  providers: [ListService], // Khai báo provider ở đây để ListService gắn với vòng đời của component này
})
export class Products implements OnInit {
  product = { items: [], totalCount: 0 } as PagedResultDto<ProductDto>;
  productGroups: ProductGroupDto[] = [];
  form: FormGroup;
  selectedProduct = {} as ProductDto;
  isModalOpen = false;
  isViewMode = false;
  
  // Biến dùng cho việc upload ảnh
  selectedFile: File;
  isUploading = false;

  // -----------------------------------------------------------
  // 1. SỬ DỤNG INJECT() THAY CHO CONSTRUCTOR
  // -----------------------------------------------------------
  public readonly list = inject(ListService);
  private readonly productService = inject(ProductService);
  private readonly fileService = inject(FileService);
  private readonly productGroupService = inject(ProductGroupService);
  private readonly fb = inject(FormBuilder);
  private readonly confirmation = inject(ConfirmationService);

  ngOnInit() {
    // HookToQuery tự động lắng nghe sự thay đổi của phân trang/sắp xếp và gọi API
    const productStreamCreator = (query) => this.productService.getList(query);
    this.list.hookToQuery(productStreamCreator).subscribe((response) => {
      this.product = response;
    });
    this.productGroupService.getList({ maxResultCount: 1000 } as any).subscribe((res) => {
      this.productGroups = res.items;
    });
  }

  createProduct() {
    this.selectedProduct = {} as ProductDto;
    this.buildForm();
    this.selectedFile = null;
    this.isViewMode = false;
    this.form.enable();
    this.isModalOpen = true;
  }

  editProduct(id: string) {
    this.productService.get(id).subscribe((product) => {
      this.selectedProduct = product;
      this.buildForm();
      this.selectedFile = null;
      this.isViewMode = false;
      this.form.enable();
      this.isModalOpen = true;
    });
  }

  viewProduct(id: string) {
    this.productService.get(id).subscribe((product) => {
      this.selectedProduct = product;
      this.buildForm();
      this.selectedFile = null;
      this.isViewMode = true;
      this.form.disable();
      this.isModalOpen = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedProduct.name || '', [Validators.required, Validators.maxLength(128)]],
      price: [this.selectedProduct.price || 0, [Validators.required, Validators.min(0)]],
      description: [this.selectedProduct.description || ''],
      imageUrl: [this.selectedProduct.imageUrl || ''],
      // New fields (mapped to BE)
      unit: [this.selectedProduct.unit || ''],
      group1: [this.selectedProduct.group1 || ''],
      group2: [this.selectedProduct.group2 || ''],
      group3: [this.selectedProduct.group3 || ''],
      group4: [this.selectedProduct.group4 || ''],
      barcode: [this.selectedProduct.barcode || ''],
      sku: [this.selectedProduct.sku || ''],
      isActive: [this.selectedProduct.isActive ?? true],
      stockQuantity: [this.selectedProduct.stockQuantity ?? 0, [Validators.min(0)]],
      weight: [this.selectedProduct.weight ?? null],
    });
  }

  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.productService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

  // Bắt sự kiện khi người dùng chọn file
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Xử lý luồng: Upload ảnh (nếu có) -> Lấy URL -> Lưu DTO
  save() {
    if (this.form.invalid) return;

    // If a file is selected, save the product first, then upload image and update the product.
    if (this.selectedFile) {
      this.isUploading = true;

      const payload = this.form.value;
      const saveRequest: Observable<any> = this.selectedProduct.id
        ? this.productService.update(this.selectedProduct.id, payload)
        : this.productService.create(payload);

      saveRequest.subscribe({
        next: (savedProduct: ProductDto) => {
          // After product saved successfully, upload image
          const formData = new FormData();
          formData.append('file', this.selectedFile, this.selectedFile.name);

          this.fileService.uploadImage(formData as any).subscribe({
            next: (url: string) => {
              // Update product with imageUrl. If this fails, product is still created/updated.
              this.productService.update(savedProduct.id, { ...payload, imageUrl: url }).subscribe({
                next: () => {
                  this.isUploading = false;
                  this.finalizeSuccess();
                },
                error: () => {
                  this.isUploading = false;
                  this.finalizeSuccess();
                }
              });
            },
            error: () => {
              // Upload failed but product was saved. Stop uploading flag and finalize.
              this.isUploading = false;
              this.finalizeSuccess();
            }
          });
        },
        error: () => {
          // Saving product failed; clear uploading flag so UI can recover
          this.isUploading = false;
        }
      });
    } else {
      // No file selected: just save product
      this.submitForm().subscribe(() => this.finalizeSuccess());
    }
  }

  private submitForm(): Observable<ProductDto> {
    const request = this.selectedProduct.id
      ? this.productService.update(this.selectedProduct.id, this.form.value)
      : this.productService.create(this.form.value);

    return request;
  }

  private finalizeSuccess() {
    this.isModalOpen = false;
    this.form.reset();
    this.isViewMode = false;
    this.list.get();
  }

  // Trả về URL đầy đủ cho ảnh: nếu imageUrl đã là absolute thì giữ nguyên,
  // nếu là relative thì prepend host từ environment.apis.default.url
  getImageUrl(imageUrl?: string) {
    if (!imageUrl) return '';
    try {
      if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
      const host = environment.apis?.default?.url || '';
      return host.replace(/\/$/, '') + '/' + imageUrl.replace(/^\//, '');
    } catch {
      return imageUrl;
    }
  }

  // CKEditor
  public Editor: any = (ClassicEditor as any).default || ClassicEditor;
  public editorConfig: any = {
    toolbar: [
      'heading', '|', 'bold', 'italic', 'underline', 'fontColor', 'fontBackgroundColor', 'fontSize', 'fontFamily', '|',
      'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo', 'imageUpload'
    ],
    simpleUpload: {
      uploadUrl: (environment.apis && environment.apis.default && environment.apis.default.url ? environment.apis.default.url.replace(/\/$/, '') : '') + '/api/app/file/upload-image',
      headers: {
        // Provide auth header if needed, e.g. 'Authorization': `Bearer ${token}`
      }
    }
  };
}