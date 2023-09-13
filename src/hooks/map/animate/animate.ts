import {
  Feature,
  Style,
  Point,
  Icon,
  toRadians,
  transform,
  SourceVector,
  LineString,
} from "~/ol-imports";
import { EPSG3857, EPSG4326, START_POINT } from "../config";
import { InteractionEvent } from "../marker/interaction";
import { countDegrees } from "~/hooks/map/animate/handle";

export const Duration = 2500;
const AnimateStatusMap = new WeakMap();

export function PlayIconAnimate(
  event: InteractionEvent,
  source: SourceVector,
  lineFeature: Feature
) {
  if (!event?.coords) return;
  const key = event.info!;
  if (AnimateStatusMap.get(key)) return;

  const extent = transform(event?.coords, EPSG3857, EPSG4326);
  const degrees = countDegrees(START_POINT, extent);

  // 创建 icon
  const feature = new Feature({ geometry: new Point([]) });
  const style = new Style({
    image: new Icon({
      src: "/images/icons/plane.svg",
      scale: 1,
      rotation: toRadians(45 + 360 - degrees),
    }),
  });
  feature.setStyle(style);
  source.addFeature(feature);

  AnimateStatusMap.set(key, true);

  // 开启动画
  const line = lineFeature?.getGeometry();
  if (line instanceof LineString) {
    animateLine(feature, line.getCoordinates(), () => {
      source.removeFeature(feature);
      AnimateStatusMap.set(key, false);
    });
  }
}

function animateLine(
  feature: Feature,
  coordsList: number[][],
  callback: Function
) {
  let startTime = new Date().getTime();

  function animate() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const fraction = elapsedTime / Duration;
    const index = Math.round(coordsList.length * fraction);

    if (index < coordsList.length) {
      const geometry = feature.getGeometry();
      if (geometry instanceof Point) {
        geometry?.setCoordinates(coordsList[index]);
      }

      requestAnimationFrame(animate);
    } else {
      callback();
    }
  }

  animate();
}
