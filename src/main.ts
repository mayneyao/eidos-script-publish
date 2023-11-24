/// <reference path="eidos.d.ts" />
import { marked } from "marked";

interface Env {
  // add your environment variables here
}

interface Table {
  // add your tables here
}

interface Input {
  // add your input fields here
}

interface Context {
  env: Env;
  tables: Table;
  currentNodeId?: string;
}

export default async function (_input: Input, context: Context) {
  const currentNodeId = context.currentNodeId;

  if (currentNodeId) {
    const node = await eidos.currentSpace.getTreeNode(currentNodeId);
    if (node.type === "doc") {
      const markdown = await eidos.currentSpace.getDocMarkdown(currentNodeId);
      const html = marked.parse(markdown);
      console.log(html);
      return html;
    }
  }
}