import "minimal-polyfills/Object.fromEntries";
import type { Reducer } from "@reduxjs/toolkit";

/** see .types.test.ts file */
export function usecasesToReducer<UseCase extends { name: string; reducer: Reducer | null }>(
    useCases: readonly UseCase[],
): RemoveNullProperties<{
    [Key in UseCase["name"]]: Extract<UseCase, { name: Key }>["reducer"];
}> {
    return Object.fromEntries(
        useCases.map(({ name, reducer }) => [name, reducer]).filter(([, reducer]) => reducer !== null),
    ) as any;
}

type NonNullPropertyNames<O> = {
    [Key in keyof O]: O[Key] extends null ? never : Key;
}[keyof O];

type RemoveNullProperties<O> = { [Key in NonNullPropertyNames<O>]: O[Key] };
