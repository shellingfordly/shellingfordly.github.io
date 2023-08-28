import { Overlay } from "~/ol-imports";

export function CreateMarkerPreview() {
  const previewContainer = document.getElementById("map_marker_preview");
  if (previewContainer == null) return {};

  // 创建预览 Overlay
  const previewOverlay = new Overlay({
    element: previewContainer,
    positioning: "center-right", // 设置 DOM 元素在预览图层中的定位方式
    offset: [20, -65], // 偏移量，根据需要调整
    stopEvent: false, // 允许事件传递给地图
  });

  return { previewOverlay, SetStyle };
}

function SetStyle(info: MarkerItem) {
  const previewContainer = document.getElementById("map_marker_preview");
  if (previewContainer == null) return;

  const img = previewContainer.querySelector("img");
  if (img) {
    img.src = info.preview || "";
  }

  const title = previewContainer.querySelector("span.title");
  if (title) {
    title.textContent = info.title || "";
  }

  const desc = previewContainer.querySelector("span.desc");
  if (desc) {
    desc.textContent = info.desc || "";
  }
}
