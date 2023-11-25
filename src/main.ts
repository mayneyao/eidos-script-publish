/// <reference path="eidos.d.ts" />
import { marked } from "marked";
import htmlTmp from "./tmp.html";

interface Env {
  // add your environment variables here
  API_END_POINT: string;
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
      const html = htmlTmp
        .replace(/\${{title}}/g, title)
        .replace(/\${{content}}/g, content);
      const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      console.log(url);
      // upload to cf
      const docPublishUrl = `${context.env.API_END_POINT}/${currentNodeId}`;
      const res = await fetch(docPublishUrl, {
        method: "PUT",
        body: html,
      });
      if (res.ok) {
        return docPublishUrl;
      } else {
        return `Error: ${res.status} ${res.statusText}`;
      }
    }
  }
}
