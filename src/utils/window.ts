export function setupWindowEventListener() {
  const FunctionMap: Function[] = [];

  function listen() {
    window.addEventListener("resize", function (event) {
      FunctionMap.forEach((func) => func(event));
    });
  }

  function addFunc(func: Function) {
    FunctionMap.push(func);
  }

  return { addFunc, listen };
}
