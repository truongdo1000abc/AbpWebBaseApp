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
      requiredPolicy: 'MyProject.Products',
    },
    {
      path: '/invoices',
      name: '::Menu:Invoice', 
      iconClass: 'fas fa-file-invoice',        
      order: 2,                        
      layout: eLayoutType.application, 
      // Dòng này cực kỳ quan trọng: Khớp chính xác với chuỗi string ở C#
      requiredPolicy: 'MyProject.Invoices',
    }
  ]);
}
