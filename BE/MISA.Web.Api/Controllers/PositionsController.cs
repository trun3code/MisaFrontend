using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Mvc;
using MISA.Web.Api.Model;
using MySqlConnector;

namespace MISA.Web.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PositionsController : ControllerBase
    {
        /// <summary>
        /// Khởi tạo kết nối
        /// </summary>
        private static readonly string connectionString = "Host=8.222.228.150; Port=3306; Database=PTIT_B20DCCN702_VuongDanhTrung ; User Id= manhnv; Password = 12345678";

        /// <summary>
        /// Kết nối db
        /// </summary>
        private MySqlConnection Connection => new(connectionString);

        /// <summary>
        /// Lấy danh sách chức vụ 
        /// </summary>
        /// <returns>
        /// 200 - Danh sách chức vụ<br />
        /// 204 - Không có dữ liệu<br />
        /// 500 - Xảy ra lỗi <br />
        /// </returns>
        /// Created by: TrungVD (28/07/2024)
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var positions = Connection.GetAll<Position>();
                return positions.Count() == 0 ? NoContent() : Ok(positions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
