using Volo.Abp.Application.Services;
using WebAppSample.Localization;

namespace WebAppSample.Services;

/* Inherit your application services from this class. */
public abstract class WebAppSampleAppService : ApplicationService
{
    protected WebAppSampleAppService()
    {
        LocalizationResource = typeof(WebAppSampleResource);
    }
}