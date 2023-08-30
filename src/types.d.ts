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

type ArticleType = "blog" | "travel" | "project" | "daily";


interface ArticleItem {
  year: string
  list: RouteMetaFrontmatter[]
}