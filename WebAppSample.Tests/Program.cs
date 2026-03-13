using Microsoft.AspNetCore.Builder;
using WebAppSample;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
builder.Environment.ContentRootPath = GetWebProjectContentRootPathHelper.Get("WebAppSample.csproj");
await builder.RunAbpModuleAsync<WebAppSampleTestModule>(applicationName: "WebAppSample");
namespace WebAppSample
{
    public partial class Program
    {
    }
}
