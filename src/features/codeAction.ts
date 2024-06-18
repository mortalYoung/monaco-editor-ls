import * as monaco from "monaco-editor";

monaco.languages.registerCodeActionProvider("SparkSQL", {
  provideCodeActions: function (model, range, context) {
    const actions: monaco.languages.CodeAction[] = [];
    const diagnostics = context.markers;

    diagnostics.forEach((marker) => {
      if (marker.code === "no-lowercase") {
        actions.push({
          title: "Uppercase keywords",
          diagnostics: [marker],
          kind: "quickfix",
          edit: {
            edits: [
              {
                resource: model.uri,
                textEdit: {
                  range: marker,
                  text: "SELECT",
                },
                versionId: model.getVersionId(),
              },
            ],
          },
          isPreferred: true,
        });
      } else if (marker.code === "no-function") {
        actions.push({
          title: "Correct function",
          diagnostics: [marker],
          kind: "quickfix",
          edit: {
            edits: [
              {
                resource: model.uri,
                textEdit: {
                  range: marker,
                  text: "sum",
                },
                versionId: model.getVersionId(),
              },
            ],
          },
          isPreferred: true,
        });
      }
    });

    return {
      actions: actions,
      dispose: function () {},
    };
  },
});

export function setModelMarkers(model: monaco.editor.IModel) {
  const markers: monaco.editor.IMarkerData[] = [];
  for (let index = 0; index < model.getLineCount(); index++) {
    const content = model.getLineContent(index + 1);
    let idx = content.indexOf("select");
    if (idx !== -1) {
      markers.push({
        startLineNumber: index + 1,
        startColumn: idx + 1,
        endLineNumber: index + 1,
        endColumn: idx + 7,
        message: "Unexpected lowercase keyword.",
        severity: monaco.MarkerSeverity.Warning,
        code: "no-lowercase",
      });
    }

    idx = content.indexOf("sun(");
    if (idx !== -1) {
      markers.push({
        startLineNumber: index + 1,
        startColumn: idx + 1,
        endLineNumber: index + 1,
        endColumn: idx + 4,
        message: "Unknown function. Do you expected to sum()?",
        severity: monaco.MarkerSeverity.Error,
        code: "no-function",
      });
    }
  }

  monaco.editor.setModelMarkers(model, "owner", markers);
}
