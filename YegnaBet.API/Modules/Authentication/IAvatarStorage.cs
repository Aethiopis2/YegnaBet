namespace YegnaBet.API.Modules.Authentication;

public interface IAvatarStorage
{
    Task<string> SaveAsync(
        IFormFile file,
        CancellationToken cancellationToken = default);
}