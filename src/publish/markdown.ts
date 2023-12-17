import { marked } from "marked";
import { Eidos } from "@eidos.space/types";
import { Context, PUBLISH_SERVER } from "../main";
declare const eidos: Eidos;

export const imageUrlSet = new Set<string>();
// per render to collect image urls
const getPreRender = () => {
  const renderer = new marked.Renderer();
  const originalRendererImage = renderer.image.bind(renderer);
  renderer.image = (href, title, text) => {
    console.log("href", href);
    if (href.startsWith("/")) {
      imageUrlSet.add(href);
    }
    return originalRendererImage(href, title, text);
  };
  return renderer;
};

const getReplaceImgRender = (host: string) => {
  const renderer = new marked.Renderer();
  const originalRendererImage = renderer.image.bind(renderer);
  renderer.image = (href, title, text) => {
    if (href.startsWith("/")) {
      return originalRendererImage(`${host}${href}`, title, text);
    }
    return originalRendererImage(href, title, text);
  };
  return renderer;
};

export const markdown2html = async (markdown: string, context: Context) => {
  // pre render to collect image urls
  marked.parse(markdown, { renderer: getPreRender() });
  const publishServiceURL = new URL(PUBLISH_SERVER);
  for (const url of imageUrlSet) {
    const file = await eidos.currentSpace.file.getFileByPath(`spaces${url}`);
    if (file) {
      const blobURL = await eidos.currentSpace.file.getBlobURL(file.id);
      const fileResp = await fetch(blobURL!);
      const fileBlob = await fileResp.blob();
      publishServiceURL.pathname = `/${context.env.SUBDOMAIN}/check-file${url}`;
      const resp = await fetch(publishServiceURL.toString());
      const data = await resp.json();
      if (!data.success) {
        publishServiceURL.pathname = `/${context.env.SUBDOMAIN}/files${url}`;
        const docPublishUrl = publishServiceURL.toString();
        await fetch(docPublishUrl, {
          method: "PUT",
          body: fileBlob,
          headers: {
            "x-auth-token": context.env.TOKEN,
          },
        });
      }
    }
  }
  imageUrlSet.clear();
  const host = new URL(PUBLISH_SERVER);
  host.pathname = `/${context.env.SUBDOMAIN}/files`;
  return marked.parse(markdown, {
    renderer: getReplaceImgRender(host.toString()),
  });
};
