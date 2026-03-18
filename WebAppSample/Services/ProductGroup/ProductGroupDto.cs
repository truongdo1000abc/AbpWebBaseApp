using System;
using Volo.Abp.Application.Dtos;

namespace WebAppSample.Services.ProductGroup
{
    public class ProductGroupDto : AuditedEntityDto<Guid>
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }

        public int Level { get; set; }
        public string ParentCode { get; set; }

        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
    }
}