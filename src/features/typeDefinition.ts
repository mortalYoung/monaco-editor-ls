import * as monaco from "monaco-editor";

monaco.languages.registerTypeDefinitionProvider("SparkSQL", {
  provideTypeDefinition: function (model, position) {
    const word = model.getWordAtPosition(position);
    if (!word?.word) return null;

    if (word.word === "student") {
      return {
        uri: model.uri,
        range: new monaco.Range(6, 0, 6, model.getLineMaxColumn(6)),
      };
    }
    return null;
  },
});
