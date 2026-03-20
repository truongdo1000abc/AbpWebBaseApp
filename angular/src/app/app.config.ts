import { provideAbpCore, withOptions } from '@abp/ng.core';
import { provideAbpOAuth } from '@abp/ng.oauth';
import { provideSettingManagementConfig } from '@abp/ng.setting-management/config';
import { provideFeatureManagementConfig } from '@abp/ng.feature-management';
import { provideAbpThemeShared,  } from '@abp/ng.theme.shared';
import { provideIdentityConfig } from '@abp/ng.identity/config';
import { provideAccountConfig } from '@abp/ng.account/config';
import { provideTenantManagementConfig } from '@abp/ng.tenant-management/config';
import { registerLocaleForEsBuild } from '@abp/ng.core/locale';
import { provideThemeLeptonX } from '@abp/ng.theme.lepton-x';
import { provideSideMenuLayout } from '@abp/ng.theme.lepton-x/layouts';
import { provideLogo, withEnvironmentOptions } from "@abp/ng.theme.shared";
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routes';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { FOOTER_PROVIDER } from './footer/footer.config';

// NG-ZORRO Config
import { vi_VN, provideNzI18n, ja_JP } from 'ng-zorro-antd/i18n';

// 1. Thêm 2 dòng này để tải sẵn file tiếng Việt của Angular
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import localeJa from '@angular/common/locales/ja';

// 2. Khai báo cứng luôn cho cả 2 trường hợp vi và vi-VN
registerLocaleData(localeVi, 'vi');
registerLocaleData(localeVi, 'vi-VN');
registerLocaleData(localeJa, 'ja');
registerLocaleData(localeJa, 'ja-JP');

// 3. Viết một hàm "vá lỗi" để chặn việc ABP đi tìm file động đối với tiếng Việt
const abpRegisterLocale = registerLocaleForEsBuild();
const customRegisterLocaleFn = (cultureName: string) => {
  if (cultureName.includes('vi') || cultureName.includes('ja')) {
    return Promise.resolve(); // Trả về thành công luôn, khỏi đi tìm file nữa
  }
  return abpRegisterLocale(cultureName); // Các ngôn ngữ khác kệ cho ABP tự lo
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    APP_ROUTE_PROVIDER,
    FOOTER_PROVIDER,
    provideAnimations(),
    provideAbpCore(
      withOptions({
        environment,
        //registerLocaleFn: registerLocaleForEsBuild(),
        // 4. Thay thế hàm mặc định của ABP bằng hàm vá lỗi của chúng ta
        registerLocaleFn: customRegisterLocaleFn,
      }),
    ),
    provideAbpOAuth(),
    provideIdentityConfig(),
    provideSettingManagementConfig(),
    provideFeatureManagementConfig(),
    provideAccountConfig(),
    provideTenantManagementConfig(),
    provideAbpThemeShared(),
    provideThemeLeptonX(),
    provideSideMenuLayout(),
    provideLogo(withEnvironmentOptions(environment)),
    provideNzI18n(vi_VN), // Cấu hình tiếng Việt cho Ant Design
    provideNzI18n(ja_JP), // Cấu hình tiếng Nhật Bản cho Ant Design
  ]
};
