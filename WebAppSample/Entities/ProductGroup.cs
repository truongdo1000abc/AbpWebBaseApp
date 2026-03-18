using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace WebAppSample.Entities
{
    public class ProductGroup : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; set; }
        public string Code { get; set; } // optional mã nhóm
        public string Description { get; set; }

        // New: hierarchical support and level
        public int Level { get; set; } = 0;
        public string ParentCode { get; set; } // inherit/associate from another group via code

        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 0;

        public ProductGroup() { }

        public ProductGroup(Guid id, string name, string code = null, string description = null,
                            int level = 0, string parentCode = null, bool isActive = true, int sortOrder = 0)
            : base(id)
        {
            Name = name;
            Code = code;
            Description = description;
            Level = level;
            ParentCode = parentCode;
            IsActive = isActive;
            SortOrder = sortOrder;
        }
    }
}