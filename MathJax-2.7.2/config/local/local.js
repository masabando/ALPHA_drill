MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
  var TEX = MathJax.InputJax.TeX;

  TEX.Macro("unit","{\\,[\\mathrm{#1}]\\,}", 1);
  TEX.Macro("diff","{\\mathrm{d}}");
  TEX.Macro("vm","{\\boldsymbol{#1}}", 1);
  TEX.Macro("grad","{\\nabla #1}", 1);
//  TEX.Macro("div","{\\nabla\\cdot #1}", 1);
  TEX.Macro("rot","{\\nabla\\times #1}", 1);
  TEX.Macro("pdiffA","{\\frac{\\partial #1}{\\partial #2}}", 2);
  TEX.Macro("pdiffB","{\\frac{\\partial^{#1} #2}{\\partial #3^{#1}}}", 3);
  TEX.Macro("ddiffA","{\\frac{\\diff #1}{\\diff #2}}", 2);
  TEX.Macro("ddiffB","{\\frac{\\diff^{#1} #2}{\\diff #3^{#1}}}", 3);
});

MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [['$','$'], ['\\(','\\)']],
    processEscapes: true
  }
});

MathJax.Ajax.loadComplete("[MathJax]/config/local/local.js");
