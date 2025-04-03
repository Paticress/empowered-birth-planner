
// Generic utility types for the application

/**
 * Extracts the return type of a function, similar to TypeScript's built-in ReturnType
 * but with additional flexibility
 */
export type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;

/**
 * Creates a type that makes all properties of an object optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Creates a type that makes all properties of an object required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};
