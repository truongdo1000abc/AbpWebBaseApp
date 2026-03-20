import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, ProductDto } from '../proxy/services/product'; // Đảm bảo đường dẫn đúng tới proxy của bạn
import { CoreModule, ConfigStateService } from '@abp/ng.core';
import { ThemeSharedModule, ToasterService } from '@abp/ng.theme.shared';

// Ant Design Imports
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

interface CartItem extends ProductDto {
  cartId: string; // ID duy nhất trong giỏ (phòng trường hợp trùng sp nhưng khác thuộc tính nếu cần sau này)
  quantity: number;
  totalPrice: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None, // Tắt style encapsulation để style in có thể ảnh hưởng toàn trang
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    ThemeSharedModule,
    // Ant Design
    NzGridModule,
    NzSelectModule,
    NzTableModule,
    NzFormModule,
    NzCardModule,
    NzInputNumberModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzDividerModule,
    NzTagModule,
    NzDescriptionsModule,
    NzRadioModule
  ]
})
export class SalesComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private toaster = inject(ToasterService);
  private configState = inject(ConfigStateService);

  // Search Products
  search$ = new Subject<string>();
  isSearching = false;
  searchResult: ProductDto[] = [];
  selectedProduct: string | null = null;

  // Cart
  cart: CartItem[] = [];
  lastOrder: any = null; // Lưu đơn hàng vừa thanh toán để in
  isQrModalVisible = false; // Trạng thái hiển thị modal QR
  savedDrafts: any[] = []; // Danh sách đơn hàng tạm
  isDraftModalVisible = false; // Modal danh sách đơn tạm
  
  // Cấu hình QR Ngân hàng (Bạn hãy thay đổi thông tin này)
  bankId = 'VCB'; // Mã ngân hàng (VD: MB, VCB, TPBank, VPBank...)
  bankAccount = '0000123456789'; // Số tài khoản
  bankName = 'DO MANH TRUONG'; // Tên chủ tài khoản
  
  // Danh sách gợi ý tiền mặt
  denominations = [500000, 200000, 100000, 50000];

  // Payment Form
  paymentForm: FormGroup;
  isSaving = false;

  // Định dạng tiền tệ
  formatterCurrency = (value: number | string): string => {
    const separator = this.configState.getSetting('App.ThousandsSeparator') || ',';
    return value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : '';
  };
  parserCurrency = (value: string): string => {
    const separator = this.configState.getSetting('App.ThousandsSeparator') || ',';
    return value ? value.split(separator).join('') : '';
  };

  ngOnInit() {
    // Init Form
    this.paymentForm = this.fb.group({
      customerName: ['Khách lẻ', [Validators.required]],
      customerPhone: [''],
      discount: [0, [Validators.min(0)]],
      paymentMethod: ['Cash', [Validators.required]],
      customerPaid: [0, [Validators.min(0)]], // Tiền khách đưa
      note: ['']
    });

    // Handle Search Debounce
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        this.isSearching = true;
        // Gọi API getList với filter filterText (hoặc keyword tùy backend của bạn)
        // Giả sử backend hỗ trợ filterText
        return this.productService.getList({ filter: term, maxResultCount: 20 } as any);
      })
    ).subscribe({
      next: (res) => {
        this.searchResult = res.items;
        this.isSearching = false;
      },
      error: () => {
        this.isSearching = false;
        this.searchResult = [];
      }
    });

    // Load initial products (top 20)
    this.onSearch('');
    // Load drafts from storage
    this.loadDrafts();
  }

  onSearch(value: string): void {
    this.search$.next(value);
  }

  addProductToCart(productId: string) {
    if (!productId) return;

    const product = this.searchResult.find(x => x.id === productId);
    if (!product) return;

    const existingItem = this.cart.find(x => x.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
      this.updateLineTotal(existingItem);
    } else {
      const newItem: CartItem = {
        ...product,
        cartId: this.generateId(),
        quantity: 1,
        totalPrice: product.price
      };
      // Thêm vào đầu danh sách để dễ thấy
      this.cart = [newItem, ...this.cart];
    }
    
    // Reset selection để người dùng chọn tiếp
    this.selectedProduct = null;
    // this.toaster.success(`Added ${product.name}`);
  }

  updateQuantity(item: CartItem, qty: number) {
    if (qty <= 0) {
      this.removeFromCart(item.cartId);
      return;
    }
    item.quantity = qty;
    this.updateLineTotal(item);
  }

  updateLineTotal(item: CartItem) {
    item.totalPrice = item.price * item.quantity;
    // Cần kích hoạt lại change detection cho mảng nếu dùng OnPush, 
    // ở đây dùng Default nên Angular tự lo, nhưng gán lại mảng giúp trigger nz-table update tốt hơn
    this.cart = [...this.cart]; 
  }

  removeFromCart(cartId: string) {
    this.cart = this.cart.filter(x => x.cartId !== cartId);
  }

  // Getters for Summaries
  get subTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  get discountAmount(): number {
    return this.paymentForm.get('discount')?.value || 0;
  }

  get totalDue(): number {
    const total = this.subTotal - this.discountAmount;
    return total > 0 ? total : 0;
  }

  get customerPaid(): number {
    return this.paymentForm.get('customerPaid')?.value || 0;
  }

  get changeAmount(): number {
    // Tiền trả lại = Tiền khách đưa - Khách cần trả
    const change = this.customerPaid - this.totalDue;
    return change > 0 ? change : 0;
  }

  // Tạo URL QR Code VietQR động theo số tiền
  get qrCodeUrl(): string {
    if (this.totalDue <= 0) return '';
    
    // Format: https://img.vietqr.io/image/[BankId]-[AccountNo]-[Template].png?amount=[Amount]&addInfo=[Content]&accountName=[Name]
    const amount = this.totalDue;
    const addInfo = encodeURIComponent(`Thanh toan don hang`);
    
    // Template: 'compact' (nhỏ gọn), 'qr_only' (chỉ mã QR), 'print' (đầy đủ)
    return `https://img.vietqr.io/image/${this.bankId}-${this.bankAccount}-compact.png?amount=${amount}&addInfo=${addInfo}&accountName=${encodeURIComponent(this.bankName)}`;
  }

  showQrModal() {
    if (this.totalDue > 0) {
      this.isQrModalVisible = true;
    } else {
      this.toaster.warn('Không có số tiền để tạo mã QR');
    }
  }

  setCustomerPaid(amount: number) {
    this.paymentForm.patchValue({ customerPaid: amount });
  }

  submitOrder() {
    if (this.cart.length === 0) {
      this.toaster.warn('::Sales:CartEmpty'); // "Giỏ hàng trống"
      return;
    }
    if (this.paymentForm.invalid) {
      return;
    }

    this.isSaving = true;

    // Giả lập gọi API tạo đơn hàng
    const orderData = {
      items: this.cart.map(x => ({ productId: x.id, quantity: x.quantity, price: x.price })),
      subTotal: this.subTotal,
      discount: this.discountAmount,
      totalAmount: this.totalDue,
      customerPaid: this.customerPaid,
      changeAmount: this.changeAmount,
      paymentMethod: this.paymentForm.value.paymentMethod,
      note: this.paymentForm.value.note
    };

    console.log('Order Data:', orderData);

    // Ở đây bạn sẽ gọi service, ví dụ: OrderService.create(orderData)
    setTimeout(() => {
      this.isSaving = false;
      
      // 1. Lưu dữ liệu để in
      this.lastOrder = {
        code: 'HD' + Math.floor(Date.now() / 1000), // Mã giả lập
        createdDate: new Date(),
        items: [...this.cart], // Copy mảng
        subTotal: this.subTotal,
        discount: this.discountAmount,
        totalDue: this.totalDue,
        ...this.paymentForm.value
      };

      // 2. Gọi lệnh in sau một khoảng delay nhỏ để DOM cập nhật
      setTimeout(() => {
        window.print();
        
        // 3. Reset sau khi hộp thoại in hiện lên
        this.toaster.success('::Sales:OrderCreatedSuccessfully');
        this.resetSale();
      }, 200);
    }, 800);
  }

  // --- DRAFT LOGIC ---
  loadDrafts() {
    const stored = localStorage.getItem('pos_drafts');
    if (stored) {
      try {
        this.savedDrafts = JSON.parse(stored);
      } catch {
        this.savedDrafts = [];
      }
    }
  }

  saveDraftsToStorage() {
    localStorage.setItem('pos_drafts', JSON.stringify(this.savedDrafts));
  }

  saveDraft() {
    if (this.cart.length === 0) {
      this.toaster.warn('Giỏ hàng trống, không thể lưu.');
      return;
    }
    const draft = {
      timestamp: new Date(),
      cart: [...this.cart],
      formValue: this.paymentForm.value,
      subTotal: this.subTotal,
      totalDue: this.totalDue
    };
    this.savedDrafts.unshift(draft);
    this.saveDraftsToStorage();
    this.resetSale();
    this.toaster.success('Đã lưu đơn hàng tạm thành công');
  }

  deleteDraft(index: number) {
    this.savedDrafts.splice(index, 1);
    this.saveDraftsToStorage();
  }

  selectDraft(index: number) {
    const draft = this.savedDrafts[index];
    this.cart = draft.cart || [];
    this.paymentForm.patchValue(draft.formValue);
    this.deleteDraft(index); // Xóa khỏi danh sách sau khi chọn
    this.isDraftModalVisible = false;
    this.toaster.success('Đã khôi phục đơn hàng');
  }

  resetSale() {
    this.cart = [];
    this.paymentForm.reset({
      discount: 0,
      paymentMethod: 'Cash',
      customerPaid: 0,
      note: ''
    });
    this.onSearch('');
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
