using System;
using Volo.Abp.Application.Dtos;

namespace WebAppSample.Services.Product
{
    public class ProductDto : AuditedEntityDto<Guid>
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        // Unit
        public string Unit { get; set; }

        // Group codes (inherited from ProductGroup.Code)
        public string Group1 { get; set; }
        public string Group2 { get; set; }
        public string Group3 { get; set; }
        public string Group4 { get; set; }

        public string Barcode { get; set; }
        public string SKU { get; set; }
        public bool IsActive { get; set; }
        public int StockQuantity { get; set; }
        public decimal? Weight { get; set; }
    }
}
