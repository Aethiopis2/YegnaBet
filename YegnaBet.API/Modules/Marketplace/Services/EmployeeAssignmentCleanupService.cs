namespace YegnaBet.API.Modules.Marketplace.Services;

public sealed class EmployeeAssignmentCleanupService
    : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public EmployeeAssignmentCleanupService(
        IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope =
                    _scopeFactory.CreateScope();

                var service =
                    scope.ServiceProvider
                        .GetRequiredService<
                            EmployeeAssignmentService>();

                service.CleanupExpired();
            }
            catch
            {
                /*
                 * Don't allow the cleanup worker to die
                 * because of one cleanup failure.
                 *
                 * Add proper logging here later.
                 */
            }

            await Task.Delay(
                TimeSpan.FromMinutes(1),
                stoppingToken);
        }
    }
}