using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace WebAppSample.Services.ProductGroup
{
    public interface IProductGroupAppService : ICrudAppService<
        ProductGroupDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateUpdateProductGroupDto>
    {
    }
}