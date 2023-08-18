import routes from "pages-generated";

export function CreateMarkerData(): MarkerItem[] {
  const markerList: MarkerItem[] = [];

  routes.forEach((route) => {
    const frontmatter = route.meta?.frontmatter as Any;
    markerList.push({
      ...frontmatter,
      route: route.path,
    });
  });

  return markerList;
}
