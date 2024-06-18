import * as monaco from "monaco-editor";
import { createRegExp, exactly, oneOrMore, char } from "magic-regexp";

monaco.languages.registerDefinitionProvider("SparkSQL", {
  provideDefinition: function (model, position) {
    const lineContent = model.getLineContent(position.lineNumber);
    if (lineContent.startsWith("--")) return null;
    const word = model.getWordAtPosition(position);
    const fullText = model.getValue();
    const offset = fullText.indexOf(`CREATE TABLE ${word?.word}`);
    if (offset !== -1) {
      const pos = model.getPositionAt(offset + 13);
      return {
        uri: model.uri,
        range: new monaco.Range(
          pos.lineNumber,
          pos.column,
          pos.lineNumber,
          pos.column + word!.word.length
        ),
      };
    }
  },
});

monaco.languages.registerReferenceProvider("SparkSQL", {
  provideReferences: function (model, position) {
    const lineContent = model.getLineContent(position.lineNumber);
    if (!lineContent.startsWith("CREATE TABLE")) return null;
    const word = model.getWordAtPosition(position);
    if (word?.word) {
      const regex = createRegExp(
        exactly("SELECT").and(oneOrMore(char)).and(`FROM student`),
        ["g"]
      );

      const fullText = model.getValue();
      const array1: monaco.languages.Location[] = [];
      while (regex.exec(fullText) !== null) {
        console.log("regex:", regex.lastIndex);
        const pos = model.getPositionAt(regex.lastIndex);
        array1.push({
          uri: model.uri,
          range: new monaco.Range(
            pos.lineNumber,
            model.getLineMinColumn(pos.lineNumber),
            pos.lineNumber,
            model.getLineMaxColumn(pos.lineNumber)
          ),
        });
      }

      if (array1.length) return array1;
    }

    return null;
  },
});
