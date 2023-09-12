const DefaultControl = {
  info: {
    title: "详细介绍",
    icon: "i-material-symbols:page-info-outline-rounded",
    active: true,
  },
  line: {
    title: "路线预览",
    icon: "i-gis:route",
    active: false,
  },
};

const control = reactive(DefaultControl);

export const lineOpen = computed({
  get() {
    return control.line.active;
  },
  set(value) {
    control.line.active = value;
  },
});

export const infoOpen = computed({
  get() {
    return control.info.active;
  },
  set(value) {
    control.info.active = value;
  },
});

export function SetupControl() {
  return { control, lineOpen, infoOpen };
}
