namespace YegnaBet.API.Modules.Authentication;

public interface ICurrentUser
{
    long Id { get; }
    string? Role { get; }
    bool IsAuthenticated { get; }
}