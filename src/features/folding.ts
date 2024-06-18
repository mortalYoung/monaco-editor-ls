import * as monaco from "monaco-editor";

monaco.languages.registerFoldingRangeProvider("SparkSQL", {
  provideFoldingRanges: function (model) {
    const ranges: monaco.languages.FoldingRange[] = [];
    for (let i = 0; i < model.getLineCount(); ) {
      const lineContent = model.getLineContent(i + 1);

      const isValidLine = (content: string) =>
        content && !content.trim().startsWith("--");

      // 整段折叠
      if (isValidLine(lineContent) && !isValidLine(model.getLineContent(i))) {
        const start = i + 1;
        let end = start;
        while (end < model.getLineCount() && model.getLineContent(end + 1)) {
          end++;
        }
        if (end <= model.getLineCount()) {
          ranges.push({
            start: start,
            end: end,
            kind: monaco.languages.FoldingRangeKind.Region,
          });
        }
      }

      i++;
    }
    return ranges;
  },
});
