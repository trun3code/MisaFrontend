using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace MISA.Web.Api.Model
{
    public class Employee
    {
        [Dapper.Contrib.Extensions.Key]
        public Guid? EmployeeId { get; set; }
        [Required] public string? EmployeeCode { get; set; }
        [Required] public string? FullName { get; set; }
        public int? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? IdentityNumber { get; set; }
        public DateTime? IdentityDate { get; set; }
        public string? IdentityPlace { get; set; }
        public string? TelephoneNumber { get; set; }
        public string? BankAccountNumber { get; set; }
        public string? BankName { get; set; }
        public string? BankBranchName { get; set; }
        [Required] public Guid PositionId { get; set; }
        [Required] public Guid DepartmentId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        [Write(false)]
        public string GenderName
        {
            get
            {
                switch (Gender)
                {
                    case 0:
                        return "Nam";
                    case 1:
                        return "Nữ";
                }
                return "Khác";
            }
        }
    }
}
