import type * as immerTypesExternal from "immer/dist/types/types-external";

export type { immerTypesExternal };

export type UnwrapWritableDraft<T> = T extends immerTypesExternal.WritableDraft<infer U> ? U : never;

export function unwrapWritableDraft<T extends immerTypesExternal.WritableDraft<any>>(
    wrapped: T
): UnwrapWritableDraft<T> {
    return wrapped as any;
}
