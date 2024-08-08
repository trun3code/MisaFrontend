
using System.ComponentModel.DataAnnotations;

namespace MISA.Web.Api.Model
{
    public class Position
    {
        [Dapper.Contrib.Extensions.Key] 
        public Guid PositionId { get; set; }
        [Required] public string? PositionName { get; set; }
        [Required] public string? PositionCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
