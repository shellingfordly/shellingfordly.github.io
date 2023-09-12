type Any = any;

interface RouteMetaFrontmatter {
  title: string;
  tags: string[];
  date: string;
  route: string;
}

interface MarkerItem extends RouteMetaFrontmatter {
  coords: number[];
  desc?: string;
  city: string;
  preview?: string;
}

interface LayerMapItem {
  name: string;
  layer: Vector<any>;
}

interface ArticleItem {
  year: string;
  list: RouteMetaFrontmatter[];
}

interface ProjectInfoItem {
  title: string;
  path: string;
  desc: string;
  img: string;
}
