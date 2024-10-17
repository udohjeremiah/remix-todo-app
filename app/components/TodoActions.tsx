import { useFetcher } from "@remix-run/react";
import { Item } from "~/types";

export default function TodoActions({ tasks }: { tasks: Item[] }) {
  const fetcher = useFetcher();

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <p className="text-center leading-7">
        {tasks.length} {tasks.length === 1 ? "item" : "items"} left
      </p>
      <fetcher.Form
        method="post"
        className="flex items-center gap-4"
        onSubmit={(event) => {
          const submitter = (event.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement;

          if (
            submitter.value === "clear completed" &&
            !confirm("Are you sure you want to clear all completed tasks?")
          ) {
            event.preventDefault();
            return;
          } else if (
            submitter.value === "delete all" &&
            !confirm("Are you sure you want to delete all tasks?")
          ) {
            event.preventDefault();
            return;
          }
        }}
      >
        <button
          disabled={!tasks.some((todo) => todo.completed)}
          name="intent"
          value="clear completed"
          className="text-red-400 transition hover:text-red-600 disabled:pointer-events-none disabled:opacity-25"
        >
          Clear Completed
        </button>
        <button
          disabled={tasks.length === 0}
          name="intent"
          value="delete all"
          className="text-red-400 transition hover:text-red-600 disabled:pointer-events-none disabled:opacity-25"
        >
          Delete All
        </button>
      </fetcher.Form>
    </div>
  );
}
