using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace WebAppSample.Data;

public class WebAppSampleDbContextFactory : IDesignTimeDbContextFactory<WebAppSampleDbContext>
{
    public WebAppSampleDbContext CreateDbContext(string[] args)
    {
        WebAppSampleGlobalFeatureConfigurator.Configure();
        WebAppSampleModuleExtensionConfigurator.Configure();

        WebAppSampleEfCoreEntityExtensionMappings.Configure();
        var configuration = BuildConfiguration();

        var builder = new DbContextOptionsBuilder<WebAppSampleDbContext>()
            .UseSqlite(configuration.GetConnectionString("Default"));

        return new WebAppSampleDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .AddEnvironmentVariables();

        return builder.Build();
    }
}