using Volo.Abp.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace WebAppSample.Data;

public class WebAppSampleDbSchemaMigrator : ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public WebAppSampleDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        
        /* We intentionally resolving the WebAppSampleDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<WebAppSampleDbContext>()
            .Database
            .MigrateAsync();

    }
}
