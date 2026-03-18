using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace WebAppSample.Services.Product
{
    public interface IProductAppService : ICrudAppService<
        ProductDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateUpdateProductDto>
    {
    }
}
