import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions.server";

import { deleteUser } from "~/lib/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const { error } = await deleteUser(session.get("_id") as string);
  if (error) {
    return;
  }

  return redirect("/signup", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
