//18.01 初版定稿 鼠标识别

let isMoving = false; // 用于跟踪鼠标是否在移动
let lastMoveTime = Date.now(); // 记录上一次鼠标移动的时间

// 监听鼠标在 .container 内的移动事件
document.querySelector('.container').addEventListener('mousemove', function(e) {
    const containerRect = e.currentTarget.getBoundingClientRect(); // 获取容器的边界矩形

    // 检查鼠标是否在容器内
    if (e.clientX >= containerRect.left && e.clientX <= containerRect.right &&
        e.clientY >= containerRect.top && e.clientY <= containerRect.bottom) {

        isMoving = true; // 设置鼠标在移动
        lastMoveTime = Date.now(); // 更新最后移动时间

        // 计算鼠标相对于容器的坐标
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;

        createHeatmapDot(x, y); // 创建热度点
        updateCoordinates(x, y); // 更新坐标显示
    }
});

// 创建热度点函数
function createHeatmapDot(x, y) {
    const heatmap = document.querySelector('.heatmap'); // 获取热度图容器
    const dot = document.createElement('div'); // 创建一个新的 div 作为热度点
    dot.className = 'dot'; // 设置热度点的样式类
    dot.style.left = `${x - 25}px`; // 设置热度点的 X 坐标（中心位置）
    dot.style.top = `${y - 25}px`; // 设置热度点的 Y 坐标（中心位置）
    heatmap.appendChild(dot); // 将热度点添加到热度图容器中

    // 设置定时器，在 500 毫秒后使热度点淡出，并在 1000 毫秒后从 DOM 中移除
    setTimeout(() => {
        dot.style.opacity = '0'; // 开始淡出
        setTimeout(() => heatmap.removeChild(dot), 1000); // 从 DOM 中移除
    }, 500);
}

// 更新坐标显示函数
function updateCoordinates(x, y) {
    const coordinates = document.getElementById('coordinates'); // 获取坐标显示元素
    coordinates.textContent = `X: ${x}, Y: ${y}`; // 更新坐标显示内容
}

// 每 100 毫秒检查一次鼠标是否停止移动
setInterval(() => {
    if (!isMoving && Date.now() - lastMoveTime > 100) { // 如果鼠标未移动且上次移动时间超过 100 毫秒
        const heatmap = document.querySelector('.heatmap'); // 获取热度图容器
        const lastDot = heatmap.querySelector('.dot:last-child'); // 获取最后一个热度点

        if (lastDot) {
            const rect = lastDot.getBoundingClientRect(); // 获取最后一个热度点的边界矩形
            const containerRect = document.querySelector('.container').getBoundingClientRect(); // 获取容器的边界矩形

            // 检查最后一个热度点是否在容器内
            if (rect.left >= containerRect.left && rect.right <= containerRect.right &&
                rect.top >= containerRect.top && rect.bottom <= containerRect.bottom) {
                
                // 计算热度点相对于容器的中心坐标
                const x = rect.left - containerRect.left + 23;
                const y = rect.top - containerRect.top + 23;

                createHeatmapDot(x, y); // 创建新的热度点
                updateCoordinates(x, y); // 更新坐标显示
            }
        }
    }
    isMoving = false; // 重置鼠标移动状态
}, 100);
