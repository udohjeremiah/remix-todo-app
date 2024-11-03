import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/signin", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
