// 定义动画函数
// function animateLine() {
//   let startTime = new Date().getTime();
//   const duration = 10000; // 动画持续时间（毫秒）

//   function animate() {
//     const currentTime = new Date().getTime();
//     const elapsedTime = currentTime - startTime;
//     const fraction = elapsedTime / duration;

//     if (fraction < 1) {
//       // 更新轨迹线的坐标
//       const newCoords = lineString
//         .getCoordinates()
//         .slice(0, Math.round(interpolatedCoords.length * fraction));
//       lineString.setCoordinates(newCoords);

//       // 请求浏览器执行下一帧动画
//       requestAnimationFrame(animate);
//     }
//   }

//   animate();
// }

// 开始动画
// animateLine();
