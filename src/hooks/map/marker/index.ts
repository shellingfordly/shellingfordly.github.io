import { CreateMarkerLayer } from "./point";
import { OnHoverMarker, OnClickMarker } from "./handleEvent";
import { Condition } from "ol/events/condition";
import { Select, pointerMove, click, Layer, Map } from "~/ol-imports";

export function SetupMarkerLayer(map: Map) {
  // 创建标点图层
  const containerLayer = CreateMarkerLayer();
  // 添加图层
  map.addLayer(containerLayer);
  // 地图缩放时，刷新
  map.getView().on("change:resolution", containerLayer.changed);

  // 绑定标点事件
  BindMarkerEvent(map, containerLayer);
}

/**
 * @abstract 绑定标点事件
 * @param map
 * @param containerLayer
 */
function BindMarkerEvent(map: Map, containerLayer: Layer) {
  // 创建鼠标悬停交互
  const hoverInteraction = CreateEventInteraction(
    map,
    containerLayer,
    pointerMove
  );
  OnHoverMarker(map, hoverInteraction);

  // 点击事件
  const clickInteraction = CreateEventInteraction(map, containerLayer, click);
  OnClickMarker(map, clickInteraction);
}

/**
 * @abstract 在指定图层创建鼠标交互
 * @param map 地图
 * @param containerLayer 交互图层
 * @param condition 鼠标事件
 * @returns Select
 */
function CreateEventInteraction(
  map: Map,
  containerLayer: Layer,
  condition: Condition
) {
  const interaction = new Select({
    layers: [containerLayer], // 指定可以触发交互的图层
    condition, // 鼠标触发条件
    style: null, // 禁用默认样式
  });

  map.addInteraction(interaction);

  return interaction;
}
