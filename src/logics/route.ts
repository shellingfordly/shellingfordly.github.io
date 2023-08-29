export const isMapRoute = computed(() => {
  const route = useRoute();
  return route.path == "/map";
});
