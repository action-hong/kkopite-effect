# 图斯双圆(Tusi Couple)的绘制

## 前言

前几天逛dribbble，[看到一个很有意思的效果](https://dribbble.com/shots/13310012-Creative-Coding-Tusi-Couple) ，如下图：

![effect](/Creative-Coding-Tusi-Couple/effect.gif)

网上搜索了一下才知道这东西叫做[图斯双圆](https://mathworld.wolfram.com/TusiCouple.html) ，下面让我们一步步分析，在浏览器上模拟绘制出这个效果。

## 分析

通过对上图的分析，可以很容易地发现整个运动就是一个半径小圆绕着大圆转动，而点可以看成是小圆与直线的交点（**这里要注意，一般情况下会有两个交点，需要判断使用哪一个交点**）。这么一分析后我们要绘制的内容就很清晰了：

1. 绘制大圆
2. 绘制小圆
3. 绘制直线
4. 求出小圆与直线的交点，绘制该点
5. 变换小圆的圆心，然后重复2-4即可

## 实现

首先我们新建一个文件html，声明一个canvas元素，接下来所有的绘制内容都是在其上面绘制的。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图斯双圆</title>
</head>
<body>
  <canvas width="700" height="400"></canvas>
</body>
<script src="./index.js"></script>
</html>
```

然后我们新建一个js文件，去获取canvas的上下文以及一些变量的声明

```js
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// 大圆半径
const R = 50
// 小圆半径
const r = R / 2
// 转一圈的时间
const T = 10 * 1000
// 1帧小圆转动的角度
const delta = 2 * Math.PI * (1000 / 60) / T
// 当前小圆共转动的角度
let angle = 0
```

注释里面已经很清楚的表示了各个变量的含义，接下来我们声明一个方法画出大圆和小圆

```js
function draw() {
  ctx.save()
  ctx.translate(100, 100)

  // 画大圆
  ctx.beginPath()
  ctx.arc(0, 0, R, 0, Math.PI * 2)
  ctx.stroke()

  // 先计算出小圆的圆心位置再画小圆
  let cx = Math.cos(angle) * r
  let cy = Math.sin(angle) * r

  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()
}
```

这里做了移动画布的操作，让大圆圆心处于（0,0）点，方便后续的计算。绘制出的图像如下所示：

![p1](/Creative-Coding-Tusi-Couple/p1.png)

然后我们通过不断改变angle变量，来使得小圆转动起来

```js
function update() {
  angle += delta
}

function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  draw()
  update()
  requestAnimationFrame(frame)
}

requestAnimationFrame(frame)
```

效果如下：

![p2](/Creative-Coding-Tusi-Couple/p2.gif)

接下来我们来绘制直线和交点

```js

function draw() {
  // ...

  // 画线
  ctx.beginPath()
  ctx.moveTo(-R, 0)
  ctx.lineTo(R, 0)
  ctx.stroke()

  const tmp = Math.pow(Math.pow(r, 2) - Math.pow(cy, 2), 0.5)
  let dx
  if (cx > 0) {
    dx = cx + tmp
  } else {
    dx = cx - tmp
  }

  ctx.beginPath()
  ctx.arc(dx, 0, 3, 0, Math.PI * 2)
  ctx.fill()
}
```

绘制直线很容易，即绘制点（-R，0）到（R，0）的线段，关键是如何找到直线与圆的交点。我们在中学的时候就学过圆的方程表达式，因此我们可以通过圆和直线的方程联立得出交点的坐标：

$$(x-cx)^{2}+(y-cy)^{2}=r^{2}\tag{1}$$
$$y=0\tag{2}$$
$$(1)(2)\Rightarrow x = cx\pm\sqrt{r^{2}-cy^{2}}\\$$

算出来有两个值，那么应该选择哪一个值呢？我们继续观察上述的动图，可以发现**当小圆的圆心位于y轴右侧时，取x值偏大的交点，反之取x值偏小的交点**。因此我们在代码里就可以获取到交点的坐标并绘制出来：

```js
const tmp = Math.pow(Math.pow(r, 2) - Math.pow(cy, 2), 0.5)
let dx
if (cx > 0) {
  dx = cx + tmp
} else {
  dx = cx - tmp
}
```

于是我们就画出我们想要的图了：

![p3](/Creative-Coding-Tusi-Couple/p3.gif)

接下来我们只需要继续按照上面的方法，算出小圆与每条直线的交点并绘制出来，就可以绘制出本文一开始的效果了。

```js
function draw() {
// ...

// 画线和点
  for (let i = 0; i < line; i++) {
    ctx.save()
    const rad = Math.PI / line * i

    ctx.rotate(rad)

    // 坐标轴顺时针旋转了,则cx, cy也跟着顺时针旋转了
    // 但是小圆应该还是在原来的位置不旋转, 故逆时针旋转rad回去
    const c = Math.cos(rad)
    const s = Math.sin(rad)

    const t_cx = cx * c + cy * s
    const t_cy = cx * -s + cy * c

    // 画线
    ctx.beginPath()
    ctx.moveTo(-R, 0)
    ctx.lineTo(R, 0)
    ctx.stroke()

    const tmp = Math.pow(Math.pow(r, 2) - Math.pow(t_cy, 2), 0.5)
    let dx
    if (t_cx > 0) {
      dx = t_cx + tmp
    } else {
      dx = t_cx - tmp
    }

    ctx.beginPath()
    ctx.arc(dx, 0, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

}
```

这里需要注意一点，其他直线不像上面的$y=0$一样简单，所以我们可以通过旋转画布，这样每一条线都可以当做$y=0$来计算。另外一个需要注意的是小圆的圆心位置，我们顺时针旋转画布rad后，此时的圆心坐标就不是（cx, cy）了， 而是（cx, cy）逆时针旋转rad后的坐标，故代码中做如下变化

```js
const c = Math.cos(rad)
const s = Math.sin(rad)

// 逆时针后得到的坐标
// 由于canvas的y轴的正方向是向下的，故逆时针的变化是如下处理
const t_cx = cx * c + cy * s
const t_cy = cx * -s + cy * c
```

这样我们就可以画出最开始的效果了：

![p4](/Creative-Coding-Tusi-Couple/p4.gif)

[详细代码](https://github.com/action-hong/kkopite-effect/tree/master/Creative-Coding-Tusi-Couple)

