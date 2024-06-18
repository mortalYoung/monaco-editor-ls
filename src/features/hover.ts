import * as monaco from "monaco-editor";

monaco.languages.registerHoverProvider("SparkSQL", {
  provideHover: function (model, position) {
    const word = model.getWordAtPosition(position);
    if (!word) return null;
    if (word.word === "SELECT") {
      return {
        range: new monaco.Range(
          position.lineNumber,
          word.startColumn,
          position.lineNumber,
          word.endColumn
        ),
        contents: [
          {
            value: `#### Description
Spark supports a SELECT statement and conforms to the ANSI SQL standard. Queries are used to retrieve result sets from one or more tables. The following section describes the overall query syntax and the sub-sections cover different constructs of a query along with examples.`,
          },
          {
            value: `#### Syntax
\`\`\`
[ WITH with_query [ , ... ] ]
select_statement [ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] select_statement, ... ]
    [ ORDER BY { expression [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [ , ... ] } ]
    [ SORT BY { expression [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [ , ... ] } ]
    [ CLUSTER BY { expression [ , ... ] } ]
    [ DISTRIBUTE BY { expression [, ... ] } ]
    [ WINDOW { named_window [ , WINDOW named_window, ... ] } ]
    [ LIMIT { ALL | expression } ]
\`\`\`
`,
          },
        ],
      };
    } else if (word.word === "sum") {
      return {
        range: new monaco.Range(
          position.lineNumber,
          word.startColumn,
          position.lineNumber,
          word.endColumn
        ),
        contents: [
          {
            value: `#### Description
sum(expr) - Returns the sum calculated from values of a group.`,
          },
        ],
      };
    }

    const fullText = model.getValue();
    const offset = fullText.indexOf(`CREATE TABLE ${word.word}`);
    if (offset !== -1) {
      const lineNumber = model.getPositionAt(offset);
      const lineContent = model.getLineContent(lineNumber.lineNumber);
      return {
        range: new monaco.Range(
          position.lineNumber,
          word.startColumn,
          position.lineNumber,
          word.endColumn
        ),
        contents: [
          {
            value: `\`\`\`\n${lineContent}\n\`\`\``,
          },
        ],
      };
    }
  },
});
