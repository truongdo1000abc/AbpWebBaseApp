using System;
using System.ComponentModel.DataAnnotations;

namespace WebAppSample.Services.Product
{
    public class CreateUpdateProductDto
    {
        [Required]
        [MaxLength(128)]
        public string Name { get; set; }

        public decimal Price { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; } // Gửi đường dẫn ảnh đã upload lên đây

        // Unit
        [MaxLength(32)]
        public string Unit { get; set; }

        // Group codes for selection (store ProductGroup.Code)
        [MaxLength(64)]
        public string Group1 { get; set; }

        [MaxLength(64)]
        public string Group2 { get; set; }

        [MaxLength(64)]
        public string Group3 { get; set; }

        [MaxLength(64)]
        public string Group4 { get; set; }

        [MaxLength(64)]
        public string Barcode { get; set; }

        [MaxLength(64)]
        public string SKU { get; set; }

        public bool IsActive { get; set; } = true;

        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; } = 0;

        public decimal? Weight { get; set; }
    }
}
