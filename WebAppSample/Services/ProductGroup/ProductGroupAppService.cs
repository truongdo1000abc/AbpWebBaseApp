using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace WebAppSample.Services.ProductGroup
{
    public class ProductGroupAppService : CrudAppService<
        WebAppSample.Entities.ProductGroup,
        ProductGroupDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateUpdateProductGroupDto>, IProductGroupAppService
    {
        public ProductGroupAppService(IRepository<WebAppSample.Entities.ProductGroup, Guid> repository) : base(repository)
        {
        }
    }
}