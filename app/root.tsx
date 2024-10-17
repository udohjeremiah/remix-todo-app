import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="bg-white/90 font-system antialiased dark:bg-gray-900"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen max-w-[100vw] flex-col overflow-x-hidden bg-gradient-to-r from-[#00fff0] to-[#0083fe] px-4 py-8 text-black dark:from-[#8E0E00] dark:to-[#1F1C18] dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
