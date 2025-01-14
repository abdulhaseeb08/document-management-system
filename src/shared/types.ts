export type CommandResult<T> = { success: true; value: T } | { success: false; error: Error} ;
export type UUID = string & { readonly __brand: unique symbol };
