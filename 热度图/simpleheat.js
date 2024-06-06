'use strict';

if (typeof module !== 'undefined') module.exports = simpleheat; // 检查是否在 Node.js 环境中，如果是则导出 simpleheat 模块

function simpleheat(canvas) {
    if (!(this instanceof simpleheat)) return new simpleheat(canvas); // 检查是否使用 new 关键字调用，如果没有则强制使用 new

    this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas; // 如果传入的是字符串，获取对应的 DOM 元素

    this._ctx = canvas.getContext('2d'); // 获取 2D 绘图上下文
    this._width = canvas.width; // 获取画布宽度
    this._height = canvas.height; // 获取画布高度

    this._max = 1; // 初始化最大值
    this._data = []; // 初始化数据数组
}

simpleheat.prototype = {

    defaultRadius: 25, // 默认半径

    defaultGradient: { // 默认渐变颜色
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
    },

    data: function (data) { // 设置数据方法
        this._data = data; // 更新数据数组
        return this;
    },

    max: function (max) { // 设置最大值方法
        this._max = max; // 更新最大值
        return this;
    },

    add: function (point) { // 添加数据点方法
        this._data.push(point); // 将数据点加入数组
        return this;
    },

    clear: function () { // 清空数据方法
        this._data = []; // 清空数据数组
        return this;
    },

    radius: function (r, blur) { // 设置半径和模糊度方法
        blur = blur === undefined ? 15 : blur; // 如果未定义模糊度，则默认设置为 15

        // 创建一个用于绘制数据点的灰度模糊圆形图像
        var circle = this._circle = this._createCanvas(),
            ctx = circle.getContext('2d'),
            r2 = this._r = r + blur; // 计算包含模糊的总半径

        circle.width = circle.height = r2 * 2; // 设置画布大小为直径

        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2; // 设置阴影偏移
        ctx.shadowBlur = blur; // 设置阴影模糊度
        ctx.shadowColor = 'black'; // 设置阴影颜色

        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true); // 绘制圆形路径
        ctx.closePath();
        ctx.fill(); // 填充路径

        return this;
    },

    resize: function () { // 重置画布尺寸方法
        this._width = this._canvas.width; // 更新画布宽度
        this._height = this._canvas.height; // 更新画布高度
    },

    gradient: function (grad) { // 设置渐变颜色方法
        // 创建一个 256x1 的渐变图像，用于将灰度热力图转换为彩色热力图
        var canvas = this._createCanvas(),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]); // 设置渐变颜色
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256); // 绘制渐变条

        this._grad = ctx.getImageData(0, 0, 1, 256).data; // 获取渐变条的像素数据

        return this;
    },

    draw: function (minOpacity) { // 绘制热力图方法
        if (!this._circle) this.radius(this.defaultRadius); // 如果没有定义圆形，则使用默认半径
        if (!this._grad) this.gradient(this.defaultGradient); // 如果没有定义渐变，则使用默认渐变

        var ctx = this._ctx;

        ctx.clearRect(0, 0, this._width, this._height); // 清空画布

        // 通过在每个数据点放置一个模糊的圆来绘制灰度热力图
        for (var i = 0, len = this._data.length, p; i < len; i++) {
            p = this._data[i];
            ctx.globalAlpha = Math.min(Math.max(p[2] / this._max, minOpacity === undefined ? 0.05 : minOpacity), 1); // 根据数据点的权重设置透明度
            ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r); // 绘制模糊圆
        }

        // 使用每个像素的不透明度值从我们的渐变中获取正确的颜色来为热力图着色
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        this._colorize(colored.data, this._grad); // 对像素数据进行着色
        ctx.putImageData(colored, 0, 0); // 将着色后的图像数据放回画布

        return this;
    },

    _colorize: function (pixels, gradient) { // 着色方法
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4; // 根据不透明度值获取渐变颜色

            if (j) {
                pixels[i] = gradient[j]; // 设置红色通道
                pixels[i + 1] = gradient[j + 1]; // 设置绿色通道
                pixels[i + 2] = gradient[j + 2]; // 设置蓝色通道
            }
        }
    },

    _createCanvas: function () { // 创建画布方法
        if (typeof document !== 'undefined') {
            return document.createElement('canvas'); // 在浏览器环境中，创建一个新的画布元素
        } else {
            // 在 Node.js 环境中，创建一个新的画布实例
            // 画布类需要有一个没有任何参数的默认构造函数
            return new this._canvas.constructor();
        }
    }
};
