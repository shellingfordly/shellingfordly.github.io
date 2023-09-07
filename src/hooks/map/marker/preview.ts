import moment from "moment";
import { Overlay } from "~/ol-imports";
import { isMobile } from "~/utils/wap";

export function CreateMarkerPreview() {
  const previewElement = document.getElementById("map_marker_preview");
  if (previewElement == null) return {};

  // 创建预览 Overlay
  const overlay = new Overlay({
    element: previewElement,
    positioning: "center-center", // 设置 DOM 元素在预览图层中的定位方式
    stopEvent: false, // 允许事件传递给地图
  });

  const setOffset = () =>
    overlay.setOffset(isMobile() ? [-100, -270] : [20, -75]);

  setOffset();

  return { overlay, setStyle, setOffset };
}

function setStyle(info: MarkerItem) {
  const previewContainer = document.getElementById("map_marker_preview");
  if (previewContainer == null) return;

  const img = previewContainer.querySelector("img");
  if (img) {
    img.src = info.preview || "";
  }

  const title = previewContainer.querySelector("div.title");
  if (title) {
    title.textContent = info.title || "";
  }

  const desc = previewContainer.querySelector("div.desc");
  if (desc) {
    desc.textContent = info.desc || "";
  }

  const date = previewContainer.querySelector("div.date");
  if (date) {
    date.textContent = moment(info.date).format("YY-MM-DD") || "";
  }
}
