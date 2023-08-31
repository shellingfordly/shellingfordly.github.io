import autoRoutes from "pages-generated";

export const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith("/") ? `${i.path}index.html` : `${i.path}.html`,
  };
});

routes.push({
  alias: "/home.html",
  component: () => import("~/views/index.vue"),
  meta: { frontmatter: {} },
  name: "home",
  path: "/",
  props: true,
});

routes.push({
  alias: "/map.html",
  component: () => import("~/views/map.vue" as any),
  meta: { frontmatter: {} },
  name: "map",
  path: "/map",
  props: true,
});

routes.push({
  alias: "/projects.html",
  component: () => import("~/views/projects.vue" as any),
  meta: { frontmatter: {} },
  name: "projects",
  path: "/projects",
  props: true,
});
