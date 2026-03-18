using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace YourProjectName.Products
{
    public class Product : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }

        // Bắt buộc phải có constructor rỗng cho Entity Framework
        protected Product() { }

        public Product(Guid id, string name, decimal price, string description = null)
            : base(id)
        {
            Name = name;
            Price = price;
            Description = description;
        }
    }
}