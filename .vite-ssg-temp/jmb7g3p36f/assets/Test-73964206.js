import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
const frontmatter = { "name": "adsad" };
const excerpt = "";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Test",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    __expose({ frontmatter: { "name": "adsad" }, excerpt: void 0 });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "markdown-body" }, _attrs))}><h1>这是一个测试</h1></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/Test.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default,
  excerpt,
  frontmatter
};
//# sourceMappingURL=Test-73964206.js.map
