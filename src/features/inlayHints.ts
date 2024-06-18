import * as monaco from "monaco-editor";

monaco.languages.registerInlayHintsProvider("SparkSQL", {
  provideInlayHints(model, range) {
    const hints: monaco.languages.InlayHint[] = [];
    for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
      const lineContent = model.getLineContent(i);
      if (lineContent.includes("sum")) {
        hints.push({
          label: "expr: ",
          position: {
            lineNumber: i,
            column: lineContent.indexOf("sum") + 5,
          },
          kind: monaco.languages.InlayHintKind.Parameter,
        });
      }
    }
    return {
      hints: hints,
      dispose: function () {},
    };
  },
});
