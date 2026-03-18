using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace WebAppSample.Services.Product
{
    public class ProductAppService : CrudAppService<
        WebAppSample.Entities.Product,
        ProductDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateUpdateProductDto>, IProductAppService
    {
        public ProductAppService(IRepository<WebAppSample.Entities.Product, Guid> repository) : base(repository)
        {
        }
    }
}
