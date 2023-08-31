const urlList = [
  "bg_1.png",
  "bg_2.png",
  "bg_3.png",
  "bg_4.png",
  "bg_5.png",
  "bg_6.png",
  "bg_7.png",
  "bg_8.png",
  "bg_9.png",
];

export const homeBgIndex = ref(0);

export const homeBgUrl = computed(
  () => `url(/home/bg/${urlList[homeBgIndex.value]})`
);

export function toggleBgIndex() {
  homeBgIndex.value = Math.floor(Math.random() * urlList.length);
}
