using Microsoft.EntityFrameworkCore;
using YegnaBet.API.Modules.Finance.Dtos;
using YegnaBet.Domain.Entities;
using YegnaBet.Domain.Enums;
using YegnaBet.Infrastructure.Persistence;

namespace YegnaBet.API.Modules.Finance.Services
{
    public class FinanceService
    {
        private readonly BrokerDbContext _db;

        public FinanceService(BrokerDbContext db)
        {
            _db = db;
        }

        public async Task<FinanceDashboardDto> GetDashboardDtoAsync()
        {
            var revenue = await _db.FinancialTransactions
                .Where(x => x.TransactionType == "commission_earned")
                .SumAsync(x => (decimal?)x.Amount) ?? 0;
            
            var expenses = await _db.Expenses.SumAsync(x => (decimal?)x.Amount) ?? 0;
            
            var outstanding = await _db.Deals
                .Where(x => x.DealStatus == DealStatus.Successful)
                .SumAsync(x => (decimal?)x.CommissionAmount) ?? 0; 
            
            var deals = await _db.Deals.CountAsync(x => x.DealStatus == DealStatus.Successful);
            
            return new FinanceDashboardDto
            {
                Revenue = revenue,
                Expenses = expenses,
                Profit = revenue - expenses,
                Outstanding = outstanding,
                DealsCompleted = deals
            };
        }

        public async Task AddExpenseAsync(CreateExpenseDto dto)
        {
            _db.Expenses.Add(new Expense
            {
                Category = dto.Category,
                Amount = dto.Amount,
                Description = dto.Description
            });
            
            await _db.SaveChangesAsync();
        }
    }
}
