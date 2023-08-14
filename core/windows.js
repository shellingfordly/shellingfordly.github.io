window.addEventListener("load", () => {
  const canvas = document.createElement("canvas");
  const contextOptions = { willReadFrequently: true };

  if ("getContext" in canvas && typeof canvas.getContext === "function") {
    const context = canvas.getContext("2d", contextOptions);
    if (context && context.willReadFrequently === true) {
      // 浏览器支持 willReadFrequently 属性
    } else {
      console.log("浏览器不支持 willReadFrequently 属性");
      // 浏览器不支持 willReadFrequently 属性
    }
  } else {
    console.log("浏览器不支持 2D Canvas 绘图功能");
    // 浏览器不支持 2D Canvas 绘图功能
  }
});
