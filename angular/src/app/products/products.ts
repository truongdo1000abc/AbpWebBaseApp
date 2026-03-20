import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
// 1. CÁC IMPORT BẮT BUỘC CHO GIAO DIỆN
import { CommonModule } from '@angular/common'; // Để dùng *ngIf, pipe number
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Để dùng formGroup
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Observable, of, switchMap } from 'rxjs';
import { CoreModule, ListService, PagedResultDto, ConfigStateService } from '@abp/ng.core'; // Để dùng pipe abpLocalization
import { ThemeSharedModule, Confirmation, ConfirmationService } from '@abp/ng.theme.shared'; // Để dùng abp-modal và thông báo xóa

// Ant Design Imports
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzImageModule, NzImageService } from 'ng-zorro-antd/image';

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
    CKEditorModule,
    // Ant Design Modules
    NzTableModule,
    NzDropDownModule,
    NzCardModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzUploadModule,
    NzTagModule,
    NzAvatarModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzImageModule
  ],
  providers: [ListService],
  encapsulation: ViewEncapsulation.None, // Tắt encapsulation để tránh xung đột style và đảm bảo Ant Design hiển thị đúng
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
  previewImage: string | ArrayBuffer | null = null;

  // Định dạng số: Lấy cấu hình phân cách từ setting (mặc định là dấu phẩy)
  formatter = (value: number | string): string => {
    const separator = this.configState.getSetting('App.ThousandsSeparator') || ',';
    return value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : '';
  };
  parser = (value: string): string => {
    const separator = this.configState.getSetting('App.ThousandsSeparator') || ',';
    return value ? value.split(separator).join('') : '';
  };

  // -----------------------------------------------------------
  // 1. SỬ DỤNG INJECT() THAY CHO CONSTRUCTOR
  // -----------------------------------------------------------
  public readonly list = inject(ListService);
  private readonly configState = inject(ConfigStateService);
  private readonly productService = inject(ProductService);
  private readonly fileService = inject(FileService);
  private readonly productGroupService = inject(ProductGroupService);
  private readonly fb = inject(FormBuilder);
  private readonly confirmation = inject(ConfirmationService);
  private readonly nzImageService = inject(NzImageService);

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
    this.previewImage = null;
    this.isViewMode = false;
    this.form.enable();
    this.isModalOpen = true;
  }

  editProduct(id: string) {
    this.productService.get(id).subscribe((product) => {
      this.selectedProduct = product;
      this.buildForm();
      this.selectedFile = null;
      this.previewImage = null;
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
      this.previewImage = null;
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

  // Ant Design Upload: Chặn upload tự động để xử lý thủ công khi bấm Save
  beforeUpload = (file: NzUploadFile): boolean => {
    this.processFile(file as unknown as File);
    return false;
  };

  // Xử lý sự kiện Paste
  onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            this.processFile(file);
            event.preventDefault(); // Ngăn trình duyệt dán nội dung gốc
          }
          break; // Chỉ lấy ảnh đầu tiên tìm thấy
        }
      }
    }
  }

  // Hàm chung để xử lý file (từ upload hoặc paste)
  private processFile(file: File) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => (this.previewImage = reader.result);
  }

  removeImage() {
    this.previewImage = null;
    this.selectedFile = null;
    this.form.get('imageUrl').setValue(null);
    if (this.selectedProduct) {
      this.selectedProduct.imageUrl = null;
    }
  }

  // Ant Design Table: Xử lý thay đổi phân trang/sắp xếp server-side
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || undefined;
    const sortOrder = (currentSort && currentSort.value) === 'ascend' ? 'asc' : 'desc';

    this.list.maxResultCount = pageSize;
    this.list.page = pageIndex - 1;
    if (sortField) {
      this.list.sortKey = sortField;
      this.list.sortOrder = sortOrder;
    } else {
      this.list.sortKey = undefined;
      this.list.sortOrder = undefined;
    }
  }

  // Xử lý luồng: Upload ảnh (nếu có) -> Lấy URL -> Lưu DTO
  save() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.isUploading = true;

    // Step 1: Upload file if selected, otherwise get existing URL
    const fileUpload$ = this.selectedFile
      ? this.fileService.uploadImage(this.createFormData(this.selectedFile))
      : of(this.selectedProduct.imageUrl || null);

    // Step 2: After getting image URL, create/update the product
    fileUpload$.pipe(
      switchMap(imageUrl => {
        const payload = { ...this.form.value, imageUrl };
        if (this.selectedProduct.id) {
          return this.productService.update(this.selectedProduct.id, payload);
        }
        return this.productService.create(payload);
      })
    ).subscribe({
      next: () => {
        this.isUploading = false;
        this.finalizeSuccess();
      },
      error: (err) => {
        console.error(err);
        this.isUploading = false;
      }
    });
  }

  private createFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('file', file, file.name);
    // The proxy generator may not expect FormData, so we cast to `any`
    // if the generated service expects a different type for blob uploads.
    return formData as any;
  }

  private finalizeSuccess() {
    this.isModalOpen = false;
    this.form.reset();
    this.isViewMode = false;
    this.list.get();
    this.selectedFile = null;
    this.previewImage = null;
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

  getOriginalImageUrl(imageUrl?: string) {
    if (!imageUrl) return '';
    try {
      
      // Assuming imageUrl might contain a path, we extract just the filename.
      // Split by both forward slash and backslash to handle any path format
      const filename = imageUrl.split(/[/\\]/).pop();
      const host = environment.apis?.default?.url || '';
      
      // Construct the full path to the original image as per request
      return `${host.replace(/\/$/, '')}/uploads/products/${filename}`;
      
    } catch {
      // Fallback to the thumbnail URL if something goes wrong
      return this.getImageUrl(imageUrl);
    }
  }

  previewOriginalImage(imageUrl?: string) {
    if (!imageUrl) return;

    const images = [
      {
        src: this.getOriginalImageUrl(imageUrl),
        alt: 'Original Product Image'
      }
    ];
    this.nzImageService.preview(images, { nzZoom: 1, nzRotate: 0 });
  }

  // CKEditor
  public Editor: any = (ClassicEditor as any).default || ClassicEditor;
  public editorConfig: any = {
    toolbar: {
      items: [
        'heading', '|', 'bold', 'italic', 'underline', 'fontColor', 'fontBackgroundColor', 'fontSize', 'fontFamily', '|',
        'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo', 'imageUpload'
      ],
      shouldNotGroupWhenFull: true
    },
    simpleUpload: {
      uploadUrl: (environment.apis && environment.apis.default && environment.apis.default.url ? environment.apis.default.url.replace(/\/$/, '') : '') + '/api/app/file/upload-image',
      headers: {
        // Provide auth header if needed, e.g. 'Authorization': `Bearer ${token}`
      }
    }
  };
}