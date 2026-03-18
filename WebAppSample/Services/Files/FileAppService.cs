using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Volo.Abp.Application.Services;
using Volo.Abp.Content;

namespace WebAppSample.Services.Files
{
    public class FileAppService : ApplicationService
    {
        private readonly IWebHostEnvironment _env;

        public FileAppService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> UploadImageAsync(IRemoteStreamContent file)
        {
            var uploadFolder = Path.Combine(_env.WebRootPath, "uploads", "products");
            if (!Directory.Exists(uploadFolder)) Directory.CreateDirectory(uploadFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.GetStream().CopyToAsync(fileStream);
            }

            // Return a dynamic thumbnail URL (does not save a thumbnail on disk).
            // The endpoint will read the original image and serve a resized image on-the-fly.
            // Default width = 200 for fast loading. FE can override with ?w=... or ?h=...
            return $"/images/products/thumb/{uniqueFileName}?w=200";
        }
    }
}
