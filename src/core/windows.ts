window.addEventListener("load", () => {
  const canvas = document.createElement("canvas");
  const contextOptions = { willReadFrequently: true };

  if (
    Object.hasOwn(canvas, "getContext") &&
    typeof canvas.getContext === "function"
  ) {
    const context = canvas.getContext("2d", contextOptions);
    if (context && (context as Any).willReadFrequently === true) {
      console.log("浏览器支持 willReadFrequently 属性");
    } else {
      console.log("浏览器不支持 willReadFrequently 属性");
    }
  } else {
    console.log("浏览器不支持 2D Canvas 绘图功能");
  }
});
