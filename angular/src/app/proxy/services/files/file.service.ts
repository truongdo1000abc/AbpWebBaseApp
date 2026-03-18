import { RestService, Rest } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private restService = inject(RestService);
  apiName = 'Default';
  

  uploadImage = (file: FormData, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/file/upload-image',
      body: file,
    },
    { apiName: this.apiName,...config });
}