import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreModule, ListService, PagedResultDto } from '@abp/ng.core';
import { ThemeSharedModule, Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ProductGroupService, ProductGroupDto } from '../proxy/services/product-group';

@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.html',
  styleUrls: ['./product-groups.scss'],
  imports: [CommonModule, ReactiveFormsModule, CoreModule, ThemeSharedModule, NgxDatatableModule],
  providers: [ListService]
})
export class ProductGroups implements OnInit {
  productGroups = { items: [], totalCount: 0 } as PagedResultDto<ProductGroupDto>;
  form: FormGroup;
  selected = {} as ProductGroupDto;
  isModalOpen = false;
  isViewMode = false;

  public readonly list = inject(ListService);
  private readonly service = inject(ProductGroupService);
  private readonly fb = inject(FormBuilder);
  private readonly confirmation = inject(ConfirmationService);

  ngOnInit() {
    const streamCreator = (query) => this.service.getList(query);
    this.list.hookToQuery(streamCreator).subscribe((res) => (this.productGroups = res));
  }

  create() {
    this.selected = {} as ProductGroupDto;
    this.buildForm();
    this.isViewMode = false;
    this.form.enable();
    this.isModalOpen = true;
  }

  edit(id: string) {
    this.service.get(id).subscribe((item) => {
      this.selected = item;
      this.buildForm();
      this.isViewMode = false;
      this.form.enable();
      this.isModalOpen = true;
    });
  }

  view(id: string) {
    this.service.get(id).subscribe((item) => {
      this.selected = item;
      this.buildForm();
      this.isViewMode = true;
      this.form.disable();
      this.isModalOpen = true;
    });
  }

  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service.delete(id).subscribe(() => this.list.get());
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      name: [this.selected.name || '', [Validators.required, Validators.maxLength(128)]],
      code: [this.selected.code || '', [Validators.maxLength(64)]],
      description: [this.selected.description || ''],
      level: [this.selected.level ?? 0],
      parentCode: [this.selected.parentCode || ''],
      isActive: [this.selected.isActive ?? true],
      sortOrder: [this.selected.sortOrder ?? 0]
    });
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value;
    const call = this.selected.id ? this.service.update(this.selected.id, payload) : this.service.create(payload as any);
    call.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.isViewMode = false;
      this.list.get();
    });
  }
}
