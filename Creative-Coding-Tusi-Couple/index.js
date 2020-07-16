const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')

const R = 50
const r = R / 2
const fps = 1000 / 60
const delta = Math.PI * 2 / (fps * 10)

const lines = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .map(val => {
    return {
      tx: (val % 5 + 1) * 2.25 * R,
      ty: (Math.floor(val / 5) + 1) * 2.25 * R,
      line: val + 1
    }
  })

let angle = 0

function draw() {
  lines.forEach(({ tx, ty, line }) => {
    drawCircle(tx, ty, line)
  })
}

function drawCircle(tx, ty, line) {
  
  ctx.save()
  ctx.translate(tx, ty)

  // 画大圆
  ctx.beginPath()
  ctx.arc(0, 0, R, 0, Math.PI * 2)
  ctx.stroke()

  // 画小圆
  let cx = Math.cos(angle) * r
  let cy = Math.sin(angle) * r

  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

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

  ctx.restore()
}

function update() {
  angle += delta
}

function frame() {
  // 重新绘制
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  draw()
  update()
  requestAnimationFrame(frame)
}

requestAnimationFrame(frame)

// function main() {
//   setInterval(() => {
//     draw()
//     update()
//   }, fps)
// }

// main()