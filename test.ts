import * as vscode from "vscode";

const ClassRegex = /class\s+([\w\d_]+)(?:\s+extends\s+([\w\d_]+))?/;
const FunctionRegex = /function\s+([\w\d_]+)\s*\(/;
const VarRegex = /(const|var|let)\s+([\w\d_]+)(?=\s*=?[^=])/;
const EnumRegex = /enum\s+([\w\d_]+)\s*\{/;
const TypeRegex = /(interface|type)\s+([\w\d_]+)/;

class MyTreeDataProvider implements vscode.TreeDataProvider<NodeTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    NodeTreeItem | undefined
  > = new vscode.EventEmitter<NodeTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<NodeTreeItem | undefined> = this
    ._onDidChangeTreeData.event;

  private activeTextEditor: vscode.TextEditor | undefined;

  constructor() {
    vscode.window.onDidChangeActiveTextEditor(
      this.onActiveTextEditorChanged,
      this
    );
  }

  getTreeItem(element: NodeTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: NodeTreeItem): vscode.ProviderResult<NodeTreeItem[]> {
    if (!element) {
      return this.getNodes(); // 返回顶层元素
    } else {
      return element.children; // 返回指定项的子项列表
    }
  }

  private getNodes(): NodeTreeItem[] {
    if (this.activeTextEditor) {
      return this.parseDocument(this.activeTextEditor.document);
    }

    return [];
  }

  private parseDocument(document: vscode.TextDocument): NodeTreeItem[] {
    const itemList: NodeTreeItem[] = [];
    let bracketCount = 0;
    const stack: NodeTreeItem[] = [];

    for (let index = 0; index < document.lineCount; index++) {
      const text = document.lineAt(index).text;
      const item = createNodeTreeItem(text, index);
      if (item) {
        if (item.type === NodeType.Class || item.type === NodeType.Func) {
          if (stack.length > 0) {
            stack[stack.length - 1]?.addChild(item);
          } else {
            itemList.push(item);
          }
          stack.push(item);
        } else {
          if (stack.length > 0) {
            stack[stack.length - 1]?.addChild(item);
          } else {
            itemList.push(item);
          }
        }
      }

      for (let j = 0; j < text.length; j++) {
        if (text[j] === "{") {
          bracketCount++;
        } else if (text[j] === "}") {
          bracketCount--;
        }
      }
      if (bracketCount === 0 && stack.length > 0) {
        stack.pop();
      }
    }

    return itemList;
  }

  private onActiveTextEditorChanged(
    editor: vscode.TextEditor | undefined
  ): void {
    this.activeTextEditor = editor;
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}

enum NodeType {
  Empty = "",
  Func = "symbol-method",
  Var = "symbol-variable",
  Enum = "symbol-enum",
  Type = "symbol-value",
  Class = "symbol-module",
}

interface NodeItem {
  name: string;
  type: NodeType;
  charIndex: number;
  lineNumber: number;
  children?: NodeTreeItem[];
}

function createNodeTreeItem(text: string, lineNumber: number) {
  const type = ClassRegex.test(text)
    ? NodeType.Class
    : FunctionRegex.test(text)
    ? NodeType.Func
    : VarRegex.test(text)
    ? NodeType.Var
    : EnumRegex.test(text)
    ? NodeType.Enum
    : TypeRegex.test(text)
    ? NodeType.Type
    : NodeType.Empty;
  if (type === NodeType.Empty) return null;

  let name = "";
  switch (type) {
    case NodeType.Class:
      name = ClassRegex.exec(text)![1];
      break;
    case NodeType.Func:
      name = FunctionRegex.exec(text)![1];
      break;
    case NodeType.Var:
      name = VarRegex.exec(text)![2];
      break;
    case NodeType.Enum:
      name = EnumRegex.exec(text)![1];
      break;
    case NodeType.Type:
      name = TypeRegex.exec(text)![2];
      break;
  }
  return new NodeTreeItem({
    name,
    lineNumber,
    charIndex: 1,
    type,
  });
}

class NodeTreeItem extends vscode.TreeItem {
  name: string;
  lineNumber: number = Math.floor(Math.random() * 100);
  children: NodeTreeItem[] = [];
  type: NodeType = NodeType.Empty;

  constructor(config: NodeItem) {
    super(config.name);
    if (config.type === NodeType.Func) {
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }

    this.name = config.name;
    this.lineNumber = config.lineNumber;
    this.type = config.type;
    this.children = [];
    this.iconPath = new vscode.ThemeIcon(config.type);

    this.command = {
      title: "Go to method",
      command: "extension.goToMethod",
      arguments: [config.lineNumber, config.charIndex],
    };
  }

  addChild(item: NodeTreeItem) {
    this.children.push(item);
  }
}

export const myTreeView = vscode.window.createTreeView("myTreeView", {
  treeDataProvider: new MyTreeDataProvider(),
});

vscode.commands.registerCommand(
  "extension.goToMethod",
  (lineNumber: number, charIndex: number) => {
    if (vscode.window.activeTextEditor) {
      const position = new vscode.Position(lineNumber, charIndex);
      vscode.window.activeTextEditor.selection = new vscode.Selection(
        position,
        position
      );
      vscode.window.activeTextEditor.revealRange(
        new vscode.Range(position, position),
        vscode.TextEditorRevealType.InCenter
      );
    }
  }
);

vscode.commands.registerCommand("extension.showOutline", () => {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    console.log(activeEditor.document);
  }
});
