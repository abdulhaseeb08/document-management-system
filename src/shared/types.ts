import { z } from "zod";

export const UUIDSchema = z.string().regex(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    "Invalid UUID"
)

export type CommandResult<T> = { success: true; value: T } | { success: false; error: Error} ;
export type UUID = string & { readonly __brand: unique symbol };
