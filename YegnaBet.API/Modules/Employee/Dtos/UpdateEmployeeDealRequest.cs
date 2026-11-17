using System.ComponentModel.DataAnnotations;
using YegnaBet.Domain.Enums;

namespace YegnaBet.API.Modules.Employee.Dtos;

public sealed class UpdateEmployeeDealRequest
{
    [Range(typeof(decimal), "0.01", "9999999999.99")]
    public decimal DealValue { get; set; }

    [Range(typeof(decimal), "0", "100")]
    public decimal CommissionRate { get; set; }

    public DealStatus Status { get; set; }
}
