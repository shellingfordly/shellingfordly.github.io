type Any = any;

type RouteMetaFrontmatter = MarkerItem;

interface MarkerItem {
  name: string;
  city: string;
  route: string;
  coords: number[];
  date: string;
}
