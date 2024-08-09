var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
builder.Services.AddControllersWithViews(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(x => x
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(origin => true)
                    .AllowCredentials());
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

//private void CloneData()
//{
//    var n1 = new string[] { "Nguyễn","Trần","Lê","Phạm","Phan","Vũ","Bùi"
//            ,"Ngô"};
//    var n2 = new string[] {"An","Anh","Bảo","Công",
//            "Duy","Gia","Hải","Hiếu","Hoài","Hoàng","Huy","Khải","Văn","Thanh","Quỳnh","Vân","Tuấn"
//            ,"Thủy","Yên","Khánh","Mai","Ngọc","Như","Thảo","Thành","Thiện","Thu"
//            ,"Trâm","Vy","Xuân","Yến"};
//    var dep = new string[] { "0d6c41dc-c4ba-4053-adc9-cfc412e5f4ae"
//            ,"3ac87823-c63f-4a73-84aa-6f5f62e43c30",
//            "400bd280-caf6-41bf-8097-921ea599d040"
//            ,"4594eb48-bb96-4ce1-a48b-6fc0906697da"
//            ,"cdf164f5-5352-4807-bde3-4720b3e33ae6"
//            ,"a16bbf63-ddc1-4e13-afda-804fd754ff85"};
//    var bank = new string[] { "BIDV","VPBank","Vietcombank","VietinBank","MBBank"
//            ,"ACB","Techcombank","TPBank","Agribank"};
//    Random rand = new Random();
//    for (int i = 0; i < 50; i++)
//    {
//        var name1 = n1[rand.Next(n1.Length)];
//        var name2 = n2[rand.Next(n2.Length)];
//        var name3 = n2[rand.Next(n2.Length)];
//        string name = name1 + " " + name2 + " " + name3;
//        int gender = rand.Next(2);
//        int d = rand.Next(1, 29);
//        int m = rand.Next(1, 13);
//        int y = rand.Next(1990, 2003);
//        Employee employee = new Employee()
//        {
//            EmployeeID = Guid.NewGuid(),
//            EmployeeCode = "E" + "000".Substring((i + 5) / 10 > 0 ? 1 : 0) + (i + 5),
//            FullName = name,
//            Gender = i % 17 == 0 ? 2 : gender,
//            DateOfBirth = new DateTime(y, m, d),
//            PhoneNumber = "+84" + rand.Next(10000, 99999) + rand.Next(10000, 99999),
//            Email = name3 + name1[0] + name2[0] + "." + d + m + y + "@gmail.com",
//            Address = "Hà Nội",
//            IdentityNumber = "" + rand.Next(100000, 999999) + rand.Next(100000, 999999),
//            IdentityPlace = "Hà Nội",
//            IdentityDate = new DateTime(2020, m, d),
//            BankAccount = "" + rand.Next(100000, 999999) + rand.Next(100000, 999999),
//            BankName = bank[rand.Next(bank.Length)],
//            BankBranch = "Hà Nội",
//            PositionId = new Guid("5994df54-4346-49b2-ac2c-5ee28e9d2cf3"),
//            DepartmentId = new Guid(dep[rand.Next(dep.Length)]),
//            CreatedBy = "TrungVD",
//            ModifiedBy = "TrungVD",
//            CreatedDate = new DateTime(2024, 7, 28, 0, 0, 0),
//            ModifiedDate = new DateTime(2024, 7, 28, 0, 0, 0),
//        };
//        Connection.Insert(employee);
//    }
//}
