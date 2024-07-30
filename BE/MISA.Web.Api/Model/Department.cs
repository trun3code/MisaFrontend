using System.ComponentModel.DataAnnotations;

namespace MISA.Web.Api.Model
{
    public class Department
    {
        [Dapper.Contrib.Extensions.Key]
        public Guid DepartmentID { get; set; }
        [Required] public string? DepartmentName { get; set; }
        [Required] public string? DepartmentCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
