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
      const title = node.name;
      const markdown = await eidos.currentSpace.getDocMarkdown(currentNodeId);
      const content = marked.parse(markdown);
      const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
        </head>
        <body>
          <h1>${title}</h1>
          ${content}
        </body>
      </html>
    `;
      const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      console.log({
        url,
        html,
      });
      return html;
    }
  }
}
