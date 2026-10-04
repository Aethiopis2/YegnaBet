namespace YegnaBet.API.Modules.Authentication;

public sealed class JwtOptions
{
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string Key { get; set; } = null!;
    public int AccessTokenMinutes { get; set; } = 20;
}