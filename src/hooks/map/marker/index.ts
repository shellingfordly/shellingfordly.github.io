import { CreateMarkerLayer } from "./point";
import { Interaction } from "./interaction";
import { pointerMove, click, Layer, Map } from "~/ol-imports";
import { isMobile } from "~/utils/wap";
import { CreateMarkerPreview, MarkerPreview } from "./preview";

export function SetupMarkerLayer(map: Map, watchWindowChange: Function) {
  // 创建标点图层
  const containerLayer = CreateMarkerLayer();
  map.addLayer(containerLayer);
  map.getView().on("change:resolution", containerLayer.changed);

  // 创建标点预览图层
  const preview = CreateMarkerPreview();
  map.addOverlay(preview.overlay);

  watchWindowChange(() => {
    preview.resetPreview && preview.resetPreview();
    BindMarkerEvents(map, containerLayer, preview);
  });

  // 绑定标点事件
  BindMarkerEvents(map, containerLayer, preview);

  return {
    markerPreview: preview,
  };
}

/**
 * @abstract 绑定标点事件
 */
function BindMarkerEvents(map: Map, layer: Layer, preview: MarkerPreview) {
  const interaction = new Interaction(layer, isMobile() ? click : pointerMove);

  interaction.mount(map);

  interaction.on(({ hit, info, coords }) => {
    if (!isMobile()) {
      map.getTargetElement().style.cursor = hit ? "pointer" : "default";
    }
    
    // 设置预览
    preview.setPreviewInfo(info);
    preview.setStyle(info);
    preview.setPosition(coords);
    preview.runEvent();
  });

  if (isMobile()) {
    BindMarkerShowMobileEvent(map, preview);
  } else {
    const router = useRouter();

    const interaction = new Interaction(layer, click);
    interaction.mount(map);

    interaction.on(({ info }) => {
      if (info?.route) router.push(info?.route);
    });
  }
}

function BindMarkerShowMobileEvent(map: Map, preview: MarkerPreview) {
  const router = useRouter();

  map.on("click", function (event) {
    if (preview.contains(event.pixel)) {
      const route = preview.information?.route;
      route && router.push(route);
    } else {
      preview.setPosition();
    }
  });
}
