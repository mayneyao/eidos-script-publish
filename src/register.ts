import { Context, PUBLISH_SERVER } from "./main";
import { Eidos } from "@eidos.space/types";
declare const eidos: Eidos;

export const register = async (
  input: { subdomain: string },
  context: Context
) => {
  if (context.env.SUBDOMAIN) {
    eidos.currentSpace.notify({
      title: "Error",
      description: "You have already registered a subdomain!",
    });
    return;
  }
  // check subdomain, it must be a valid domain
  const reg = /^[a-z0-9-]+$/;
  if (!reg.test(input.subdomain)) {
    eidos.currentSpace.notify({
      title: "Error",
      description: "Invalid subdomain",
    });
    return;
  }
  const res = await fetch(`${PUBLISH_SERVER}/api/register`, {
    method: "POST",
    body: JSON.stringify({
      subdomain: input.subdomain,
    }),
  });
  const data = await res.json();
  const { token } = data;
  await (eidos.currentSpace.script as any).updateEnvMap("publish", {
    SUBDOMAIN: input.subdomain,
    TOKEN: token,
  });
  eidos.currentSpace.notify({
    title: "Success",
    description:
      "You have successfully registered a subdomain! Now refresh the page then you can publish your doc",
  });
};
