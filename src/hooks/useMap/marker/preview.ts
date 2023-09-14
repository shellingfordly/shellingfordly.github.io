import moment from "moment";
import { Coordinate } from "ol/coordinate";
import { Overlay, containsCoordinate } from "~/ol-imports";
import { isMobile } from "~/utils/wap";
import { InteractionEvent } from "./interaction";

export class MarkerPreview {
  overlay: Overlay;
  information?: MarkerItem | null;
  readonly BaseOffset = 70;

  events: Set<Function> = new Set();

  constructor(element: HTMLElement) {
    this.overlay = new Overlay({
      element,
      positioning: "center-center",
      offset: isMobile() ? [-100, -270] : [20, -75],
      stopEvent: false, // 允许事件传递给地图
    });
  }

  resetPreview() {
    this.overlay.setOffset(isMobile() ? [-100, -270] : [20, -75]);
  }

  setPreviewInfo(info?: MarkerItem) {
    this.information = info;
  }

  setPosition(position?: Coordinate) {
    this.overlay.setPosition(position);
  }

  getCoordinates() {
    const element = this.overlay.getElement();
    if (element) {
      const { x, y, width, height } = element.getBoundingClientRect();
      return [x, y - this.BaseOffset, x + width, y + height - this.BaseOffset];
    } else {
      return [];
    }
  }

  contains(extent: Coordinate) {
    return containsCoordinate(this.getCoordinates(), extent);
  }

  addEvent(cb: Function) {
    this.events.add(cb);
  }

  removeEvent(cb: Function) {
    if (this.events.has(cb)) {
      this.events.delete(cb);
    }
  }

  runEvent(event: InteractionEvent) {
    this.events.forEach((cb) => cb(event));
  }

  setStyle(info?: MarkerItem) {
    if (!info) return;

    const { preview = "", title = "", date = "", desc = "" } = info;
    const previewContainer = document.getElementById("map_marker_preview");
    if (previewContainer == null) return;

    const img = previewContainer.querySelector("img");
    img && img.setAttribute("src", preview);

    const titleDom = previewContainer.querySelector("div.title");
    titleDom && (titleDom.textContent = title);

    const descDom = previewContainer.querySelector("div.desc");
    descDom && (descDom.textContent = desc);

    const dateDom = previewContainer.querySelector("div.date");
    dateDom && (dateDom.textContent = moment(date).format("YY-MM-DD"));
  }
}

export function CreateMarkerPreview(): MarkerPreview {
  const element = document.getElementById("map_marker_preview");
  if (element == null) return {} as MarkerPreview;

  const preview = new MarkerPreview(element);

  return preview;
}
