import { Context, PUBLISH_SERVER } from "./main";
import { Eidos } from "@eidos.space/types";
declare const eidos: Eidos;

const unpublishDoc = async (nodeId: string, context: Context) => {
  const node = await eidos.currentSpace.getTreeNode(nodeId);
  if (node.type === "doc") {
    const docPublishUrl = `${PUBLISH_SERVER}/${context.env.SUBDOMAIN}/${nodeId}`;
    const res = await fetch(docPublishUrl, {
      method: "Delete",
      headers: {
        "x-auth-token": context.env.TOKEN,
      },
    });
    if (res.ok) {
      eidos.currentSpace.notify({
        title: "Success",
        description: "You have successfully unpublished your doc",
      });
    } else {
      return `Error: ${res.status} ${res.statusText}`;
    }
  }
};

export const unpublish = async (_input: {}, context: Context) => {
  const currentNodeId = context.currentNodeId;

  if (context.callFromTableAction && currentNodeId) {
    console.log(context.currentRowId);
    const rowId = context.currentRowId!;
    const nodeId = rowId.split("-").join("");
    await unpublishDoc(nodeId, context);
    await eidos.currentSpace.table(currentNodeId).rows.update(rowId, {
      published: false,
    });
    return {
      message: "Unpublished",
      rowId,
    };
  } else if (currentNodeId) {
    await unpublishDoc(currentNodeId, context);
  }
};
