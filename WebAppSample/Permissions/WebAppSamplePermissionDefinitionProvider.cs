using WebAppSample.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace WebAppSample.Permissions;

public class WebAppSamplePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var appGroup = context.AddGroup(WebAppSamplePermissions.GroupName, L("AppManagement"));

        // Định nghĩa quyền cho Products
        var productPermission = appGroup.AddPermission(WebAppSamplePermissions.Products.Default, L("Permission:Products"));
        productPermission.AddChild(WebAppSamplePermissions.Products.Create, L("Permission:Create"));
        productPermission.AddChild(WebAppSamplePermissions.Products.Edit, L("Permission:Edit"));
        productPermission.AddChild(WebAppSamplePermissions.Products.Delete, L("Permission:Delete"));

        // Định nghĩa quyền cho ProductGroups
        var productGroupPermission = appGroup.AddPermission(WebAppSamplePermissions.ProductGroups.Default, L("Permission:ProductGroups"));
        productGroupPermission.AddChild(WebAppSamplePermissions.ProductGroups.Create, L("Permission:Create"));
        productGroupPermission.AddChild(WebAppSamplePermissions.ProductGroups.Edit, L("Permission:Edit"));
        productGroupPermission.AddChild(WebAppSamplePermissions.ProductGroups.Delete, L("Permission:Delete"));

        //Define your own permissions here. Example:
        //myGroup.AddPermission(WebAppSamplePermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<WebAppSampleResource>(name);
    }
}
