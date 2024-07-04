var addEmplBtn = document.querySelector('.add-empl')
var modal = document.querySelector('.modal')
var modalContent = document.querySelector('.modal-content')
var closeBtn = document.querySelector('.close-btn')
var updateBtns = document.querySelectorAll('.edit-btn')
var shortenedSidebarBtn = document.querySelector('.shortened-sidebar-btn')
var sidebarMenuItems = document.querySelectorAll('.sidebar-menu-item')
var sidebar = document.querySelector('.sidebar')
var container = document.querySelector('.container')
var editOptionsBtns = document.querySelectorAll('.arrow-down-icon')
var body = document.querySelector('body')
var headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
var app = document.querySelector('.app')
var reloadIcon = document.querySelector('.reload-icon')

addEmplBtn.onclick = (e) => {
    modal.classList.toggle('hidden');
}

modal.onclick = (e) => {
    modal.classList.toggle('hidden')
}

modalContent.onclick = (e) => {
    e.stopPropagation();
}

closeBtn.onclick = (e) => {
    modal.classList.toggle('hidden')
}

updateBtns.forEach((e) => {
    e.onclick = () => {
        modal.classList.toggle('hidden')
    }
})

shortenedSidebarBtn.onclick = () => {
    sidebarMenuItems.forEach((e) => {
        e.classList.toggle('hidden')
        if (!e.classList.contains('hidden')) e.classList.add('appear')
        else e.classList.remove('appear')
    })
    sidebar.classList.toggle('shortened')
}

{/* <ul class="submenu">
                                        <li>Nhân bản</li>
                                        <li>Xóa</li>
                                        <li>Ngừng sử dụng</li>
                                    </ul> */}
editOptionsBtns.forEach((e) => {
    e.onclick = (event) => {
        event.stopPropagation();
        var div = document.createElement('div');
        div.innerHTML = `
        <ul class="submenu" style="top: calc(${event.clientY}px - ${headerHeight} + 10px)">
        <li>Nhân bản</li>
        <li>Xóa</li>
        <li>Ngừng sử dụng</li>
        </ul>
        `
        if (app.lastElementChild.lastElementChild.classList.contains('submenu')) {
            app.removeChild(app.lastElementChild)
        }
        app.appendChild(div)
    }
    console.log(e.onclick)
})

tableContainer.onscroll = () => {
    if(body.firstChild.classList.contains('submenu')) {
        console.log(1)
        body.removeChild(body.firstChild)
    }
}

reloadIcon.onclick = () => {
    let toast = document.createElement('div')
    toast.innerHTML = `<div class="toast-container">
    <span class="toast-icon success icon"></span>
    <h5 class="toast-title success">Thành công!&nbsp</h5>
    <p class="toast-body-text">Công việc đã xóa.</p>
    <span class="toast-action">Hoàn tác</span>
    <span class="toast-close-icon icon"></span>
</div>`
    app.appendChild(toast)
}