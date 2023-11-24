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
      const html =
        `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
          body {
            font: 400 16px/1.5 "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: #111;
            background-color: #fbfbfb;
            -webkit-text-size-adjust: 100%;
            -webkit-font-feature-settings: "kern" 1;
            -moz-font-feature-settings: "kern" 1;
            -o-font-feature-settings: "kern" 1;
            font-feature-settings: "kern" 1;
            font-kerning: normal;
            padding: 30px;
        }
        
        main {
          max-width: 900px;
          margin: 0 auto;
        }
        
        @media only screen and (max-width: 600px) {
            body {
                padding: 5px;
            }
            body>#content {
                padding: 0px 20px 20px 20px !important;
            }
        }
        
        body>#content {
            margin: 0px;
            max-width: 900px;
            border: 1px solid #e1e4e8;
            padding: 10px 40px;
            padding-bottom: 20px;
            border-radius: 2px;
            margin-left: auto;
            margin-right: auto;
        }
        
        summary {
            cursor: pointer;
            text-decoration: underline;
        }
        
        hr {
            color: #bbb;
            background-color: #bbb;
            height: 1px;
            flex: 0 1 auto;
            margin: 1em 0;
            padding: 0;
            border: none;
        }
        
        .hljs-operator {
            color: #868686;
            /* There is a bug where the syntax highlighter would pick no color for e.g. ` &&
        ` symbols in the code samples. Let's overwrite this */
        }
        
        
        /**
         * Links
         */
        
        a {
            color: #0366d6;
            text-decoration: none;
        }
        
        a:visited {
            color: #0366d6;
        }
        
        a:hover {
            color: #0366d6;
            text-decoration: underline;
        }
        
        pre {
            background-color: #f6f8fa;
            border-radius: 3px;
            font-size: 85%;
            line-height: 1.45;
            overflow: auto;
            padding: 16px;
        }
        
        
        /**
          * Code blocks
          */
        
        code {
            background-color: rgba(27, 31, 35, .05);
            border-radius: 3px;
            font-size: 85%;
            margin: 0;
            word-wrap: break-word;
            padding: .2em .4em;
            font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
        }
        
        pre>code {
            background-color: transparent;
            border: 0;
            display: inline;
            line-height: inherit;
            margin: 0;
            overflow: visible;
            padding: 0;
            word-wrap: normal;
            font-size: 100%;
        }
        
        
        /**
         * Blockquotes
         */
        
        blockquote {
            margin-left: 30px;
            margin-top: 0px;
            margin-bottom: 16px;
            border-left-width: 3px;
            padding: 0 1em;
            color: #828282;
            border-left: 4px solid #e8e8e8;
            padding-left: 15px;
            font-size: 18px;
            letter-spacing: -1px;
            font-style: italic;
        }
        
        blockquote * {
            font-style: normal !important;
            letter-spacing: 0;
            color: #6a737d !important;
        }
        
        
        /**
         * Tables
         */
        
        table {
            border-spacing: 2px;
            display: block;
            font-size: 14px;
            overflow: auto;
            width: 100%;
            margin-bottom: 16px;
            border-spacing: 0;
            border-collapse: collapse;
        }
        
        td {
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
        }
        
        th {
            font-weight: 600;
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
        }
        
        tr {
            background-color: #fff;
            border-top: 1px solid #c6cbd1;
        }
        
        table tr:nth-child(2n) {
            background-color: #f6f8fa;
        }
        
        
        /**
         * Others
         */
        
        img {
            max-width: 100%;
        }
        
        p {
            line-height: 24px;
            font-weight: 400;
            font-size: 16px;
            color: #24292e;
        }
        
        ul {
            margin-top: 0;
        }
        
        li {
            color: #24292e;
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
        }
        
        li+li {
            margin-top: 0.25em;
        }
        
        * {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            color: #24292e;
        }
        
        a:visited {
            color: #0366d6;
        }
        
        h1,
        h2,
        h3 {
            border-bottom: 1px solid #eaecef;
            color: #111;
            /* Darker */
        }
        
        code>* {
            font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace !important;
        }
          </style>
        </head>
        <body>
        <main>
          <h1>${title}</h1>
          ${content}
        </main>
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
