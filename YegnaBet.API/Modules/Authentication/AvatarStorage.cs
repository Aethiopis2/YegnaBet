namespace YegnaBet.API.Modules.Authentication;

public sealed class AvatarStorage : IAvatarStorage
{
    private static readonly string[] AllowedExtensions =
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    private readonly IWebHostEnvironment _environment;

    public AvatarStorage(
        IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> SaveAsync(
        IFormFile file,
        CancellationToken cancellationToken = default)
    {
        if (file.Length == 0)
            throw new InvalidOperationException(
                "The avatar file is empty.");

        if (file.Length > 5 * 1024 * 1024)
            throw new InvalidOperationException(
                "Avatar must be smaller than 5 MB.");

        var extension =
            Path.GetExtension(file.FileName)
                .ToLowerInvariant();

        if (!AllowedExtensions.Contains(extension))
            throw new InvalidOperationException(
                "Unsupported avatar format.");

        var uploadsPath = Path.Combine(
            _environment.WebRootPath,
            "uploads",
            "avatars");

        Directory.CreateDirectory(uploadsPath);

        var fileName =
            $"{Guid.NewGuid():N}{extension}";

        var physicalPath =
            Path.Combine(
                uploadsPath,
                fileName);

        await using var stream =
            new FileStream(
                physicalPath,
                FileMode.CreateNew,
                FileAccess.Write,
                FileShare.None);

        await file.CopyToAsync(
            stream,
            cancellationToken);

        return $"/uploads/avatars/{fileName}";
    }
}