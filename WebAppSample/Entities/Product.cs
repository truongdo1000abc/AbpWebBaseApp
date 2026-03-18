using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace WebAppSample.Entities
{
    public class Product : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; } // Đường dẫn ảnh

        // Unit
        public string Unit { get; set; }

        // Keep Group1..Group4 as string codes that correspond to ProductGroup.Code
        public string Group1 { get; set; }
        public string Group2 { get; set; }
        public string Group3 { get; set; }
        public string Group4 { get; set; }

        public string Barcode { get; set; }
        public string SKU { get; set; }
        public bool IsActive { get; set; } = true;
        public int StockQuantity { get; set; } = 0;
        public decimal? Weight { get; set; }

        public Product() { }

        public Product(
            Guid id,
            string name,
            decimal price,
            string description,
            string imageUrl,
            string unit = null,
            string group1 = null,
            string group2 = null,
            string group3 = null,
            string group4 = null,
            string barcode = null,
            string sku = null,
            bool isActive = true,
            int stockQuantity = 0,
            decimal? weight = null)
            : base(id)
        {
            Name = name;
            Price = price;
            Description = description;
            ImageUrl = imageUrl;
            Unit = unit;
            Group1 = group1;
            Group2 = group2;
            Group3 = group3;
            Group4 = group4;
            Barcode = barcode;
            SKU = sku;
            IsActive = isActive;
            StockQuantity = stockQuantity;
            Weight = weight;
        }
    }
}
