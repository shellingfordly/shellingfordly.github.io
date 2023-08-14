import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import { Style, Icon, Text, Fill } from "ol/style";

export function OnHoverMarker(map, hoverInteraction) {
  // 创建预览图层
  const previewLayer = new Vector({
    source: new SourceVector(),
  });

  // 将预览图层添加到地图中
  map.addLayer(previewLayer);

  // 监听选中要素的事件
  hoverInteraction.on("select", function (event) {
    if (event.selected.length > 0) {
      const selectedFeature = event.selected[0];

      // 清空预览图层
      previewLayer.getSource().clear();

      const previewFeature = selectedFeature.clone();
      const previewStyle = new Style({
        image: new Icon({
          // src: "/c.png", // 预览图标的路径
          src: "/t.svg", // 预览图标的路径
          scale: 1,
          anchor: [0.5, 1],
        }),
        text: new Text({
          text: selectedFeature.get("name"), // 获取标点的名称属性作为文字内容
          offsetY: -100, // 文字垂直偏移量
          fill: new Fill({
            color: "#fff", // 文字颜色
          }),
        }),
      });
      previewFeature.setStyle(previewStyle);

      // 偏移预览要素的位置，以避免遮挡标点
      const offset = [0, 10000]; // 偏移量，根据需要调整
      const originalCoordinates = selectedFeature
        .getGeometry()
        .getCoordinates();
      const offsetCoordinates = [
        originalCoordinates[0] + offset[0],
        originalCoordinates[1] + offset[1],
      ];

      previewFeature.getGeometry().setCoordinates(offsetCoordinates);

      // 添加预览要素到预览图层
      previewLayer.getSource().addFeature(previewFeature);
      // 鼠标指针
      map.getTargetElement().style.cursor = "pointer";
    } else {
      // 鼠标不在标点上，清空预览图层
      previewLayer.getSource().clear();
      map.getTargetElement().style.cursor = "default";
    }
  });
}
