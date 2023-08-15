type Any = any;

type MarkerMapItem = {
  coords?: number[];
  children?: Record<string, MarkerMapItem>;
};
type MarkerMapType = Record<string, MarkerMapItem>;
