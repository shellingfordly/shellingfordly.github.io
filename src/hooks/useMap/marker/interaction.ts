import { Map, Select, Point, Layer } from "~/ol-imports";
import { Condition } from "ol/events/condition";
import { Coordinate } from "ol/coordinate";

export interface InteractionEvent {
  hit: boolean;
  info?: MarkerItem;
  coords?: Coordinate;
  other?: Any;
}

export class Interaction {
  interaction: Select;

  constructor(layer: Layer, condition: Condition) {
    this.interaction = new Select({
      layers: [layer], // 指定可以触发交互的图层
      condition, // 鼠标触发条件
      style: null, // 禁用默认样式
    });
  }

  mount(map: Map) {
    map.addInteraction(this.interaction);
  }

  on(callback: (item: InteractionEvent) => void) {
    this.interaction.on("select", (event) => {
      const item: InteractionEvent = {
        hit: event.selected.length > 0,
        info: {} as MarkerItem,
      };

      if (item.hit) {
        const selectedFeature = event.selected[0];
        item.info = selectedFeature.get("info");

        const geometry = selectedFeature.getGeometry();
        if (geometry instanceof Point) {
          item.coords = geometry.getCoordinates();
        }
      }

      callback(item);
    });
  }
}
