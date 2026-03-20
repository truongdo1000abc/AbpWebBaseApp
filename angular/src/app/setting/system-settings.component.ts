import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService, ConfigStateService, CoreModule } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule, // Để dùng pipe abpLocalization
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzCardModule
  ],
  template: `
    <nz-card [nzTitle]="'::products__SystemSettings' | abpLocalization">
      <form nz-form [formGroup]="form" (ngSubmit)="save()" nzLayout="vertical">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="thousandsSeparator">
            {{ '::products__ThousandsSeparator' | abpLocalization }}
          </nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <nz-select id="thousandsSeparator" formControlName="thousandsSeparator">
              <nz-option nzValue="," [nzLabel]="'Comma (,)'"></nz-option>
              <nz-option nzValue="." [nzLabel]="'Dot (.)'"></nz-option>
              <nz-option nzValue=" " [nzLabel]="'Space ( )'"></nz-option>
            </nz-select>
            <div class="form-text text-muted mt-2">
              {{ '::products__ThousandsSeparatorDesc' | abpLocalization }}
            </div>
          </nz-form-control>
        </nz-form-item>
        
        <div class="text-end">
            <button nz-button nzType="primary" [nzLoading]="saving" type="submit">
                <span nz-icon nzType="save"></span>
                {{ '::products__Save' | abpLocalization }}
            </button>
        </div>
      </form>
    </nz-card>
  `
})
export class SystemSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rest = inject(RestService);
  private toaster = inject(ToasterService);
  private config = inject(ConfigStateService);

  form: FormGroup;
  saving = false;

  ngOnInit() {
    // Lấy giá trị hiện tại từ ConfigState (được load lúc app start)
    const currentSeparator = this.config.getSetting('App.ThousandsSeparator') || ',';
    
    this.form = this.fb.group({
      thousandsSeparator: [currentSeparator, [Validators.required]],
    });
  }

  save() {
    if (this.form.invalid) return;

    this.saving = true;
    
    // Gọi API để lưu setting. 
    // Lưu ý: Bạn cần tạo API endpoint tương ứng ở Backend (.NET) để nhận và lưu setting này.
    // Ví dụ: SettingAppService.UpdateSystemSettingsAsync
    const body = {
        thousandsSeparator: this.form.value.thousandsSeparator
    };

    this.rest.request({
      method: 'POST',
      url: '/api/app/setting/system', // Đổi đường dẫn này theo API Backend của bạn
      body: body
    }).subscribe({
      next: () => {
        this.toaster.success('::SavedSuccessfully');
        this.saving = false;
        // Reload lại trang để setting mới có hiệu lực ngay lập tức (cập nhật ConfigState)
        setTimeout(() => window.location.reload(), 1000); 
      },
      error: (err) => {
        this.saving = false;
      }
    });
  }
}
