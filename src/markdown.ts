import { marked } from "marked";
import { Eidos } from "@eidos.space/types";
import { Context } from "./main";
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
  const publishServiceURL = new URL(context.env.API_END_POINT);
  if (!context.env.AUTH_KEY_SECRET) {
    console.warn("AUTH_KEY_SECRET is not set, skip publish images");
  }
  for (const url of imageUrlSet) {
    const file = await eidos.currentSpace.file.getFileByPath(`spaces${url}`);
    if (file) {
      const blobURL = await eidos.currentSpace.file.getBlobURL(file.id);
      const fileResp = await fetch(blobURL!);
      const fileBlob = await fileResp.blob();
      publishServiceURL.pathname = `/files${url}`;
      const docPublishUrl = publishServiceURL.toString();
      await fetch(docPublishUrl, {
        method: "PUT",
        body: fileBlob,
        headers: {
          "X-Custom-Auth-Key": context.env.AUTH_KEY_SECRET,
        },
      });
    }
  }
  imageUrlSet.clear();
  const host = new URL(context.env.API_END_POINT);
  host.pathname = "/files";
  return marked.parse(markdown, {
    renderer: getReplaceImgRender(host.toString()),
  });
};
