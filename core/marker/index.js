export * from "./handleEvent";
export * from "./point";
import { MarkPoint } from "./point";
import { OnHoverMarker } from "./handleEvent";
import { Select } from "ol/interaction";
import { pointerMove } from "ol/events/condition";

export function SetupMarker(map) {
  const container = MarkPoint(map);

  // 创建鼠标悬停交互
  const hoverInteraction = new Select({
    layers: [container], // 指定可以触发交互的图层
    condition: pointerMove, // 鼠标悬停触发条件
    style: null, // 禁用默认样式
  });

  // 添加交互到地图
  map.addInteraction(hoverInteraction);

  OnHoverMarker(map, hoverInteraction);
}
