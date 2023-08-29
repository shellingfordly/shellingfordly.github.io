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
