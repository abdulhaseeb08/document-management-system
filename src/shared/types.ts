import { z } from "zod";

export const UUIDSchema = z.string().regex(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    "Invalid UUID"
)

export interface JWTPayload {
    iss?: string
    sub?: string
    aud?: string | string[]
    jti?: string
    nbf?: number
    exp?: number
    iat?: number
    [propName: string]: unknown
  }
export type UUID = string & { readonly __brand: unique symbol };
