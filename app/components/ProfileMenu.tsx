import { Form, useRouteLoaderData } from "@remix-run/react";
import { useRef } from "react";

import LogOutIcon from "~/components/icons/LogOutIcon";
import UserRoundXIcon from "~/components/icons/UserRoundXIcon";

import type { loader as indexLoader } from "~/routes/_index";

export default function ProfileMenu() {
  const indexLoaderData =
    useRouteLoaderData<typeof indexLoader>("routes/_index");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const name = indexLoaderData?.name as string;
  const email = indexLoaderData?.email as string;

  return (
    <details ref={detailsRef} className="group relative cursor-pointer">
      <summary
        role="button"
        aria-haspopup="menu"
        aria-label="Open profile menu"
        tabIndex={0}
        className="flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 transition hover:border-gray-500 group-open:before:fixed group-open:before:inset-0 group-open:before:cursor-auto dark:border-gray-700 dark:bg-gray-900 [&::-webkit-details-marker]:hidden"
      >
        {name[0].toUpperCase()}
      </summary>

      <div
        role="menu"
        aria-roledescription="Profile menu"
        className="absolute right-0 top-full z-50 mt-2 min-w-max overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 py-1 text-sm font-semibold shadow-lg ring-1 ring-slate-900/10 dark:border-gray-700 dark:bg-gray-900 dark:ring-0"
      >
        <div
          role="presentation"
          className="cursor-default border-b border-gray-200 px-4 py-2 dark:border-gray-700"
        >
          <p>{name}</p>
          <p className="text-gray-600 dark:text-gray-400">{email}</p>
        </div>
        <Form
          role="presentation"
          preventScrollReset
          replace
          action="/_actions/signout"
          method="post"
          onSubmit={() => {
            detailsRef.current?.removeAttribute("open");
          }}
        >
          <button
            role="menuitem"
            className="flex w-full items-center px-4 py-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <LogOutIcon className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
            Sign out
          </button>
        </Form>
        <Form
          role="presentation"
          preventScrollReset
          replace
          action="/_actions/deleteAccount"
          method="post"
          onSubmit={(event) => {
            detailsRef.current?.removeAttribute("open");

            if (!confirm("Are you sure you want to delete your account?")) {
              event.preventDefault();
              return;
            }
          }}
        >
          <button
            role="menuitem"
            className="flex w-full items-center px-4 py-2 transition hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <UserRoundXIcon className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
            Delete
          </button>
        </Form>
      </div>
    </details>
  );
}
