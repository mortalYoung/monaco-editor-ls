import * as monaco from "monaco-editor";

monaco.languages.registerDocumentFormattingEditProvider("SparkSQL", {
  provideDocumentFormattingEdits: function (model) {
    const edits: monaco.languages.TextEdit[] = [];
    const lines = model.getLinesContent();

    lines.forEach((line, lineNumber) => {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 0) {
        const range = new monaco.Range(
          lineNumber + 1,
          1,
          lineNumber + 1,
          line.length + 1
        );
        edits.push({
          range: range,
          text: trimmedLine,
        });
      }
    });

    return edits;
  },
});
