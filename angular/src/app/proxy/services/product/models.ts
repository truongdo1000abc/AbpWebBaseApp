import type { AuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateProductDto {
  name: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  // New fields
  unit?: string;
  group1?: string;
  group2?: string;
  group3?: string;
  group4?: string;
  barcode?: string;
  sku?: string;
  isActive?: boolean;
  stockQuantity?: number;
  weight?: number | null;
}

export interface ProductDto extends AuditedEntityDto<string> {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  // New fields
  unit?: string;
  group1?: string;
  group2?: string;
  group3?: string;
  group4?: string;
  barcode?: string;
  sku?: string;
  isActive?: boolean;
  stockQuantity?: number;
  weight?: number | null;
}
