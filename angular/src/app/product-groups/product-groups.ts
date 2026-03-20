// d:\Projects\AbpWebBaseApp\angular\src\app\product-groups\product-groups.component.ts

import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreModule, ListService, PagedResultDto } from '@abp/ng.core';
import { ThemeSharedModule, Confirmation, ConfirmationService } from '@abp/ng.theme.shared';

// Ant Design Imports
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ProductGroupService, ProductGroupDto } from '../proxy/services/product-group';

@Component({
  selector: 'app-product-groups',
  standalone: true,
  templateUrl: './product-groups.html',
  styleUrls: ['./product-groups.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    ThemeSharedModule,
    // Ant Design
    NzTableModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzTagModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzSelectModule
  ],
  providers: [ListService]
})
export class ProductGroups implements OnInit {
  public readonly list = inject(ListService);
  private readonly productGroupService = inject(ProductGroupService);
  private readonly fb = inject(FormBuilder);
  private readonly confirmation = inject(ConfirmationService);

  data = { items: [], totalCount: 0 } as PagedResultDto<ProductGroupDto>;
  form: FormGroup;
  selectedGroup = {} as ProductGroupDto;
  isModalOpen = false;
  isSaving = false;

  ngOnInit() {
    // Hook query của ListService vào API getList
    const streamCreator = (query) => this.productGroupService.getList(query);
    this.list.hookToQuery(streamCreator).subscribe((response) => {
      this.data = response;
    });
  }

  // Xử lý thay đổi phân trang/sắp xếp từ Ant Table
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

  createGroup() {
    this.selectedGroup = {} as ProductGroupDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  editGroup(id: string) {
    this.productGroupService.get(id).subscribe((group) => {
      this.selectedGroup = group;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  deleteGroup(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.productGroupService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      code: [this.selectedGroup.code || '', [Validators.required, Validators.maxLength(64)]],
      name: [this.selectedGroup.name || '', [Validators.required, Validators.maxLength(128)]],
      level: [this.selectedGroup.level || 0],
      parentCode: [this.selectedGroup.parentCode || ''],
      description: [this.selectedGroup.description || ''],
      isActive: [this.selectedGroup.isActive ?? true]
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.isSaving = true;
    const request = this.selectedGroup.id
      ? this.productGroupService.update(this.selectedGroup.id, this.form.value)
      : this.productGroupService.create(this.form.value);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.isModalOpen = false;
        this.list.get();
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }
}
