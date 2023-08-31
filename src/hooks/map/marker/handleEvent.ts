import { Map, Select, Point } from "~/ol-imports";
import { CreateMarkerPreview } from "./preview";

export function OnHoverMarker(map: Map, hoverInteraction: Select) {
  const { previewOverlay, SetStyle } = CreateMarkerPreview();
  if (!previewOverlay) return;
  // 添加预览 Overlay
  map.addOverlay(previewOverlay);

  // 监听选中要素的事件
  hoverInteraction.on("select", function (event) {
    if (event.selected.length > 0) {
      const selectedFeature = event.selected[0];

      // 设置样式
      SetStyle(selectedFeature.get("info"));

      // 设置位置
      const geometry = selectedFeature.getGeometry();
      if (geometry instanceof Point) {
        const coordinates = geometry.getCoordinates();
        previewOverlay.setPosition(coordinates);
      }

      // 鼠标指针
      map.getTargetElement().style.cursor = "pointer";
    } else {
      previewOverlay.setPosition(undefined);

      // 鼠标指针
      map.getTargetElement().style.cursor = "default";
    }
  });
}

export function OnClickMarker(_: Map, hoverInteraction: Select) {
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
