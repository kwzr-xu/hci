//2024.6.3 热度图完工

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

// 初始化 simpleheat
const canvas = document.getElementById('heatmapCanvas');
const heat = simpleheat(canvas);

function drawHeatmap(matrix) {
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    const data = matrix.map(([x, y]) => [x * width, y * height, 1]);
    heat.data(data).max(1).draw(0.05);
}

// 每半秒生成一个新的随机矩阵并绘制热度图
setInterval(() => {
    const matrix = generateRandomMatrix();
    drawHeatmap(matrix);
}, 5000);

// 生成随机热度图数据来源
function generateRandomMatrix() {
    let data = [];
    let numPoints = Math.floor(Math.random() * 6) + 20; // 随机生成20到25之间的数字
    for (let i = 0; i < numPoints; i++) {
        let x = Math.random();
        let y = Math.random();
        data.push([x, y]);
    }
    return data;
}
