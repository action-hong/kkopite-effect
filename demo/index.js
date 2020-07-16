const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// 大圆半径
const R = 50;
// 小圆半径
const r = R / 2;
// 转一圈花的时间
const T = 5 * 1000;
// 1帧小圆转动的角度
const delta = (2 * Math.PI * (1000 / 60)) / T;
// 当前小圆共转动的角度
let angle = 0;
const line = 4

function draw() {
  ctx.save();
  ctx.translate(100, 100);

  // 画大圆
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, Math.PI * 2);
  ctx.stroke();

  // 画小圆
  let cx = Math.cos(angle) * r;
  let cy = Math.sin(angle) * r;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < line; i++) {
    ctx.save()
    const rad = Math.PI / line * i

    // 转动画布
    ctx.rotate(rad)

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

  ctx.restore();
}

function update() {
  angle += delta;
}

function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  update();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
