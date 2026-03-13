using WebAppSample.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace WebAppSample.Permissions;

public class WebAppSamplePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(WebAppSamplePermissions.GroupName);

        // Định nghĩa quyền xem danh sách (dùng cho Menu)
        var productPermission = myGroup.AddPermission("MyProject.Products", L("Products"));
        
        // Định nghĩa các quyền thao tác chi tiết (Thêm, Sửa, Xóa)
        productPermission.AddChild("MyProject.Products.Create", L("Create"));
        productPermission.AddChild("MyProject.Products.Edit", L("Edit"));
        productPermission.AddChild("MyProject.Products.Delete", L("Delete"));

        //Define your own permissions here. Example:
        //myGroup.AddPermission(WebAppSamplePermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<WebAppSampleResource>(name);
    }
}
