import moment from "moment";
import routes from "pages-generated";

export function CreateMapMarkerData(): MarkerItem[] {
  const markerList: MarkerItem[] = [];

  routes.forEach((route) => {
    if (route.name?.toString().includes("travel")) {
      const frontmatter = route.meta?.frontmatter as Any;
      markerList.push({
        ...frontmatter,
        route: route.path,
      });
    }
  });

  return markerList;
}

export function CreateArticleData(type: ArticleType): ArticleItem[] {
  const router = useRouter();
  const routes = router.getRoutes();

  const list = routes
    .filter(
      (route) =>
        (route.meta.frontmatter as RouteMetaFrontmatter)?.tags?.includes(type)
    )
    .map((route) => {
      const info: any = route.meta.frontmatter;
      console.log(info);
      return {
        title: info?.title,
        date: info?.date,
        route: route?.path,
        tags: (info.tags as []).filter((tag) => tag != "blog"),
      } as RouteMetaFrontmatter;
    });
  console.log(list);

  const data: Record<string, RouteMetaFrontmatter[]> = {};

  list.forEach((item) => {
    const year = moment(item.date).get("year");
    if (data[year]) {
      data[year].push(item);
    } else {
      data[year] = [item];
    }
  });

  return Object.keys(data)
    .sort((a, b) => Number(b) - Number(a))
    .map((key) => ({ year: key, list: data[key] }));
}
