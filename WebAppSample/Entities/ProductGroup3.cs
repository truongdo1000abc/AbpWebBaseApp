using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace WebAppSample.Entities
{
    public class ProductGroup3 : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 0;

        protected ProductGroup3() { }

        public ProductGroup3(Guid id, string name, string code = null, string description = null, bool isActive = true, int sortOrder = 0)
            : base(id)
        {
            Name = name;
            Code = code;
            Description = description;
            IsActive = isActive;
            SortOrder = sortOrder;
        }
    }
}