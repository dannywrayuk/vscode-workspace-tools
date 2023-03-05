import * as vscode from "vscode";

const getWorkspaceIndex = (path: string) => {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) return -1;
  if (folders.length < 2) return -1;
  return folders.findIndex((folder) => folder.uri.path === path);
};

const validateUniqueName = (value: string) => {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) return false;
  if (folders.length < 2) return false;
  return folders.some((folder) => folder.name === value);
};

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "vscode-workspace-tools.add",
    (x) => {
      console.log(x);
      vscode.workspace.updateWorkspaceFolders(
        vscode.workspace.workspaceFolders
          ? vscode.workspace.workspaceFolders.length
          : 0,
        null,
        { uri: vscode.Uri.parse(x) }
      );
    }
  );

  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand(
    "vscode-workspace-tools.rename",
    async (x) => {
      const workspaceIndex = getWorkspaceIndex(vscode.Uri.parse(x).path);

      const newName = await vscode.window.showInputBox({
        title: "Rename Workspace Folder",
        prompt:
          "This will not change the name of the folder, only it's display name in the workspace.",
        value: vscode.workspace.workspaceFolders?.[workspaceIndex].name || "",
        validateInput: (value) => {
          if (validateUniqueName(value))
            return `Folder name "${value}" already exists.`;
        },
      });
      if (!newName) return;

      vscode.workspace.updateWorkspaceFolders(workspaceIndex, 1, {
        uri: vscode.Uri.parse(x),
        name: newName,
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
