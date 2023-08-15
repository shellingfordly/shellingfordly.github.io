import ol, { Overlay } from "ol";
import { Select } from "ol/interaction";
import { Point } from "ol/geom";

export function OnHoverMarker(map: ol.Map, hoverInteraction: Select) {
  const previewContainer = document.getElementById("preview-container");

  if (previewContainer == null) return;

  // 创建预览 Overlay
  const previewOverlay = new Overlay({
    element: previewContainer,
    positioning: "center-center", // 设置 DOM 元素在预览图层中的定位方式
    offset: [0, -10], // 偏移量，根据需要调整
    stopEvent: false, // 允许事件传递给地图
  });

  // 将预览 Overlay 添加到地图中
  map.addOverlay(previewOverlay);

  // 监听选中要素的事件
  hoverInteraction.on("select", function (event) {
    if (event.selected.length > 0) {
      const selectedFeature = event.selected[0];

      // 设置预览容器中的内容（这里使用文本作为示例）
      previewContainer.textContent = selectedFeature.get("name");

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
