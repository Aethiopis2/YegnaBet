using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Employee.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Employee.Services;

public sealed class EmployeeDirectoryService(
    BrokerDbContext db,
    IPasswordHasher<User> passwordHasher)
{
    public async Task<List<EmployeeAccountDto>> GetAll(CancellationToken cancellationToken)
    {
        return await db.Users
            .AsNoTracking()
            .Where(user => user.Role == UserRole.Employee)
            .OrderByDescending(user => user.IsActive)
            .ThenBy(user => user.FullName)
            .Select(user => new EmployeeAccountDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email ?? "",
                IsActive = user.IsActive,
                IsVerified = user.IsVerified,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<EmployeeAccountDto> Get(long employeeId, CancellationToken cancellationToken)
    {
        var employee = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Id == employeeId && user.Role == UserRole.Employee,
                cancellationToken)
            ?? throw new KeyNotFoundException("Employee account was not found.");

        return ToDto(employee);
    }

    public async Task<EmployeeAccountDto> Create(
        CreateEmployeeAccountRequest request,
        CancellationToken cancellationToken)
    {
        var phone = request.PhoneNumber.Trim();
        var email = request.Email.Trim().ToLowerInvariant();
        await EnsureUnique(phone, email, null, cancellationToken);

        var employee = new User
        {
            Role = UserRole.Employee,
            FullName = request.FullName.Trim(),
            PhoneNumber = phone,
            Email = email,
            IsActive = true,
            IsVerified = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        employee.PasswordHash = passwordHasher.HashPassword(employee, request.Password);

        db.Users.Add(employee);
        await db.SaveChangesAsync(cancellationToken);
        return ToDto(employee);
    }

    public async Task<EmployeeAccountDto> Update(
        long employeeId,
        UpdateEmployeeAccountRequest request,
        CancellationToken cancellationToken)
    {
        var employee = await db.Users
            .FirstOrDefaultAsync(user => user.Id == employeeId && user.Role == UserRole.Employee,
                cancellationToken)
            ?? throw new KeyNotFoundException("Employee account was not found.");

        var phone = request.PhoneNumber.Trim();
        var email = request.Email.Trim().ToLowerInvariant();
        await EnsureUnique(phone, email, employeeId, cancellationToken);

        employee.FullName = request.FullName.Trim();
        employee.PhoneNumber = phone;
        employee.Email = email;
        employee.IsActive = request.IsActive;
        employee.IsVerified = request.IsVerified;
        employee.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(request.NewPassword))
        {
            if (request.NewPassword.Length < 6)
                throw new ArgumentException("Password must be at least 6 characters.");
            employee.PasswordHash = passwordHasher.HashPassword(employee, request.NewPassword);
        }

        if (!employee.IsActive)
            await RevokeRefreshTokens(employeeId, cancellationToken);

        await db.SaveChangesAsync(cancellationToken);
        return ToDto(employee);
    }

    public async Task Remove(
        long employeeId,
        long currentEmployeeId,
        CancellationToken cancellationToken)
    {
        if (employeeId == currentEmployeeId)
            throw new ArgumentException("You cannot remove your own employee account.");

        var employee = await db.Users
            .FirstOrDefaultAsync(user => user.Id == employeeId &&
                user.Role == UserRole.Employee && user.IsActive, cancellationToken)
            ?? throw new KeyNotFoundException("Active employee account was not found.");

        employee.IsActive = false;
        employee.UpdatedAt = DateTime.UtcNow;
        await RevokeRefreshTokens(employeeId, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureUnique(
        string phone,
        string email,
        long? exceptId,
        CancellationToken cancellationToken)
    {
        var phoneQuery = db.Users.Where(user => user.PhoneNumber == phone);
        var emailQuery = db.Users.Where(user => user.Email != null && user.Email.ToLower() == email);
        if (exceptId.HasValue)
        {
            phoneQuery = phoneQuery.Where(user => user.Id != exceptId.Value);
            emailQuery = emailQuery.Where(user => user.Id != exceptId.Value);
        }

        if (await phoneQuery.AnyAsync(cancellationToken))
            throw new ArgumentException("That phone number is already in use.");

        if (await emailQuery.AnyAsync(cancellationToken))
            throw new ArgumentException("That email address is already in use.");
    }

    private async Task RevokeRefreshTokens(long employeeId, CancellationToken cancellationToken)
    {
        var tokens = await db.RefreshTokens
            .Where(token => token.UserId == employeeId && token.RevokedAt == null)
            .ToListAsync(cancellationToken);

        foreach (var token in tokens)
            token.RevokedAt = DateTime.UtcNow;
    }

    private static EmployeeAccountDto ToDto(User employee) => new()
    {
        Id = employee.Id,
        FullName = employee.FullName,
        PhoneNumber = employee.PhoneNumber,
        Email = employee.Email ?? "",
        IsActive = employee.IsActive,
        IsVerified = employee.IsVerified,
        CreatedAt = employee.CreatedAt,
        UpdatedAt = employee.UpdatedAt
    };
}
