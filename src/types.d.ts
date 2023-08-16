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
