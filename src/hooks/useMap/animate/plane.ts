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
import { countDegrees } from "~/hooks/useMap/animate/handle";

export const Duration = 2500;
const AnimateStatusMap = new WeakMap();

export function AddPlaneFeature(
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
    PlayAnimate(feature, line.getCoordinates(), () => {
      source.removeFeature(feature);
      AnimateStatusMap.set(key, false);
    });
  }
}

function PlayAnimate(
  feature: Feature,
  coordsList: number[][],
  callback: Function
) {
  let startTime = new Date().getTime();

  let lastCoords: number[];

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

      // 转向
      if (lastCoords) {
        const degrees = countDegrees(lastCoords, coordsList[index]);
        if (degrees > 0) {
          const radian = toRadians(45 + 360 - degrees);
          const image = (feature.getStyle() as Style)?.getImage();
          if (image) image.setRotation(radian);
        }
      }

      lastCoords = coordsList[index];

      requestAnimationFrame(animate);
    } else {
      callback();
    }
  }

  animate();
}
