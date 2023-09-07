import { Map, Select, Point, containsCoordinate } from "~/ol-imports";
import { CreateMarkerPreview } from "./preview";

export function OnShowMarker(
  map: Map,
  preview: Required<ReturnType<typeof CreateMarkerPreview>>,
  hoverInteraction: Select
) {
  let info: MarkerItem | null = null;

  const router = useRouter();

  // 点击preview 跳转
  map.on("click", function (event) {
    const overlayElement = preview.overlay.getElement();
    if (overlayElement) {
      const { x, y, width, height } = overlayElement?.getBoundingClientRect();
      const extent = [x, y - 70, x + width, y + height - 70];
      if (containsCoordinate(extent, event.pixel)) {
        info?.route && router.push(info?.route);
      } else {
        preview.overlay.setPosition(undefined);
      }
    }
  });

  // 监听选中要素的事件
  hoverInteraction.on("select", function (event) {
    if (event.selected.length > 0) {
      const selectedFeature = event.selected[0];
      // 设置样式
      info = selectedFeature.get("info");
      preview.setStyle(info!);

      // 设置位置
      const geometry = selectedFeature.getGeometry();
      if (geometry instanceof Point) {
        const coordinates = geometry.getCoordinates();
        preview.overlay.setPosition(coordinates);
      }

      // 鼠标指针
      map.getTargetElement().style.cursor = "pointer";
    } else {
      preview.overlay.setPosition(undefined);

      // 鼠标指针
      map.getTargetElement().style.cursor = "default";
    }
  });
}

export function OnLinkArticle(_: Map, hoverInteraction: Select) {
  const router = useRouter();
  hoverInteraction.on("select", function (event) {
    if (event.selected.length > 0) {
      const selectedFeature = event.selected[0];
      // 打开文章
      const info = selectedFeature.get("info");
      if (info?.route) router.push(info?.route);
    }
  });
}
