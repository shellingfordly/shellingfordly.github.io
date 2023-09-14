import { fromLonLat } from "~/ol-imports";

export function interpolatePoints(
  start: number[],
  end: number[],
  numPoints: number
) {
  const mid1 = [
    start[0] + 0.5 * (end[0] - start[0]) + Math.random() * (end[0] - start[0]),
    start[1] + 0.5 * (end[1] - start[1]) + Math.random() * (end[0] - start[0]),
  ];
  const mid2 = [
    start[0] + 0.5 * (end[0] - start[0]) + Math.random() * (end[0] - start[0]),
    start[1] + 0.5 * (end[1] - start[1]) + Math.random() * (end[0] - start[0]),
  ];
  const interpolatedPoints = calculateBezierCurvePoints(
    start,
    mid1,
    mid2,
    end,
    numPoints
  );

  return interpolatedPoints.map((c) => fromLonLat(c));
}

function calculateBezierCurvePoints(
  start: number[],
  control1: number[],
  control2: number[],
  end: number[],
  numPoints: number
) {
  const bezierPoints = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x =
      (1 - t) ** 3 * start[0] +
      3 * (1 - t) ** 2 * t * control1[0] +
      3 * (1 - t) * t ** 2 * control2[0] +
      t ** 3 * end[0];
    const y =
      (1 - t) ** 3 * start[1] +
      3 * (1 - t) ** 2 * t * control1[1] +
      3 * (1 - t) * t ** 2 * control2[1] +
      t ** 3 * end[1];
    bezierPoints.push([x, y]);
  }
  return bezierPoints;
}
