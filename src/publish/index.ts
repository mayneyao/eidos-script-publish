import { Eidos } from "@eidos.space/types";
declare const eidos: Eidos;

import htmlTmp from "./tmp.html";
import { markdown2html } from "./markdown";
import { Context, PUBLISH_SERVER } from "../main";
interface Input {
  // add your input fields here
  slug?: string;
}

const publishDoc = async (
  nodeId: string,
  context: Context,
  slug: string = ""
) => {
  const node = await eidos.currentSpace.getTreeNode(nodeId);
  if (node.type === "doc") {
    const title = node.name;
    const markdown = await eidos.currentSpace.getDocMarkdown(nodeId);
    const content = await markdown2html(markdown as string, context);
    const html = htmlTmp
      .replace(/\${{title}}/g, title)
      .replace(/\${{content}}/g, content);
    const docPublishUrl = `${PUBLISH_SERVER}/${context.env.SUBDOMAIN}/${nodeId}`;
    const res = await fetch(docPublishUrl, {
      method: "POST",
      body: JSON.stringify({
        content: html,
        slug,
      }),
      headers: {
        "x-auth-token": context.env.TOKEN,
      },
    });
    if (res.ok) {
      if (slug) {
        window.open(`${PUBLISH_SERVER}/${context.env.SUBDOMAIN}/${slug}`);
      } else {
        window.open(docPublishUrl);
      }
      eidos.currentSpace.notify({
        title: "Success",
        description:
          "You have successfully published your doc! check opened tab",
      });
      return docPublishUrl;
    } else {
      return `Error: ${res.status} ${res.statusText}`;
    }
  }
};

export async function publish(input: Input, context: Context) {
  const currentNodeId = context.currentNodeId;
  if (context.callFromTableAction && currentNodeId) {
    const rowId = context.currentRowId!;
    await eidos.currentSpace.table(currentNodeId).rows.update(rowId, {
      published: true,
      publishedAt: new Date().toISOString(),
    });
    const nodeId = rowId.split("-").join("");
    await publishDoc(nodeId, context, input.slug);
  } else if (currentNodeId) {
    await publishDoc(currentNodeId, context, input.slug);
  }
}
