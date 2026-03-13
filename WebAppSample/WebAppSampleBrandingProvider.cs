using Microsoft.Extensions.Localization;
using WebAppSample.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace WebAppSample;

[Dependency(ReplaceServices = true)]
public class WebAppSampleBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<WebAppSampleResource> _localizer;

    public WebAppSampleBrandingProvider(IStringLocalizer<WebAppSampleResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}