using Microsoft.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using WebAppSample.Entities;

namespace WebAppSample.Data;

public class WebAppSampleDbContext : AbpDbContext<WebAppSampleDbContext>            
{
    public const string DbTablePrefix = "App";
    public const string DbSchema = null;

    public DbSet<Product> Products { get; set; }
    public DbSet<ProductGroup> ProductGroups { get; set; }

    public WebAppSampleDbContext(DbContextOptions<WebAppSampleDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */
        builder.Entity<Product>(b =>
        {
            b.ToTable("AppProducts");
            b.ConfigureByConvention(); // Map các cột mặc định của ABP

            // Core product properties
            b.Property(x => x.Name).IsRequired().HasMaxLength(128);
            b.Property(x => x.Price);
            b.Property(x => x.Description);
            b.Property(x => x.ImageUrl);

            // Unit
            b.Property(x => x.Unit).HasMaxLength(32);

            // Group codes stored as strings (map to ProductGroup.Code logically)
            b.Property(x => x.Group1).HasMaxLength(64);
            b.Property(x => x.Group2).HasMaxLength(64);
            b.Property(x => x.Group3).HasMaxLength(64);
            b.Property(x => x.Group4).HasMaxLength(64);

            // Identification & inventory
            b.Property(x => x.Barcode).HasMaxLength(64);
            b.Property(x => x.SKU).HasMaxLength(64);
            b.Property(x => x.IsActive).IsRequired().HasDefaultValue(true);
            b.Property(x => x.StockQuantity).IsRequired().HasDefaultValue(0);

            // Weight column
            b.Property(x => x.Weight).HasColumnType("decimal(18,2)");
        });

        // Mapping for ProductGroup
        builder.Entity<ProductGroup>(b =>
        {
            b.ToTable("AppProductGroups");
            b.ConfigureByConvention();
            b.Property(x => x.Name).IsRequired().HasMaxLength(128);
            b.Property(x => x.Code).HasMaxLength(64);
            b.Property(x => x.Description);
            b.Property(x => x.Level).IsRequired().HasDefaultValue(0);
            b.Property(x => x.ParentCode).HasMaxLength(64);
            b.Property(x => x.IsActive).IsRequired().HasDefaultValue(true);
            b.Property(x => x.SortOrder).HasDefaultValue(0);
        });

        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
        builder.ConfigurePermissionManagement();
        builder.ConfigureBlobStoring();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureTenantManagement();
        
        /* Configure your own entities here */
    }
}

