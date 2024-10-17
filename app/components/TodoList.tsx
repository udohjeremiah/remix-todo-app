import { useMemo } from "react";
import type { Item, View } from "~/types";

import TodoItem from "~/components/TodoItem";

export default function TodoList({
  todos,
  view,
}: {
  todos: Item[];
  view: View;
}) {
  const visibleTodos = useMemo(
    () =>
      todos.filter((todo) =>
        view === "active"
          ? !todo.completed
          : view === "completed"
          ? todo.completed
          : true
      ),
    [todos, view]
  );

  if (visibleTodos.length === 0) {
    return (
      <p className="text-center leading-7">
        {view === "all"
          ? "No tasks available"
          : view === "active"
          ? "No active tasks"
          : "No completed tasks"}
      </p>
    );
  }

  return (
    <ul>
      {visibleTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
