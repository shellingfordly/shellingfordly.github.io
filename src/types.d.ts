type Any = any;

interface RouteMetaFrontmatter {
  title: string;
  city: string;
  coords: number[];
  date?: string;
  desc?: string;
  preview?: string;
}

interface MarkerItem extends RouteMetaFrontmatter {
  route: string;
}

interface LayerMapItem {
  name: string
  layer: Vector<any>;
}
