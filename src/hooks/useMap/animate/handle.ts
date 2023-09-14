export function countDegrees(startPoint: number[], endPoint: number[]) {
  // 计算坐标差
  const dx = endPoint[0] - startPoint[0];
  const dy = endPoint[1] - startPoint[1];

  // 计算线的方向角度（以度为单位）
  const radians = Math.atan2(dy, dx); // 使用反正切函数计算方向角度
  let degrees = radians * (180 / Math.PI); // 转换为度

  // 保证角度在0到360度之间
  if (degrees < 0) {
    degrees += 360;
  }

  return degrees;
}
