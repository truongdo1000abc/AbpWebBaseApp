using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;
using WebAppSample.Entities;
using WebAppSample.Services.Product;
using WebAppSample.Services.ProductGroup;

namespace WebAppSample.ObjectMapping;
// 1. Map từ Entity (Product) ra DTO (ProductDto)
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class ProductDtoMapper : MapperBase<Product, ProductDto>
{
    public override ProductDto Map(Product source)
    {
        if (source == null) return null;
        return new ProductDto
        {
            Id = source.Id,
            Name = source.Name,
            Price = source.Price,
            Description = source.Description,
            ImageUrl = source.ImageUrl,
            Unit = source.Unit,
            Group1 = source.Group1,
            Group2 = source.Group2,
            Group3 = source.Group3,
            Group4 = source.Group4,
            Barcode = source.Barcode,
            SKU = source.SKU,
            IsActive = source.IsActive,
            StockQuantity = source.StockQuantity,
            Weight = source.Weight,
            CreationTime = source.CreationTime,
            CreatorId = source.CreatorId,
            LastModificationTime = source.LastModificationTime,
            LastModifierId = source.LastModifierId
        };
    }

    public override void Map(Product source, ProductDto destination)
    {
        if (source == null || destination == null) return;
        destination.Id = source.Id;
        destination.Name = source.Name;
        destination.Price = source.Price;
        destination.Description = source.Description;
        destination.ImageUrl = source.ImageUrl;
        destination.Unit = source.Unit;
        destination.Group1 = source.Group1;
        destination.Group2 = source.Group2;
        destination.Group3 = source.Group3;
        destination.Group4 = source.Group4;
        destination.Barcode = source.Barcode;
        destination.SKU = source.SKU;
        destination.IsActive = source.IsActive;
        destination.StockQuantity = source.StockQuantity;
        destination.Weight = source.Weight;
        destination.CreationTime = source.CreationTime;
        destination.CreatorId = source.CreatorId;
        destination.LastModificationTime = source.LastModificationTime;
        destination.LastModifierId = source.LastModifierId;
    }
}

// 2. Map từ form gửi lên (CreateUpdateProductDto) vào Entity (Product)
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class CreateUpdateProductDtoMapper : MapperBase<CreateUpdateProductDto, Product>
{
    public override Product Map(CreateUpdateProductDto source)
    {
        if (source == null) return null;
        return new Product
        {
            Name = source.Name,
            Price = source.Price,
            Description = source.Description,
            ImageUrl = source.ImageUrl,
            Unit = source.Unit,
            Group1 = source.Group1,
            Group2 = source.Group2,
            Group3 = source.Group3,
            Group4 = source.Group4,
            Barcode = source.Barcode,
            SKU = source.SKU,
            IsActive = source.IsActive,
            StockQuantity = source.StockQuantity,
            Weight = source.Weight
        };
    }

    public override void Map(CreateUpdateProductDto source, Product destination)
    {
        if (source == null || destination == null) return;
        destination.Name = source.Name;
        destination.Price = source.Price;
        destination.Description = source.Description;
        destination.ImageUrl = source.ImageUrl;
        destination.Unit = source.Unit;
        destination.Group1 = source.Group1;
        destination.Group2 = source.Group2;
        destination.Group3 = source.Group3;
        destination.Group4 = source.Group4;
        destination.Barcode = source.Barcode;
        destination.SKU = source.SKU;
        destination.IsActive = source.IsActive;
        destination.StockQuantity = source.StockQuantity;
        destination.Weight = source.Weight;
    }
}

// 3. ProductGroup entity <-> DTO mappings
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class ProductGroupDtoMapper : MapperBase<ProductGroup, ProductGroupDto>
{
    public override ProductGroupDto Map(ProductGroup source)
    {
        if (source == null) return null;
        return new ProductGroupDto
        {
            Id = source.Id,
            Name = source.Name,
            Code = source.Code,
            Description = source.Description,
            Level = source.Level,
            ParentCode = source.ParentCode,
            IsActive = source.IsActive,
            SortOrder = source.SortOrder,
            CreationTime = source.CreationTime,
            CreatorId = source.CreatorId,
            LastModificationTime = source.LastModificationTime,
            LastModifierId = source.LastModifierId
        };
    }

    public override void Map(ProductGroup source, ProductGroupDto destination)
    {
        if (source == null || destination == null) return;
        destination.Id = source.Id;
        destination.Name = source.Name;
        destination.Code = source.Code;
        destination.Description = source.Description;
        destination.Level = source.Level;
        destination.ParentCode = source.ParentCode;
        destination.IsActive = source.IsActive;
        destination.SortOrder = source.SortOrder;
        destination.CreationTime = source.CreationTime;
        destination.CreatorId = source.CreatorId;
        destination.LastModificationTime = source.LastModificationTime;
        destination.LastModifierId = source.LastModifierId;
    }
}

// 4. CreateUpdateProductGroupDto -> Product
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class CreateUpdateProductGroupDtoMapper : MapperBase<CreateUpdateProductGroupDto, ProductGroup>
{
    public override ProductGroup Map(CreateUpdateProductGroupDto source)
    {
        if (source == null) return null;
        return new ProductGroup
        {
            Name = source.Name,
            Code = source.Code,
            Description = source.Description,
            Level = source.Level,
            ParentCode = source.ParentCode,
            IsActive = source.IsActive,
            SortOrder = source.SortOrder
        };
    }

    public override void Map(CreateUpdateProductGroupDto source, ProductGroup destination)
    {
        if (source == null || destination == null) return;
        destination.Name = source.Name;
        destination.Code = source.Code;
        destination.Description = source.Description;
        destination.Level = source.Level;
        destination.ParentCode = source.ParentCode;
        destination.IsActive = source.IsActive;
        destination.SortOrder = source.SortOrder;
    }
}