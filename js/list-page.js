document.addEventListener('DOMContentLoaded', async function() {
    // Khai báo biến toàn cục
    let allEmployees = [];
    const itemsPerPage = 10;
    let currentPage = 1;

    // Lấy các phần tử DOM
    const domElements = {
        addEmplBtn: document.querySelector('.add-empl'),
        modal: document.querySelector('.modal'),
        modalContent: document.querySelector('.modal-content'),
        closeBtn: document.querySelector('.close-btn'),
        shortenedSidebarBtn: document.querySelector('.shortened-sidebar-btn'),
        sidebarMenuItems: document.querySelectorAll('.sidebar-menu-item'),
        sidebar: document.querySelector('.sidebar'),
        app: document.querySelector('.app'),
        reloadIcon: document.querySelector('.reload-icon'),
        cancelBtn: document.querySelector('.modal .btn.outline'),
        saveBtn: document.querySelector('.modal .btn:not(.outline)'),
        searchInput: document.querySelector('.search-input'),
        tableContainer: document.querySelector('.table-container'),
        table: document.querySelector('.table')
    };

    // Hàm tiện ích
    const utils = {
        // Hàm mở modal
        openModal: () => domElements.modal.classList.remove('hidden'),

        // Hàm đóng modal
        closeModal: () => domElements.modal.classList.add('hidden'),

        // Hàm hiển thị toast message
        showToast: (message, type = 'success') => {
            let toast = document.createElement('div');
            toast.innerHTML = `
            <div class="toast-container">
                <span class="toast-icon ${type} icon"></span>
                <h5 class="toast-title ${type}">${type === 'success' ? 'Thành công!' : 'Thất bại!'}&nbsp</h5>
                <p class="toast-body-text">${message}</p>
                <span class="toast-action">Hoàn tác</span>
                <span class="toast-close-icon icon"></span>
            </div>`;
            domElements.app.appendChild(toast);

            setTimeout(() => domElements.app.removeChild(toast), 3000);
        }
    };

    // Hàm xử lý API
    const api = {
        // Hàm để lấy danh sách nhân viên
        getEmployees: async () => {
            try {
                const response = await fetch('https://cukcuk.manhnv.net/api/v1/Employees');
                if (!response.ok) throw new Error('Network response was not ok');
                allEmployees = await response.json();
                return allEmployees;
            } catch (error) {
                console.error('Error:', error);
                utils.showToast('Không thể lấy dữ liệu nhân viên', 'error');
            }
        },

        // Hàm để lấy thông tin chi tiết của một nhân viên
        getEmployeeDetails: async (employeeId) => {
            try {
                const response = await fetch(`https://cukcuk.manhnv.net/api/v1/Employees/${employeeId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('Error:', error);
                utils.showToast('Không thể lấy thông tin chi tiết nhân viên', 'error');
            }
        }
    };

    // Hàm xử lý hiển thị
    const display = {
        // Hàm để hiển thị nhân viên trong bảng
        displayEmployees: (employees, page = 1) => {
            const tableBody = document.querySelector('.table tbody');
            
            while (tableBody.children.length > 1) {
                tableBody.removeChild(tableBody.lastChild);
            }
        
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedEmployees = employees.slice(startIndex, endIndex);
        
            paginatedEmployees.forEach((employee, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${startIndex + index + 1}</td>
                    <td>${employee.EmployeeCode}</td>
                    <td>${employee.FullName}</td>
                    <td>${employee.GenderName}</td>
                    <td class="tb-center">${new Date(employee.DateOfBirth).toLocaleDateString('vi-VN')}</td>
                    <td>${employee.Email}</td>
                    <td>${employee.Address}</td>
                    <td class="blue-color edit-btn">
                        <div class="submenu-container" data-id="employeeId">Sửa
                            <span class="arrow-down-icon"></span>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        
            display.updatePagination(employees.length, page);
        },

        // Hàm để cập nhật phân trang
        updatePagination: (totalItems, currentPage) => {
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const paginationContainer = document.querySelector('.pagination');
            
            let paginationHTML = `
                <div class="total">Tổng số: <strong>${totalItems}</strong> bản ghi</div>
                <div class="row-per-page">
                    <span class="value">${itemsPerPage} bản ghi trên 1 trang</span>
                    <span class="icon triangle-down"></span>
                </div>
                <div class="page-container">
                    <span class="${currentPage === 1 ? 'disable' : ''}" onclick="changePage(${currentPage - 1})">Trước</span>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    paginationHTML += `<span class="page ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</span>`;
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    paginationHTML += `<span class="dots">...</span>`;
                }
            }

            paginationHTML += `
                    <span class="${currentPage === totalPages ? 'disable' : ''}" onclick="changePage(${currentPage + 1})">Sau</span>
                </div>
            `;

            paginationContainer.innerHTML = paginationHTML;
        },

        // Hàm để điền thông tin nhân viên vào modal
        fillEmployeeModal: (employee) => {
            document.querySelector('input[name="code"]').value = employee.EmployeeCode;
            document.querySelector('input[name="fullName"]').value = employee.FullName;
            document.querySelector('input[name="dateOfBirth"]').value = new Date(employee.DateOfBirth).toISOString().split('T')[0];
            document.querySelector('select[name="gender"]').value = employee.Gender;
            document.querySelector('input[name="identityNumber"]').value = employee.IdentityNumber;
            document.querySelector('input[name="identityDate"]').value = new Date(employee.IdentityDate).toISOString().split('T')[0];
            document.querySelector('input[name="identityPlace"]').value = employee.IdentityPlace;
            document.querySelector('input[name="email"]').value = employee.Email;
            document.querySelector('input[name="phoneNumber"]').value = employee.PhoneNumber;
            document.querySelector('input[name="positionName"]').value = employee.PositionName;
            document.querySelector('input[name="departmentName"]').value = employee.DepartmentName;
            document.querySelector('input[name="salary"]').value = employee.Salary;
            document.querySelector('input[name="workStatus"]').value = employee.WorkStatus;
        },

        // Hàm để hiển thị submenu
        showSubmenu: (event, employeeId) => {
            event.stopPropagation();
        
            const oldSubmenu = document.querySelector('.submenu');
            if (oldSubmenu) oldSubmenu.remove();
        
            const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
            const submenu = document.createElement('ul');
            submenu.className = 'submenu';
            submenu.style.top = `calc(${event.clientY}px - ${headerHeight} + 10px)`;
            submenu.innerHTML = `
                <li data-action="duplicate" data-id="${employeeId}">Nhân bản</li>
                <li data-action="delete" data-id="${employeeId}">Xóa</li>
            `;
        
            domElements.app.appendChild(submenu);
        
            document.addEventListener('click', display.closeSubmenu);
        },

        // Hàm để đóng submenu
        closeSubmenu: () => {
            const submenu = document.querySelector('.submenu');
            if (submenu) submenu.remove();
            document.removeEventListener('click', display.closeSubmenu);
        }
    };

    // Hàm để thay đổi trang
    window.changePage = function(newPage) {
        if (newPage < 1 || newPage > Math.ceil(allEmployees.length / itemsPerPage)) return;
        currentPage = newPage;
        display.displayEmployees(allEmployees, currentPage);
    };

    // Xử lý các sự kiện
    const eventHandlers = {
        
        // Xử lý sự kiện click cho nút chỉnh sửa trong bảng
        handleEditClick: async (e) => {
            const editBtn = e.target.closest('.edit-btn .submenu-container');
            if (editBtn) {
                const employeeId = editBtn.dataset.id;
                const employeeDetails = await api.getEmployeeDetails(employeeId);
                if (employeeDetails) {
                    display.fillEmployeeModal(employeeDetails);
                    utils.openModal();
                }
            }
        },
        

        // Xử lý sự kiện cho sidebar
        handleSidebar: () => {
            domElements.sidebarMenuItems.forEach((e) => {
                e.classList.toggle('hidden');
                if (!e.classList.contains('hidden')) e.classList.add('appear');
                else e.classList.remove('appear');
            });
            domElements.sidebar.classList.toggle('shortened');
        },

        // Xử lý sự kiện nút "Làm mới"
        handleReload: async () => {
            const employees = await api.getEmployees();
            if (employees) {
                currentPage = 1;
                display.displayEmployees(employees, currentPage);
            }
            domElements.searchInput.value = '';
            utils.showToast('Đã làm mới danh sách nhân viên.');
        },

        // Xử lý sự kiện tìm kiếm
        handleSearch: () => {
            const searchTerm = domElements.searchInput.value.toLowerCase();
            const filteredEmployees = allEmployees.filter(employee => 
                employee.EmployeeCode.toLowerCase().includes(searchTerm) ||
                employee.FullName.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            display.displayEmployees(filteredEmployees, currentPage);
        },

        // Xử lý sự kiện click cho nút chỉnh sửa trong bảng
        handleEditClick: async (e) => {
            const editBtn = e.target.closest('.submenu-container');
            if (editBtn) {
                const employeeId = editBtn.dataset.id;
                const employeeDetails = await api.getEmployeeDetails(employeeId);
                if (employeeDetails) {
                    display.fillEmployeeModal(employeeDetails);
                    utils.openModal();
                }
            }
        },

        // Xử lý sự kiện click cho submenu
        handleSubmenuClick: (e) => {
            const arrowIcon = e.target.closest('.arrow-down-icon');
            if (arrowIcon) {
                const submenuContainer = arrowIcon.closest('.submenu-container');
                const employeeId = submenuContainer.dataset.id;
                display.showSubmenu(e, employeeId);
            }
        },

        // Xử lý sự kiện click cho các hành động trong submenu
        handleSubmenuAction: (e) => {
            if (e.target.closest('.submenu li')) {
                const action = e.target.dataset.action;
                const employeeId = e.target.dataset.id;
                
                switch (action) {
                    case 'duplicate':
                        utils.showToast('Chức năng nhân bản đang được phát triển');
                        break;
                    case 'delete':
                        utils.showToast('Chức năng xóa đang được phát triển');
                        break;
                }
                
                display.closeSubmenu();
            }
        }

       
        
    };

    // Gán các sự kiện
    domElements.addEmplBtn.onclick = utils.openModal;
    domElements.modal.onclick = utils.closeModal;
    domElements.modalContent.onclick = (e) => e.stopPropagation();
    domElements.closeBtn.onclick = utils.closeModal;
    domElements.cancelBtn.onclick = utils.closeModal;
    domElements.saveBtn.onclick = () => {
    utils.closeModal();
    utils.showToast('Đã lưu thông tin nhân viên thành công.');
};
    domElements.shortenedSidebarBtn.onclick = eventHandlers.handleSidebar;
    domElements.tableContainer.onscroll = display.closeSubmenu;
    domElements.reloadIcon.onclick = eventHandlers.handleReload;
    domElements.searchInput.addEventListener('input', eventHandlers.handleSearch);
    domElements.table.addEventListener('click', eventHandlers.handleEditClick);
    domElements.table.addEventListener('click', eventHandlers.handleSubmenuClick);
    domElements.app.addEventListener('click', eventHandlers.handleSubmenuAction);

    // Khởi tạo: Lấy và hiển thị danh sách nhân viên khi trang được tải
    const employees = await api.getEmployees();
    if (employees) {
        display.displayEmployees(employees, currentPage);
    }
});