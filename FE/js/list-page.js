document.addEventListener("DOMContentLoaded", async function () {
  // 1. Khởi tạo và Cấu hình

  const apiService = "https://localhost:7298/api/v1/Employees";

  const state = {
    allEmployees: [],
    itemsPerPage: 10,
    currentPage: 1,
  };

  const domElements = {
    addEmplBtn: document.querySelector(".add-empl"),
    modal: document.querySelector(".modal"),
    modalContent: document.querySelector(".modal-content"),
    closeBtn: document.querySelector(".close-btn"),
    shortenedSidebarBtn: document.querySelector(".shortened-sidebar-btn"),
    sidebarMenuItems: document.querySelectorAll(".sidebar-menu-item"),
    sidebar: document.querySelector(".sidebar"),
    app: document.querySelector(".app"),
    reloadIcon: document.querySelector(".reload-icon"),
    cancelBtn: document.querySelector(".modal .btn.outline"),
    saveBtn: document.querySelector(".modal .btn:not(.outline)"),
    searchInput: document.querySelector(".search-input"),
    tableContainer: document.querySelector(".table-container"),
    table: document.querySelector(".table"),
    deleteModal: document.querySelector(".delete-modal"),
    modalLast: document.querySelectorAll(".modal")[2],
    yesBtn: document.querySelector(".modal .yes-btn"),
    noBtn: document.querySelector(".modal .no-btn"),
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // 2. Quản lý Nhân viên
  const employeeManagement = {
    getEmployees: async () => {
      try {
        const response = await fetch(apiService);
        if (!response.ok) throw new Error("Network response was not ok");
        state.allEmployees = await response.json();
        return state.allEmployees;
      } catch (error) {
        console.error("Error:", error);
        ui.showToast("Không thể lấy dữ liệu nhân viên", "error");
      }
    },
    getEmployeeDetails: async (employeeId) => {
      try {
        const response = await fetch(`${apiService}/${employeeId}`);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
      } catch (error) {
        console.error("Error:", error);
        ui.showToast("Không thể lấy thông tin chi tiết nhân viên", "error");
      }
    },

    handleSearch: (searchTerm) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
      const filteredEmployees = state.allEmployees.filter(
        (employee) =>
          employee.EmployeeCode.toLowerCase().includes(lowerCaseSearchTerm) ||
          employee.FullName.toLowerCase().includes(lowerCaseSearchTerm) ||
          (employee.EmployeeId &&
            employee.EmployeeId.toString()
              .toLowerCase()
              .includes(lowerCaseSearchTerm))
      );
      state.currentPage = 1;
      employeeManagement.displayEmployees(filteredEmployees, state.currentPage);
    },

    clearEmployeeModal: () => {
      document.querySelector('input[name="employeeCode"]').value = "";
      document.querySelector('input[name="fullName"]').value = "";
      document.querySelector('input[name="position"]').value = "";
      document.querySelector('input[name="department"]').value = "";
      document.querySelector('input[name="dateOfBirth"]').value = "";

      const genderInputs = document.querySelectorAll('input[name="gender"]');
      genderInputs.forEach((input) => (input.checked = false));

      document.querySelector('input[name="identityNumber"]').value = "";
      document.querySelector('input[name="identityDate"]').value = "";
      document.querySelector('input[name="identityPlace"]').value = "";
      document.querySelector('input[name="address"]').value = "";
      document.querySelector('input[name="mobilePhone"]').value = "";
      document.querySelector('input[name="homePhone"]').value = "";
      document.querySelector('input[name="email"]').value = "";
      document.querySelector('input[name="bankAccount"]').value = "";
      document.querySelector('input[name="bankName"]').value = "";
      document.querySelector('input[name="bankBranch"]').value = "";
    },
    displayEmployees: (employees, page = 1) => {
      const tableBody = document.querySelector(".table tbody");

      while (tableBody.children.length > 1) {
        tableBody.removeChild(tableBody.lastChild);
      }

      const startIndex = (page - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      const paginatedEmployees = employees.slice(startIndex, endIndex);

      paginatedEmployees.forEach((employee, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${startIndex + index + 1}</td>
                    <td>${employee.EmployeeCode}</td>
                    <td>${employee.FullName}</td>
                    <td>${employee.GenderName}</td>
                    <td class="tb-center">${new Date(
                      employee.DateOfBirth
                    ).toLocaleDateString("vi-VN")}</td>
                    <td>${employee.Email}</td>
                    <td>${employee.Address}</td>
                    <td>
                        <button class="edit-btn" data-id="${
                          employee.EmployeeId
                        }">Sửa</button>
                        <button class="delete-btn" data-id="${
                          employee.EmployeeId
                        }" data-staff-id="${employee.EmployeeCode}">
                            Xóa
                        </button>
                    </td>
                `;
        tableBody.appendChild(row);
      });

      ui.updatePagination(employees.length, page);
    },
    fillEmployeeModal: (employee) => {
      document.querySelector('input[name="employeeId"]').value =
      employee.EmployeeId || "";
      document.querySelector('input[name="employeeCode"]').value =
        employee.EmployeeCode || "";
      document.querySelector('input[name="fullName"]').value =
        employee.FullName || "";
      document.querySelector('input[name="position"]').value =
        employee.PositionName || "";
      document.querySelector('input[name="department"]').value =
        employee.DepartmentName || "";
      document.querySelector('input[name="dateOfBirth"]').value =
        employee.DateOfBirth
          ? new Date(employee.DateOfBirth).toISOString().split("T")[0]
          : "";

      const genderInputs = document.querySelectorAll('input[name="gender"]');
      genderInputs.forEach((input) => {
        input.checked = input.value === employee.GenderName;
      });

      document.querySelector('input[name="identityNumber"]').value =
        employee.IdentityNumber || "";
      document.querySelector('input[name="identityDate"]').value =
        employee.IdentityDate
          ? new Date(employee.IdentityDate).toISOString().split("T")[0]
          : "";
      document.querySelector('input[name="identityPlace"]').value =
        employee.IdentityPlace || "";
      document.querySelector('input[name="address"]').value =
        employee.Address || "";
      document.querySelector('input[name="mobilePhone"]').value =
        employee.PhoneNumber || "";
      document.querySelector('input[name="homePhone"]').value =
        employee.TelephoneNumber || "";
      document.querySelector('input[name="email"]').value =
        employee.Email || "";
      document.querySelector('input[name="bankAccount"]').value =
        employee.BankAccountNumber || "";
      document.querySelector('input[name="bankName"]').value =
        employee.BankName || "";
      document.querySelector('input[name="bankBranch"]').value =
        employee.BankBranchName || "";
    },
    handleEditClick: async (e) => {
      const editBtn = e.target.closest(".edit-btn");
      if (editBtn) {
        const employeeId = editBtn.dataset.id;
        const employeeDetails = await employeeManagement.getEmployeeDetails(
          employeeId
        );
        if (employeeDetails) {
          employeeManagement.fillEmployeeModal(employeeDetails);
          ui.openModal("edit"); // Truyền tham số 'edit' để phân biệt với thêm mới
        }
      }
    },
    handleDeleteClick: async (e) => {
      const deleteBtn = e.target.closest(".delete-btn");
      if (deleteBtn) {
        const employeeId = deleteBtn.dataset.id;
        const staffId = deleteBtn.dataset.staffId
        ui.openDeleteModal(employeeId, staffId)
      }
    },
    saveEmployeeChanges: async () => {
      const employeeData = {
        employeeId : document.querySelector('input[name="employeeId"]').value,
        EmployeeCode: document.querySelector('input[name="employeeCode"]')
          .value,
        FullName: document.querySelector('input[name="fullName"]').value,
        PositionName: document.querySelector('input[name="position"]').value,
        DepartmentName: document.querySelector('input[name="department"]')
          .value,
        DateOfBirth: document.querySelector('input[name="dateOfBirth"]').value,
        GenderName: document.querySelector('input[name="gender"]:checked')
          .value,
        IdentityNumber: document.querySelector('input[name="identityNumber"]')
          .value,
        IdentityDate: document.querySelector('input[name="identityDate"]')
          .value,
        IdentityPlace: document.querySelector('input[name="identityPlace"]')
          .value,
        Address: document.querySelector('input[name="address"]').value,
        PhoneNumber: document.querySelector('input[name="mobilePhone"]').value,
        TelephoneNumber: document.querySelector('input[name="homePhone"]')
          .value,
        Email: document.querySelector('input[name="email"]').value,
        BankAccountNumber: document.querySelector('input[name="bankAccount"]')
          .value,
        BankName: document.querySelector('input[name="bankName"]').value,
        BankBranchName: document.querySelector('input[name="bankBranch"]')
          .value,
      };

      try {
        const response = await fetch(
          `${apiService}/${employeeData.employeeId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");

        ui.showToast("Cập nhật thông tin nhân viên thành công");
        ui.closeModal();
        await employeeManagement.getEmployees();
        employeeManagement.displayEmployees(
          state.allEmployees,
          state.currentPage
        );
      } catch (error) {
        console.error("Error:", error);
        ui.showToast("Không thể cập nhật thông tin nhân viên", "error");
      }
    },
    addNewEmployee: async () => {
      const employeeData = {
        EmployeeCode: document.querySelector('input[name="employeeCode"]').value,
        FullName: document.querySelector('input[name="fullName"]').value,
        PositionName: document.querySelector('input[name="position"]').value,
        DepartmentName: document.querySelector('input[name="department"]').value,
        DateOfBirth: document.querySelector('input[name="dateOfBirth"]').value,
        GenderName: document.querySelector('input[name="gender"]:checked')?.value || '',
        IdentityNumber: document.querySelector('input[name="identityNumber"]').value,
        IdentityDate: document.querySelector('input[name="identityDate"]').value,
        IdentityPlace: document.querySelector('input[name="identityPlace"]').value,
        Address: document.querySelector('input[name="address"]').value,
        PhoneNumber: document.querySelector('input[name="mobilePhone"]').value,
        TelephoneNumber: document.querySelector('input[name="homePhone"]').value,
        Email: document.querySelector('input[name="email"]').value,
        BankAccountNumber: document.querySelector('input[name="bankAccount"]').value,
        BankName: document.querySelector('input[name="bankName"]').value,
        BankBranchName: document.querySelector('input[name="bankBranch"]').value,
      };
    
      try {
        const response = await fetch(apiService, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        ui.showToast("Tạo mới nhân viên thành công", "success");
        ui.closeModal();
        await employeeManagement.getEmployees();
        employeeManagement.displayEmployees(state.allEmployees, state.currentPage);
      } catch (error) {
        console.error("Error:", error);
        ui.showToast("Không thể tạo mới nhân viên", "error");
      }
    },
    removeEmployee: async (employeeId) => {
      try {
        const response = await fetch(`${apiService}/${employeeId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Network response was not ok");
        ui.showToast("Xóa nhân viên thành công", "success");
        ui.closeModal();
        await employeeManagement.getEmployees();
        employeeManagement.displayEmployees(state.allEmployees, state.currentPage);
      } catch (error) {
        console.error("Error:", error);
        ui.showToast("Không thể xóa nhân viên", "error");
      }
    },
  };

  // 3. Giao diện Người dùng
  const ui = {
    openModal: (mode = "add") => {
      domElements.modal.classList.remove("hidden");
      const modalTitle = document.querySelector(".modal-header");
      const modalButton = document.querySelector(".modal .btn:not(.outline)");
      if (mode === "add") {
        modalTitle.textContent = "Thêm mới nhân viên";
        modalButton.textContent = "Thêm mới";
      } else {
        modalTitle.textContent = "Chỉnh sửa thông tin nhân viên";
        modalButton.textContent = "Lưu";
      }
      const label = document.querySelector(".employee-code");
      const input = document.getElementById(label.htmlFor);
      input.focus();
    },
    closeModal: () => domElements.modal.classList.add("hidden"),
    openDeleteModal: (employeeId, staffId) => {
      const lastModal = domElements.modalLast
      lastModal.classList.remove("hidden")
      domElements.deleteModal.classList.remove("hidden")
      const interHtml =  `
        <div class="delete-modal">
            <p>Bạn có chắc muốn xóa nhân viên ${staffId}</p>
            <div class="delete-modal-btn">
                <button class="btn yes-btn">Có</button>
                <button class="btn no-btn">Không</button>
            </div>
        </div>
      `
      lastModal.innerHTML = interHtml
      lastModal.querySelector(".no-btn").addEventListener("click", () => {
        lastModal.classList.add("hidden");
      });
    
      lastModal.querySelector(".yes-btn").addEventListener("click", () => {
        employeeManagement.removeEmployee(employeeId);
        lastModal.classList.add("hidden");
      });
    
    },
    showToast: (message, type = "success") => {
      let toast = document.createElement("div");
      toast.innerHTML = `
                <div class="toast-container">
                    <span class="toast-icon ${type} icon"></span>
                    <h5 class="toast-title ${type}">${
        type === "success" ? "Thành công!" : "Thất bại!"
      }&nbsp</h5>
                    <p class="toast-body-text">${message}</p>
                    <span class="toast-action">Hoàn tác</span>
                    <span class="toast-close-icon icon"></span>
                </div>`;
      domElements.app.appendChild(toast);

      setTimeout(() => domElements.app.removeChild(toast), 3000);
    },
    updatePagination: (totalItems, currentPage) => {
      const totalPages = Math.ceil(totalItems / state.itemsPerPage);
      const paginationContainer = document.querySelector(".pagination");

      let paginationHTML = `
                    <div class="total">Tổng số: <strong>${totalItems}</strong> bản ghi</div>
                    <div class="row-per-page">
                        <span class="value">${
                          state.itemsPerPage
                        } bản ghi trên 1 trang</span>
                        <span class="icon triangle-down"></span>
                    </div>
                    <div class="page-container">
                        <span class="${
                          currentPage === 1 ? "disable" : ""
                        }" onclick="changePage(${currentPage - 1})">Trước</span>
                `;

      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === totalPages ||
          (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
          paginationHTML += `<span class="page ${
            i === currentPage ? "active" : ""
          }" onclick="changePage(${i})">${i}</span>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
          paginationHTML += `<span class="dots">...</span>`;
        }
      }

      paginationHTML += `
                        <span class="${
                          currentPage === totalPages ? "disable" : ""
                        }" onclick="changePage(${currentPage + 1})">Sau</span>
                    </div>
                `;

      paginationContainer.innerHTML = paginationHTML;
    },
    handleSidebar: () => {
      domElements.sidebarMenuItems.forEach((e) => {
        e.classList.toggle("hidden");
        if (!e.classList.contains("hidden")) e.classList.add("appear");
        else e.classList.remove("appear");
      });
      domElements.sidebar.classList.toggle("shortened");
    },
    showSubmenu: (event, employeeId) => {
      const oldSubmenu = document.querySelector(".submenu");
      if (oldSubmenu) oldSubmenu.remove();

      const toggleBtn = event.target.closest(".toggle-btn");
      const rect = toggleBtn.getBoundingClientRect();

      const submenu = document.createElement("ul");
      submenu.className = "submenu";
      submenu.style.position = "absolute";
      submenu.style.top = `${rect.bottom}px`;
      submenu.style.left = `${rect.left}px`;
      submenu.innerHTML = `
                    <li data-action="duplicate" data-id="${employeeId}">Nhân bản</li>
                    <li data-action="delete" data-id="${employeeId}">Xóa</li>
                `;

      document.body.appendChild(submenu);

      document.addEventListener("click", ui.closeSubmenu);
    },
    closeSubmenu: () => {
      const submenu = document.querySelector(".submenu");
      if (submenu) submenu.remove();
      document.removeEventListener("click", ui.closeSubmenu);
    },
  };

  // 4. Xử lý Sự kiện
  const eventHandlers = {
    handleReload: async () => {
      const employees = await employeeManagement.getEmployees();
      if (employees) {
        state.currentPage = 1;
        employeeManagement.displayEmployees(employees, state.currentPage);
      }
      domElements.searchInput.value = "";
      ui.showToast("Đã làm mới danh sách nhân viên.");
    },
    handleSubmenuClick: (e) => {
      const arrowIcon = e.target.closest(".arrow-down-icon");
      if (arrowIcon) {
        e.stopPropagation(); // Ngăn chặn sự kiện lan truyền
        const submenuContainer = arrowIcon.closest(".submenu-container");
        const employeeId = submenuContainer.dataset.id;
        ui.showSubmenu(e, employeeId);
      }
    },

    // handleToggleClick: (e) => {
    //   const toggleBtn = e.target.closest(".toggle-btn");
    //   if (toggleBtn) {
    //     e.stopPropagation();
    //     const employeeId = toggleBtn.dataset.id;
    //     ui.showSubmenu(e, employeeId);
    //   }
    // },
    handleSubmenuAction: (e) => {
      if (e.target.closest(".submenu li")) {
        const action = e.target.dataset.action;
        const employeeId = e.target.dataset.id;

        switch (action) {
          case "duplicate":
            ui.showToast("Chức năng nhân bản đang được phát triển");
            break;
          case "delete":
            ui.showToast("Chức năng xóa đang được phát triển");
            break;
        }

        ui.closeSubmenu();
      }
    },
  };

  // 5. Phân trang
  window.changePage = function (newPage) {
    if (
      newPage < 1 ||
      newPage > Math.ceil(state.allEmployees.length / state.itemsPerPage)
    )
      return;
    state.currentPage = newPage;
    employeeManagement.displayEmployees(state.allEmployees, state.currentPage);
  };

  // 6. Khởi tạo Trang
  const initializePage = async () => {
    const employees = await employeeManagement.getEmployees();
    if (employees) {
      employeeManagement.displayEmployees(employees, state.currentPage);
    }
  };

  // 7. Gán Sự kiện
  domElements.addEmplBtn.onclick = ui.openModal;
  domElements.modal.onclick = ui.closeModal;
  domElements.modalContent.onclick = (e) => e.stopPropagation();
  domElements.closeBtn.onclick = ui.closeModal;
  domElements.cancelBtn.onclick = ui.closeModal;
  domElements.saveBtn.onclick = async (e) => {
    const mode = document
      .querySelector(".modal-header")
      .textContent.includes("Thêm mới")
      ? "add"
      : "edit";
    if (mode === "add") {
      await employeeManagement.addNewEmployee()
    } else {
      await employeeManagement.saveEmployeeChanges()
    }
    ui.closeModal();
  };
  domElements.shortenedSidebarBtn.onclick = ui.handleSidebar;
  domElements.tableContainer.onscroll = ui.closeSubmenu;
  domElements.reloadIcon.onclick = eventHandlers.handleReload;
  domElements.searchInput.addEventListener(
    "input",
    debounce((e) => {
      employeeManagement.handleSearch(e.target.value);
    }, 300)
  );
  domElements.table.addEventListener(
    "click",
    employeeManagement.handleEditClick
  );
  domElements.table.addEventListener(
    "click",
    employeeManagement.handleDeleteClick
  );
  domElements.table.addEventListener("click", eventHandlers.handleToggleClick);
  domElements.app.addEventListener("click", eventHandlers.handleSubmenuAction);
  domElements.addEmplBtn.onclick = () => {
    employeeManagement.clearEmployeeModal();
    ui.openModal();
  };
  // Khởi tạo trang
  await initializePage();
});
