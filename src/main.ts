import { Eidos } from "@eidos.space/types";
declare const eidos: Eidos;

import htmlTmp from "./tmp.html";
import { markdown2html } from "./markdown";

interface Env {
  // add your environment variables here
  API_END_POINT: string;
  AUTH_KEY_SECRET: string;
}

interface Table {
  // add your tables here
}

interface Input {
  // add your input fields here
}

export interface Context {
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
      const content = await markdown2html(markdown as string, context);
      const html = htmlTmp
        .replace(/\${{title}}/g, title)
        .replace(/\${{content}}/g, content);
      const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      console.log(url);
      // upload to cf
      const publishServiceURL = new URL(context.env.API_END_POINT);
      publishServiceURL.pathname = `/${currentNodeId}`;
      const docPublishUrl = publishServiceURL.toString();
      const res = await fetch(docPublishUrl, {
        method: "PUT",
        body: html,
      });
      if (res.ok) {
        window.open(docPublishUrl);
        return docPublishUrl;
      } else {
        return `Error: ${res.status} ${res.statusText}`;
      }
    }
  }
}
