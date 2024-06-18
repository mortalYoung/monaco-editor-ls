import * as monaco from "monaco-editor";

monaco.languages.registerLinkProvider("SparkSQL", {
  provideLinks: function (model) {
    const links: monaco.languages.ILink[] = [];
    const lines = model.getLinesContent();

    lines.forEach((line, lineIndex) => {
      const idx = line.toLowerCase().indexOf("sum");
      if (line.startsWith("--") && idx !== -1) {
        links.push({
          range: new monaco.Range(
            lineIndex + 1,
            idx + 1,
            lineIndex + 1,
            idx + 4
          ),
          url: "https://spark.apache.org/docs/latest/api/sql/#sum",
        });
      }
    });

    return {
      links: links,
    };
  },
});
