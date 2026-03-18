import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateProductGroupDto {
  name: string;
  code?: string;
  description?: string;
  level?: number;
  parentCode?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ProductGroupDto extends AuditedEntityDto<string> {
  name?: string;
  code?: string;
  description?: string;
  level?: number;
  parentCode?: string;
  isActive?: boolean;
  sortOrder?: number;
}
