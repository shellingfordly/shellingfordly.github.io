export const homeBgUrlList = [
  "/images/home/bg_1.png",
  "/images/home/bg_2.png",
  "/images/home/bg_3.png",
  "/images/home/bg_4.png",
  "/images/home/bg_5.png",
  "/images/home/bg_6.png",
  "/images/home/bg_7.png",
  "/images/home/bg_8.png",
  "/images/home/bg_9.png",
];

export const homeBgIndex = ref(
  Math.floor(Math.random() * homeBgUrlList.length)
);

export const homeBgUrl = computed(() => homeBgUrlList[homeBgIndex.value]);

export function toggleBgIndex() {
  homeBgIndex.value = Math.floor(Math.random() * homeBgUrlList.length);
}
