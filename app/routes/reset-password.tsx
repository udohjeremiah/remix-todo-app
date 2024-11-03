import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";

import EyeIcon from "~/components/icons/EyeIcon";
import EyeOffIcon from "~/components/icons/EyeOffIcon";
import LoaderIcon from "~/components/icons/LoaderIcon";

import { updatePassword } from "~/lib/db.server";
import { validateForm } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Reset Password | Todo App" },
    {
      name: "description",
      content: "Set a new password to secure your account.",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const token = formData.get("token") as string;
  const newPassword = formData.get("new-password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  const formError = validateForm({ newPassword, confirmPassword });
  if (formError) {
    return { errors: formError };
  }

  const { error } = await updatePassword(token, newPassword);
  if (error) {
    return { errors: { result: error } };
  }

  return redirect("/signin");
}

export default function ResetPassword() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const isSubmitting = navigation.formAction === "/reset-password";
  const errors = isSubmitting ? {} : actionData?.errors;

  return (
    <div className="flex flex-1 items-center justify-center p-6 md:mx-auto md:w-[720px] lg:p-20">
      <div className="w-full flex-col space-y-4 rounded-3xl border border-gray-200 bg-white/90 p-8 dark:border-gray-700 dark:bg-gray-900">
        <header>
          <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
            Password reset
          </h1>
        </header>
        <main>
          <Form method="post">
            <fieldset disabled={isSubmitting} className="mt-6 space-y-6">
              <input type="hidden" name="token" value={token} />
              <div className="space-y-2">
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium leading-none"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    name="new-password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="flex h-9 w-full rounded-3xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm disabled:pointer-events-none disabled:opacity-25 dark:border-white/50"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-[5px] text-gray-200 transition-colors hover:text-black/50 disabled:opacity-50 dark:text-white/50 dark:hover:text-white"
                    onClick={() =>
                      setShowNewPassword((prevPassword) => !prevPassword)
                    }
                  >
                    {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {errors?.newPassword && (
                  <p className="flex items-center text-sm font-medium leading-5 text-red-500">
                    {errors.newPassword}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium leading-none"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm-password"
                    placeholder="Re-enter new password"
                    autoComplete="off"
                    required
                    minLength={8}
                    className="flex h-9 w-full rounded-3xl border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm disabled:pointer-events-none disabled:opacity-25 dark:border-white/50"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-[5px] text-gray-200 transition-colors hover:text-black/50 disabled:opacity-50 dark:text-white/50 dark:hover:text-white"
                    onClick={() =>
                      setShowConfirmPassword((prevPassword) => !prevPassword)
                    }
                  >
                    {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {errors?.confirmPassword && (
                  <p className="flex items-center text-sm font-medium leading-5 text-red-500">
                    {errors.confirmPassword}
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
                    Reseting
                  </>
                ) : (
                  "Reset"
                )}
              </button>
            </fieldset>
            {errors?.result && (
              <output className="mt-6 block text-center text-sm font-medium leading-5 text-red-500">
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
