using Dapper.Contrib.Extensions;
using Microsoft.AspNetCore.Mvc;
using MISA.Web.Api.Model;
using MySqlConnector;

namespace MISA.Web.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
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
        /// Lấy danh sách nhân viên 
        /// </summary>
        /// <returns>
        /// 200 - Danh sách nhân viên<br />
        /// 204 - Không có dữ liệu<br />
        /// 500 - Xảy ra lỗi <br />
        /// </returns>
        /// Created by: TrungVD (28/07/2024)
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var employees = Connection.GetAll<Employee>();
                return employees.Count() == 0 ? NoContent() : Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Lấy thông tin nhân viên theo id
        /// </summary>
        /// <returns>
        /// 200 - Thông tin nhân viên<br />
        /// 404 - Không tồn tại nhân viên<br />
        /// 500 - Xảy ra lỗi <br />
        /// </returns>
        /// Created by: TrungVD (28/07/2024)
        [HttpGet("{employeeId}")]
        public IActionResult GetById(Guid employeeId)
        {
            try
            {
                var employee = Connection.Get<Employee>(employeeId);
                return employee == null ? NotFound() : Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Xóa nhân viên theo id
        /// </summary>
        /// <returns>
        /// 200 - Xóa thành công<br />
        /// 404 - Không tồn tại nhân viên<br />
        /// 500 - Xảy ra lỗi <br />
        /// </returns>
        /// Created by: TrungVD (28/07/2024)
        [HttpDelete("{employeeId}")]
        public IActionResult DeleteById(Guid employeeId)
        {
            try
            {
                var employee = Connection.Get<Employee>(employeeId);
                if (employee == null) return NotFound();
                bool isSuccess = Connection.Delete(employee);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Chỉnh sửa thông tin nhân viên
        /// </summary>
        /// <returns>
        /// 200 - Cập nhật thành công<br />
        /// 400 - Dữ liệu không hợp lệ<br />
        /// 404 - Không tồn tại nhân viên<br />
        /// 500 - Xảy ra lỗi <br />
        /// </returns>
        /// Created by: TrungVD (28/07/2024)
        [HttpPut("{employeeId}")]
        public IActionResult Update(Guid employeeId, Employee employee)
        {
            try
            {
                var connection = Connection;
                if(connection.Get<Employee>(employeeId)==null)
                    return NotFound();
                var errorData = new List<string>();
                // Kiểm tra các thuộc tính có null hay không hoặc có sai định dạng hay không 
                if (string.IsNullOrEmpty(employee.EmployeeCode))
                    errorData.Add("EmployeeCode Empty");
                if (string.IsNullOrEmpty(employee.FullName))
                    errorData.Add("FullName Empty");
                if (string.IsNullOrEmpty(employee.PhoneNumber))
                    errorData.Add("PhoneNumber Empty");
                if (string.IsNullOrEmpty(employee.Email))
                    errorData.Add("Email Empty");
                if (string.IsNullOrEmpty(employee.IdentityNumber))
                    errorData.Add("IdentifyNumber Empty");
                if (errorData.Count > 0)
                    return BadRequest(errorData);
                bool isSuccess = Connection.Update(employee);
                if (isSuccess)
                    return Ok();
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Thêm nhân viên mới 
        /// </summary>
        /// <returns>
        /// 201 - Tạo thành công<br />
        /// 400 - Dữ liệu không hợp lệ<br />
        /// 500 - Xảy ra lỗi <br />
        /// </returns>
        /// Created by: TrungVD (28/07/2024)
        [HttpPost]
        public IActionResult Create(Employee employee)
        {
            try
            {
                var errorData = new List<string>();
                // Kiểm tra các thuộc tính có null hay không hoặc có sai định dạng hay không 
                if (string.IsNullOrEmpty(employee.EmployeeCode))
                    errorData.Add("EmployeeCode Empty");
                if (string.IsNullOrEmpty(employee.FullName))
                    errorData.Add("FullName Empty");
                if (string.IsNullOrEmpty(employee.PhoneNumber))
                    errorData.Add("PhoneNumber Empty");
                if (string.IsNullOrEmpty(employee.Email))
                    errorData.Add("Email Empty");
                if (string.IsNullOrEmpty(employee.IdentityNumber))
                    errorData.Add("IdentifyNumber Empty");
                if (errorData.Count > 0)
                    return BadRequest(errorData);
                employee.EmployeeID = Guid.NewGuid();
                long identity = Connection.Insert(employee);
                if (identity > 0)
                    return StatusCode(201);
                else
                    return StatusCode(500);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
