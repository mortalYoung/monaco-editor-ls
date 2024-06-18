import * as monaco from "monaco-editor";
import { createRegExp, exactly, oneOrMore, char } from "magic-regexp";

function createDependencyProposals(range: monaco.IRange) {
  // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
  // here you could do a server side lookup

  return [
    {
      label: '"SELECT"',
      kind: monaco.languages.CompletionItemKind.Keyword,
      documentation: "SELECT Statement",
      insertText: "SELECT",
      range: range,
    },
    {
      label: '"SELECT"',
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: "SELECT Statement",
      insertText: "SELECT ${2:columns} from ${1:table};",
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
    },
  ];
}

monaco.languages.registerCompletionItemProvider("SparkSQL", {
  triggerCharacters: ["."],
  provideCompletionItems: function (model, position) {
    const word = model.getWordUntilPosition(position);
    const range: monaco.IRange = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    const offset = model.getOffsetAt(position);
    const prevIdentifier = model.getWordAtPosition(
      model.getPositionAt(offset - 1)
    );
    if (prevIdentifier?.word) {
      const regex = createRegExp(
        exactly("CREATE TABLE ")
          .and(exactly(`${prevIdentifier.word} `))
          .and(exactly("("))
          .and(oneOrMore(char).groupedAs("columns"))
          .and(exactly(")"))
      );
      const match = model.getValue().match(regex);
      if (match && match.groups.columns) {
        const columns = match.groups.columns;
        return {
          suggestions: columns.split(",").map((item) => {
            const [columnName, columnType] = item.trim().split(" ");
            return {
              label: `${columnName.trim()}(${columnType.trim()})`,
              kind: monaco.languages.CompletionItemKind.Field,
              documentation: `${columnName.trim()} ${columnType.trim()}`,
              insertText: columnName.trim(),
              range: range,
            };
          }),
        };
      }
    }

    return {
      suggestions: createDependencyProposals(range),
    };
  },
});
