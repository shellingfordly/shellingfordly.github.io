export function parsePlayground(code: string) {
  const isPlayground = code.startsWith("@playground");

  console.log("isPlayground", isPlayground);

  let html = "";

  if (isPlayground) {
    code = code.slice(17, code.length);

    if (code.includes("@playground_html")) {
      const [_code, _html] = code.split("@playground_html");
      code = _code;
      html = _html;
    }
  }

  return {
    isPlayground,
    code,
    html,
  };
}
