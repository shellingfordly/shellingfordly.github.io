import moment from "moment";
import routes from "pages-generated";

export const PageTagList: Set<string> = reactive(new Set());

/**
 * @description 获取地图标点
 * @returns 地图标点
 */
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

const FilterRoute = ["/", "/map", "/blog"];

export function CreateArticleData(type: string): ArticleItem[] {
  let data: Record<string, RouteMetaFrontmatter[]> = {};

  for (const route of routes) {
    const info: RouteMetaFrontmatter = route?.meta?.frontmatter as any;
    if (!info || !Array.isArray(info?.tags)) continue;
    if (FilterRoute.includes(route.path)) continue;

    // 缓存
    info?.tags.forEach((tag) => PageTagList.add(tag));

    if (info.tags.includes(type) || type == "blog") {
      const item = {
        title: info?.title || "",
        date: info?.date || "",
        route: route?.path || "",
        tags: (info?.tags as [])?.filter((tag) => tag != "blog") || [],
      };
      const year = moment(item.date).get("year");

      if (data[year]) {
        data[year].push(item);
      } else {
        data[year] = [item];
      }
    }
  }

  return !!data
    ? Object.keys(data)
        .sort((a, b) => Number(b) - Number(a))
        .map((key) => ({
          year: key,
          list: data[Number(key)].sort(
            (a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()
          ),
        }))
    : [];
}
