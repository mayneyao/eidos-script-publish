import { publish } from "./publish";

interface Env {
  // add your environment variables here
  SUBDOMAIN: string;
  TOKEN: string;
}

interface Table {
  // add your tables here
}

export interface Context {
  env: Env;
  tables: Table;
  currentNodeId?: string;
  currentRowId?: string;
  callFromTableAction?: boolean;
}

export const PUBLISH_SERVER = "https://eidos.ink";

export { unpublish } from "./unpublish";
export { register } from "./register";
export { publish } from "./publish";
export default publish;
