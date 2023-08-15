import { ViteSSG } from "vite-ssg";
import { resolveComponent, useSSRContext, defineComponent, onMounted } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Overlay, Feature, Map, View } from "ol";
import { fromLonLat, transformExtent } from "ol/proj.js";
import { Point } from "ol/geom.js";
import Vector from "ol/layer/Vector.js";
import SourceVector from "ol/source/Vector.js";
import { Style, Icon, Stroke, Text, Fill } from "ol/style.js";
import { Select } from "ol/interaction.js";
import { pointerMove } from "ol/events/condition.js";
import { GeoJSON } from "ol/format.js";
import { intersects } from "ol/extent.js";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_router_view = resolveComponent("router-view");
  _push(ssrRenderComponent(_component_router_view, _attrs, null, _parent));
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const index = "";
const ol = "";
function OnHoverMarker(map, hoverInteraction) {
  const previewContainer = document.getElementById("preview-container");
  if (previewContainer == null)
    return;
  const previewOverlay = new Overlay({
    element: previewContainer,
    positioning: "center-center",
    // 设置 DOM 元素在预览图层中的定位方式
    offset: [0, -10],
    // 偏移量，根据需要调整
    stopEvent: false
    // 允许事件传递给地图
  });
  map.addOverlay(previewOverlay);
  hoverInteraction.on("select", function(event) {
    if (event.selected.length > 0) {
      const selectedFeature = event.selected[0];
      previewContainer.textContent = selectedFeature.get("name");
      const geometry = selectedFeature.getGeometry();
      if (geometry instanceof Point) {
        const coordinates = geometry.getCoordinates();
        previewOverlay.setPosition(coordinates);
      }
      map.getTargetElement().style.cursor = "pointer";
    } else {
      previewOverlay.setPosition(void 0);
      map.getTargetElement().style.cursor = "default";
    }
  });
}
const MARKER_MAP = {
  安徽: {},
  澳门: {},
  北京: {},
  福建: {
    children: {
      厦门: {
        children: {
          鼓浪屿: {
            coords: [118.07, 24.45]
          },
          黄厝海滩: {
            coords: [118.16, 24.44]
          }
        }
      }
    }
  },
  甘肃: {},
  广东: {},
  广西: {},
  贵州: {},
  海南: {},
  河北: {},
  河南: {},
  黑龙江: {},
  湖北: {},
  湖南: {
    children: {
      长沙: {
        children: {
          橘子洲头: {
            coords: [112.96, 28.17]
          },
          五一广场: {
            coords: [112.976352, 28.194306]
          }
        }
      },
      张家界: {
        coords: [110.480018, 29.069878]
      }
    }
  },
  吉林: {
    children: {
      长白山: {
        coords: [127.5, 42.11]
      }
    }
  },
  江苏: {
    children: {
      南京: {
        coords: [118.8, 32.09]
      }
    }
  },
  江西: {
    children: {
      南昌: {
        coords: [115.85, 28.66]
      }
    }
  },
  辽宁: {},
  内蒙古: {},
  宁夏: {},
  青海: {},
  山东: {
    children: {
      泰山: {
        coords: [117.135354, 36.192084]
      }
    }
  },
  山西: {},
  陕西: {},
  上海: {
    children: {
      迪斯尼: {
        coords: [121.67, 31.14]
      },
      外滩: {
        coords: [121.49, 31.23]
      }
    }
  },
  四川: {},
  台湾: {},
  天津: {},
  西藏: {},
  香港: {},
  新疆: {},
  云南: {
    children: {
      丽江: {
        coords: [100.25, 26.81]
      },
      大理: {
        coords: [100.3, 25.68]
      }
    }
  },
  浙江: {
    children: {
      舟山: {
        coords: [122.106863, 30.016028]
      },
      杭州: {
        coords: [120.1536, 30.2655]
      },
      宁波: {
        coords: [121.18, 30.32]
      }
    }
  },
  重庆: {
    coords: [106.55, 29.61]
  }
};
function MarkPoint(map) {
  const container = new Vector({
    source: new SourceVector()
  });
  map.addLayer(container);
  AddPoints(container, MARKER_MAP);
  map.getView().on("change:resolution", container.changed);
  return container;
}
function AddPoints(container, markerMap) {
  for (const name in markerMap) {
    const item = markerMap[name];
    if (item.coords) {
      const pointFeature = CreatePointFeature(name, item.coords);
      container.getSource().addFeature(pointFeature);
    }
    if (item.children) {
      AddPoints(container, item.children);
    }
  }
}
function CreatePointFeature(name, coords) {
  const pointFeature = new Feature({
    geometry: new Point(fromLonLat(coords)),
    // 设置点的坐标
    name
    // 设置点的属性，可以根据需求设置其他属性
  });
  const iconStyle = new Style({
    image: new Icon({
      src: "/marker.svg",
      // 图标的路径
      scale: 1,
      anchor: [0.5, 1]
      // 图标的锚点位置，[0.5, 1] 表示图标底部中心
    })
  });
  pointFeature.setStyle(iconStyle);
  return pointFeature;
}
function SetupMarker(map) {
  const container = MarkPoint(map);
  const hoverInteraction = new Select({
    layers: [container],
    // 指定可以触发交互的图层
    condition: pointerMove,
    // 鼠标悬停触发条件
    style: null
    // 禁用默认样式
  });
  map.addInteraction(hoverInteraction);
  OnHoverMarker(map, hoverInteraction);
}
function CreateBaseLayer(map) {
  const vectorLayer = new Vector({
    source: new SourceVector({
      url: "/src/geojson/all.json",
      format: new GeoJSON()
    })
  });
  map.addLayer(vectorLayer);
  const textStyle2 = function(feature) {
    return new Style({
      text: new Text({
        text: feature.get("name"),
        // 假设GeoJSON属性中有名为 'name' 的属性来表示城市名称
        font: "12px Arial",
        fill: new Fill({ color: "black" }),
        stroke: new Stroke({ color: "white", width: 2 })
      })
    });
  };
  const defaultStyle2 = new Style({
    stroke: new Stroke({
      color: "#ddd",
      width: 1
    })
  });
  vectorLayer.setStyle((feature) => [textStyle2(feature), defaultStyle2]);
}
const ProvinceScope = {
  安徽: [114.878463, 29.395191, 119.645188, 34.65234],
  澳门: [113.528164, 22.109142, 113.598861, 22.217034],
  北京: [115.416827, 39.442078, 117.508251, 41.058964],
  福建: [115.84634, 23.500683, 120.722095, 28.317231],
  甘肃: [92.337827, 32.596328, 108.709007, 42.794532],
  广东: [109.664816, 20.223273, 117.303484, 25.519951],
  广西: [104.446538, 20.902306, 112.05675, 26.388528],
  贵州: [103.599417, 24.620914, 109.556069, 29.224344],
  海南: [108.614575, 8.30204, 117.842823, 20.16146],
  河北: [113.454863, 36.048718, 119.84879, 42.615453],
  河南: [110.35571, 31.3844, 116.644831, 36.366508],
  黑龙江: [121.183134, 43.422993, 135.088511, 53.560901],
  湖北: [108.362545, 29.032769, 116.132865, 33.272876],
  湖南: [108.786106, 24.643089, 114.256514, 30.1287],
  吉林: [121.638964, 40.864207, 131.309886, 46.302152],
  江苏: [116.355183, 30.76028, 121.927472, 35.127197],
  江西: [89.551219, 8.972204, 124.57284, 40.256391],
  辽宁: [118.839668, 38.72154, 125.785614, 43.488548],
  内蒙古: [97.17172, 37.406647, 126.065581, 53.333779],
  宁夏: [104.284332, 35.238497, 107.661713, 39.387783],
  青海: [89.401764, 31.600668, 103.068897, 39.212599],
  山东: [114.810126, 34.377357, 122.705605, 38.399928],
  山西: [110.230241, 34.583784, 114.56294, 40.744953],
  陕西: [105.488313, 31.706862, 111.241907, 39.582532],
  上海: [120.852326, 30.691701, 122.118227, 31.874634],
  四川: [97.347493, 26.048207, 108.54257, 34.315239],
  台湾: [119.314417, 21.896939, 123.701571, 25.938831],
  天津: [116.702073, 38.554824, 118.059209, 40.251765],
  西藏: [78.386053, 26.853453, 99.115351, 36.484529],
  香港: [113.815684, 22.134935, 114.499703, 22.566546],
  新疆: [73.501142, 34.336146, 96.384783, 49.183097],
  云南: [97.527278, 21.142312, 106.196958, 29.225286],
  浙江: [118.022574, 26.643625, 122.834203, 31.182556],
  重庆: [110.195637, 28.164706, 105.289838, 32.204171]
};
const textStyle = function(feature) {
  return new Style({
    text: new Text({
      text: feature.get("name"),
      // 假设GeoJSON属性中有名为 'name' 的属性来表示城市名称
      font: "12px Arial",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white", width: 2 })
    })
  });
};
const cityLayer = {};
for (const key in ProvinceScope) {
  cityLayer[key] = new Vector({
    source: new SourceVector({
      url: `/src/geojson/${key}.json`,
      format: new GeoJSON()
    })
  });
}
const defaultStyle = new Style({
  stroke: new Stroke({
    color: "#ddd",
    width: 1
  })
});
function AddLayer(map, city) {
  const layer = cityLayer[city];
  if (!layer)
    return;
  if (!map.getLayers().getArray().includes(layer)) {
    layer.setStyle((f) => [textStyle(f), defaultStyle]);
    map.addLayer(layer);
  } else {
    layer.setVisible(true);
  }
}
function RemoveLayer(map, city) {
  const layer = cityLayer[city];
  if (!layer)
    return;
  if (map.getLayers().getArray().includes(layer)) {
    layer.setVisible(false);
  }
}
function AddEventListener(map, eventStr) {
  map.getView().on(eventStr, function(event) {
    const mapView = event.target;
    const zoom = event.target.getZoom();
    if (zoom > 7) {
      const currentExtent = mapView.calculateExtent(map.getSize());
      const transformedExtent = transformExtent(
        currentExtent,
        mapView.getProjection(),
        "EPSG:4326"
      );
      for (const key in ProvinceScope) {
        const city = ProvinceScope[key];
        const isCityInView = intersects(city, transformedExtent);
        if (isCityInView) {
          AddLayer(map, key);
        } else {
          RemoveLayer(map, key);
        }
      }
    } else {
      for (const key in ProvinceScope) {
        RemoveLayer(map, key);
      }
    }
  });
}
window.addEventListener("load", () => {
  const canvas = document.createElement("canvas");
  const contextOptions = { willReadFrequently: true };
  if (Object.hasOwn(canvas, "getContext") && typeof canvas.getContext === "function") {
    const context = canvas.getContext("2d", contextOptions);
    if (context && context.willReadFrequently === true) {
      console.log("浏览器支持 willReadFrequently 属性");
    } else {
      console.log("浏览器不支持 willReadFrequently 属性");
    }
  } else {
    console.log("浏览器不支持 2D Canvas 绘图功能");
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const DefaultOptions = {
      center: [120.1552, 30.2741],
      zoom: 4,
      minZoom: 3,
      maxZoom: 15
    };
    onMounted(() => {
      const map = new Map({
        target: "map",
        layers: [],
        view: new View({
          center: fromLonLat(DefaultOptions.center),
          zoom: DefaultOptions.zoom,
          minZoom: DefaultOptions.minZoom,
          maxZoom: DefaultOptions.maxZoom
        })
      });
      CreateBaseLayer(map);
      SetupMarker(map);
      AddEventListener(map, "change:resolution");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div id="map"></div><div id="preview-container" class="preview-container"></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __pages_import_1__ = () => import("./assets/Test-73964206.js");
const routes = [{ "name": "index", "path": "/", "component": _sfc_main, "props": true }, { "name": "Test", "path": "/test", "component": __pages_import_1__, "props": true }];
const createApp = ViteSSG(App, { routes });
export {
  createApp
};
//# sourceMappingURL=main.mjs.map
