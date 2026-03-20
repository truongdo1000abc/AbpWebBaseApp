import { RoutesService, eLayoutType } from '@abp/ng.core';
import { provideAppInitializer, inject } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  provideAppInitializer(() => {
    configureRoutes();
  }),
];

function configureRoutes() {
  const routes = inject(RoutesService);
  routes.add([
    {
      path: '/',
      name: '::Menu:Home',
      iconClass: 'fas fa-home',
      order: 1,
      layout: eLayoutType.application,
    },
    {
      path: '/products',
      name: '::Menu:Products', 
      iconClass: 'fas fa-tags',        
      order: 2,                        
      layout: eLayoutType.application, 
      // Dòng này cực kỳ quan trọng: Khớp chính xác với chuỗi string ở C#
      requiredPolicy: 'AppManagement.Products',
    },
    {
      path: '/sales',
      name: '::Menu:Sales', // Key đa ngôn ngữ hoặc để text cứng nếu chưa có
      iconClass: 'fas fa-shopping-cart',
      order: 1.5, // Hiển thị ngay sau Home
      layout: eLayoutType.application,
      // requiredPolicy: 'AppManagement.Sales', // Bỏ comment nếu muốn phân quyền
    },
    {
      path: '/invoices',
      name: '::Menu:Invoice', 
      iconClass: 'fas fa-file-invoice',        
      order: 3,                        
      layout: eLayoutType.application, 
      // Dòng này cực kỳ quan trọng: Khớp chính xác với chuỗi string ở C#
      requiredPolicy: 'AppManagement.Invoices',
    }
    ,
    {
      path: '/product-groups',
      name: '::Menu:ProductGroups',
      iconClass: 'fas fa-layer-group',
      order: 4,
      layout: eLayoutType.application,
      requiredPolicy: 'AppManagement.ProductGroups',
    }
  ]);
}
