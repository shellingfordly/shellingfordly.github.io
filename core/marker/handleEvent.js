import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import { Style, Icon, Text, Fill } from "ol/style";
import { Overlay } from "ol";

export function OnHoverMarker(map, hoverInteraction) {
  const previewContainer = document.getElementById("preview-container");

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

      const originalCoordinates = selectedFeature
        .getGeometry()
        .getCoordinates();
      previewOverlay.setPosition(originalCoordinates);

      // 鼠标指针
      map.getTargetElement().style.cursor = "pointer";
    } else {
      previewOverlay.setPosition(undefined);

      // 鼠标指针
      map.getTargetElement().style.cursor = "default";
    }
  });
}



