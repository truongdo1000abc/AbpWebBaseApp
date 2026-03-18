using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using System.IO;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;

namespace WebAppSample.Controllers
{
    [ApiController]
    [Route("images/products/thumb")]
    public class ImagesController : AbpController
    {
        private readonly IWebHostEnvironment _env;

        public ImagesController(IWebHostEnvironment env)
        {
            _env = env;
        }

        // GET /images/products/thumb/{fileName}?w=200&h=0
        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetThumbnail(string fileName, [FromQuery] int w = 200, [FromQuery] int h = 0)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return BadRequest();

            var filePath = Path.Combine(_env.WebRootPath, "uploads", "products", fileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound();

            // Load original and create resized image in-memory
            using var fs = System.IO.File.OpenRead(filePath);
            using var image = await Image.LoadAsync(fs);

            var targetWidth = w > 0 ? w : 0;
            var targetHeight = h > 0 ? h : 0;

            var resizeOptions = new ResizeOptions
            {
                Mode = ResizeMode.Max,
                Size = new Size(
                    targetWidth > 0 ? targetWidth : image.Width,
                    targetHeight > 0 ? targetHeight : image.Height)
            };

            image.Mutate(x => x.Resize(resizeOptions));

            await using var ms = new MemoryStream();

            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            string contentType;
            if (ext == ".jpg" || ext == ".jpeg")
            {
                await image.SaveAsJpegAsync(ms, new JpegEncoder { Quality = 75 });
                contentType = "image/jpeg";
            }
            else if (ext == ".png")
            {
                await image.SaveAsPngAsync(ms);
                contentType = "image/png";
            }
            else if (ext == ".gif")
            {
                await image.SaveAsGifAsync(ms);
                contentType = "image/gif";
            }
            else
            {
                // default to jpeg if unknown
                await image.SaveAsJpegAsync(ms, new JpegEncoder { Quality = 75 });
                contentType = "image/jpeg";
            }

            ms.Position = 0;

            // Cache thumbnails for faster repeated loads (do not persist on disk).
            Response.Headers["Cache-Control"] = "public,max-age=604800"; // 7 days

            return File(ms.ToArray(), contentType);
        }
    }
}