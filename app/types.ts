import { ObjectId } from "mongodb";

/**
 * Represents an individual todo item.
 */
export interface Item {
  /**
   * Unique identifier for the item.
   */
  id: string;

  /**
   * Description of the todo item.
   */
  description: string;

  /**
   * Whether the item is completed.
   */
  completed: boolean;

  /**
   * The date and time when the item was created.
   */
  createdAt: Date;

  /**
   * The date and time when the item was marked as completed. This field is optional and only present if the item is completed.
   */
  completedAt?: Date;

  /**
   * Whether the item is currently being edited. This field is optional.
   */
  editing?: boolean;
}

/**
 * Represents operations that can be performed on todo items.
 * This includes creating, reading, updating, and deleting todo items,
 * as well as clearing completed items or deleting all items.
 */
export interface Todo {
  /**
   * Creates a new todo item.
   * @param {string} userId - The unique identifier of the user associated with the todo item.
   * @param {string} description - The description of the new todo item.
   * @returns {Promise<Item | undefined>} A promise that resolves to the newly created todo item, or `undefined` if no user is found.
   */
  create: (userId: string, description: string) => Promise<Item | undefined>;

  /**
   * Retrieves all todo items for a specific user.
   * @param {string} userId - The unique identifier of the user whose todo items to retrieve.
   * @returns {Promise<Item[] | undefined>} A promise that resolves to an array of todo items for the user, or `undefined` if no user is found.
   */
  read: (userId: string) => Promise<Item[] | undefined>;

  /**
   * Updates an existing todo item by its `todoId`.
   * @param {string} userId - The unique identifier of the user associated with the todo item.
   * @param {string} todoId - The unique identifier of the todo item to update.
   * @param {Partial<Omit<Item, "todoId" | "userId" | "createdAt">>} fields - An object containing the fields to update.
   * @returns {Promise<Item | undefined>} A promise that resolves to the updated todo item, or `undefined` if the user or item is not found.
   */
  update: (
    userId: string,
    todoId: string,
    fields: Partial<Omit<Item, "_id" | "createdAt">>
  ) => Promise<Item | undefined>;

  /**
   * Deletes a todo item by its `todoId`.
   * @param {string} userId - The unique identifier of the user associated with the todo item.
   * @param {string} todoId - The unique identifier of the todo item to delete.
   * @returns {Promise<Item | undefined>} A promise that resolves to the deleted todo item, or `undefined` if the user or item is not found.
   */
  delete: (userId: string, todoId: string) => Promise<Item | undefined>;

  /**
   * Clears all completed todo items for a specific user.
   * If the userId is not associated with any user, it returns `undefined`.
   * @param {string} userId - The unique identifier of the user associated with the todo items.
   * @returns {Promise<Item[] | undefined>} A promise that resolves to the updated list of todo items, or `undefined` if no user is found.
   */
  clearCompleted: (userId: string) => Promise<Item[] | undefined>;

  /**
   * Deletes all todo items for a specific user.
   * @param {string} userId - The unique identifier of the user whose todo items are to be deleted.
   * @returns {Promise<Item[] | undefined>} A promise that resolves to an empty array indicating all items were deleted, or `undefined` if no user is found.
   */
  deleteAll: (userId: string) => Promise<Item[] | undefined>;
}

/**
 * Represents the current view mode for displaying todo items.
 *
 * - "all": Displays all todo items.
 * - "active": Displays only the active (incomplete) todo items.
 * - "completed": Displays only the completed todo items.
 */
export type View = "all" | "active" | "completed";

/**
 * Represents the available theme options for the application.
 *
 * - "system": Follows the system's color scheme, but defaults to light if JavaScript is disabled.
 * - "light": Applies the light color scheme.
 * - "dark": Applies the dark color scheme.
 */
export type Theme = "system" | "light" | "dark";

/**
 * Represents a user in the application.
 */
export interface User {
  /**
   * Unique identifier for the user in the database.
   * This field is optional because it should be left out when creating a new user,
   * allowing the MongoDB driver to automatically generate it.
   */
  _id?: ObjectId;

  /**
   * The date and time when the user account was created.
   */
  createdAt: Date;

  /**
   * The user's full name.
   */
  name: string;

  /**
   * The user's email address.
   */
  email: string;

  /**
   * The user's password details, including the salt and hash for secure storage.
   */
  password: {
    /**
     * Salt used in hashing the user's password.
     */
    salt: string;

    /**
     * Hash of the user's password.
     */
    hash: string;
  };

  /**
   * List of tasks associated with the user.
   */
  tasks: Item[];

  /**
   * Token for resetting the user's password. This field is optional and is only present if a password reset was requested.
   */
  forgotPasswordToken?: string;

  /**
   * The expiration timestamp for the password reset token, in milliseconds since the Unix epoch. This field is optional.
   */
  forgotPasswordTokenExpireAt?: number;
}
