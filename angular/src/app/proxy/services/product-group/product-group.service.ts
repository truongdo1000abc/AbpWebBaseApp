import type { CreateUpdateProductGroupDto, ProductGroupDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductGroupService {
  private restService = inject(RestService);
  apiName = 'Default';

  create = (input: CreateUpdateProductGroupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductGroupDto>({
      method: 'POST',
      url: '/api/app/product-group',
      body: input,
    },
    { apiName: this.apiName, ...config });

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/product-group/${id}`,
    },
    { apiName: this.apiName, ...config });

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductGroupDto>({
      method: 'GET',
      url: `/api/app/product-group/${id}`,
    },
    { apiName: this.apiName, ...config });

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProductGroupDto>>({
      method: 'GET',
      url: '/api/app/product-group',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName, ...config });

  update = (id: string, input: CreateUpdateProductGroupDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProductGroupDto>({
      method: 'PUT',
      url: `/api/app/product-group/${id}`,
      body: input,
    },
    { apiName: this.apiName, ...config });
}
