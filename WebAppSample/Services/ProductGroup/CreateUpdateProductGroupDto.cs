using System.ComponentModel.DataAnnotations;

namespace WebAppSample.Services.ProductGroup
{
    public class CreateUpdateProductGroupDto
    {
        [Required]
        [MaxLength(128)]
        public string Name { get; set; }

        [MaxLength(64)]
        public string Code { get; set; }

        public string Description { get; set; }

        public int Level { get; set; } = 0;

        [MaxLength(64)]
        public string ParentCode { get; set; }

        public bool IsActive { get; set; } = true;

        public int SortOrder { get; set; } = 0;
    }
}