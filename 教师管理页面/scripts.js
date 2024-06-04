// JavaScript文件

// 显示折线图函数
function showChart() {
    document.getElementById('chart-container').style.display = 'block'; // 显示图表容器
    const ctx = document.getElementById('line-chart').getContext('2d'); // 获取画布上下文
    const chart = new Chart(ctx, {
        type: 'line', // 图表类型为折线图
        data: {
            labels: ['1', '2', '4', '8', '16', '32'], // X轴标签
            datasets: [
                {
                    label: 'Data Set 1 (64KB)', // 数据集标签
                    data: [0.89, 0.53, 0.47, 0.45, 0.44, 0.44], // 数据
                    borderColor: 'rgba(75, 192, 192, 1)', // 线条颜色
                    borderWidth: 2, // 线条宽度
                    fill: false // 不填充区域
                },
                {
                    label: 'Data Set 2 (256KB)', // 第二个数据集标签
                    data: [0.49, 0.38, 0.36, 0.36, 0.35, 0.35], // 第二个数据集的数据
                    borderColor: 'rgba(255, 99, 132, 1)', // 第二个数据集的线条颜色
                    borderWidth: 2, // 线条宽度
                    fill: false // 不填充区域
                }
            ]
        },
        options: {
            responsive: true, // 自适应大小
            animation: {
                duration: 2000, // 动画持续时间
                easing: 'easeInOutQuad' // 动画效果
            },
            scales: {
                x: {
                    display: true, // 显示X轴
                    title: {
                        display: true, // 显示X轴标题
                        text: 'Associativity' // X轴标题内容
                    }
                },
                y: {
                    display: true, // 显示Y轴
                    title: {
                        display: true, // 显示Y轴标题
                        text: 'Miss Rate (%)' // Y轴标题内容
                    }
                }
            }
        }
    });
}
