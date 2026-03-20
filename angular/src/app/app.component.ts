import { Component, inject, OnInit } from '@angular/core';
import { DynamicLayoutComponent } from '@abp/ng.core';
import { LoaderBarComponent } from '@abp/ng.theme.shared';
import { SettingTabsService } from '@abp/ng.setting-management/config';
import { SystemSettingsComponent } from './setting/system-settings.component';


@Component({
  selector: 'app-root',
  template: `
    <abp-loader-bar />
    <abp-dynamic-layout />
  `,
  imports: [LoaderBarComponent, DynamicLayoutComponent],
})
export class AppComponent implements OnInit {
  private settingTabs = inject(SettingTabsService);

  ngOnInit() {
    this.settingTabs.add([
      {
        name: '::products__SystemSettings', // Tên Tab (Key đa ngôn ngữ)
      order: 1, // Vị trí hiển thị (1 là đầu tiên)
      requiredPolicy: '', // Quyền truy cập nếu cần (VD: 'App.Settings')
      component: SystemSettingsComponent,
      }
    ]);
  }
}
