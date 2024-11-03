import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";

import LoaderIcon from "~/components/icons/LoaderIcon";

import { initiatePasswordReset } from "~/lib/db.server";
import { validateForm } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Forgot Password | Todo App" },
    {
      name: "description",
      content: "Recover your password to regain access to your account.",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = formData.get("email") as string;

  const formError = validateForm({ email });
  if (formError) {
    return { errors: formError };
  }

  const { error, data: token } = await initiatePasswordReset(email);
  if (error) {
    return { errors: { result: error } };
  }

  return redirect(`/reset-password?token=${token}`);
}

export default function ForgotPassword() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.formAction === "/forgot-password";
  const errors = isSubmitting ? {} : actionData?.errors;

  return (
    <div className="flex flex-1 items-center justify-center p-6 md:mx-auto md:w-[720px] lg:p-20">
      <div className="w-full flex-col space-y-4 rounded-3xl border border-gray-200 bg-white/90 p-8 dark:border-gray-700 dark:bg-gray-900">
        <header>
          <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
            Password recovery
          </h1>
        </header>
        <main>
          <Form method="post">
            <fieldset disabled={isSubmitting} className="mt-6 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                  inputMode="email"
                  required
                  className="flex h-9 w-full rounded-3xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm disabled:pointer-events-none disabled:opacity-25 dark:border-white/50"
                />
                {errors?.email && (
                  <p className="flex items-center text-sm font-medium leading-5 text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
              <button
                disabled={isSubmitting}
                className="flex h-9 w-full items-center justify-center rounded-full border-2 border-gray-200/50 bg-gradient-to-tl from-[#00fff0] to-[#0083fe] px-4 py-2 text-sm font-medium shadow transition hover:border-gray-500 disabled:pointer-events-none disabled:opacity-50 dark:border-white/50 dark:from-[#8e0e00] dark:to-[#1f1c18] dark:hover:border-white"
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Recovering
                  </>
                ) : (
                  "Recover"
                )}
              </button>
            </fieldset>
            {errors?.result && (
              <output className="mt-6 block text-center text-sm font-medium leading-5">
                {errors.result}
              </output>
            )}
          </Form>
          <div className="text-muted-foreground mt-8 flex h-5 items-center justify-center space-x-6 text-sm">
            <Link
              to="/signin"
              className="relative text-sm font-medium text-blue-500 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Sign in
            </Link>
            <div className="h-full w-[1px] border border-gray-200 dark:border-gray-700" />
            <Link
              to="/signup"
              className="relative text-sm font-medium text-blue-500 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Sign up
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
