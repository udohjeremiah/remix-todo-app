import type { Item, Todo } from "~/types";

/**
 * List of todo items.
 */
const items: Item[] = [];

/**
 * Simulates an artificial delay in async operations to mimic real-world API behaviour.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
async function simulateDelay(): Promise<void> {
  const ARTIFICIAL_DELAY = 1000;
  await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_DELAY));
}

/**
 * An implementation of the `Todo` interface that manages a collection of todo items.
 */
export const todos: Todo = {
  async create(description: string) {
    await simulateDelay();

    const createdTodo: Item = {
      id: Math.random().toString(16).slice(2),
      description,
      completed: false,
      createdAt: new Date(),
    };

    items.push(createdTodo);

    return createdTodo;
  },

  async read() {
    await simulateDelay();

    return items;
  },

  async update(id: string, fields: Partial<Omit<Item, "id" | "createdAt">>) {
    await simulateDelay();

    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return undefined;
    }

    const updatedTodo: Item = {
      ...items[itemIndex],
      ...fields,
      completedAt: fields.completed ? fields.completedAt : undefined,
    };

    items[itemIndex] = updatedTodo;

    return updatedTodo;
  },

  async delete(id: string) {
    await simulateDelay();

    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return undefined;
    }

    const [deletedTodo] = items.splice(itemIndex, 1);

    return deletedTodo;
  },

  async clearCompleted() {
    await simulateDelay();

    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].completed) {
        items.splice(i, 1);
      }
    }

    return items;
  },

  async deleteAll() {
    await simulateDelay();

    items.length = 0;
    return items;
  },
};
