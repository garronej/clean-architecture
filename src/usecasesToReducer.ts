import "minimal-polyfills/Object.fromEntries";
import type { Reducer } from "@reduxjs/toolkit";

export type UsecaseLike = {
    name: string;
    reducer: Reducer | null;
};

export type UsecasesToReducer<Usecase extends UsecaseLike> = RemoveNullProperties<{
    [Key in Usecase["name"]]: Extract<Usecase, { name: Key }>["reducer"];
}>;

export function usecasesToReducer<Usecase extends UsecaseLike>(
    usecases: readonly Usecase[]
): UsecasesToReducer<Usecase> {
    return Object.fromEntries(
        usecases.map(({ name, reducer }) => [name, reducer]).filter(([, reducer]) => reducer !== null)
    ) as any;
}

type NonNullPropertyNames<O> = {
    [Key in keyof O]: O[Key] extends null ? never : Key;
}[keyof O];

type RemoveNullProperties<O> = { [Key in NonNullPropertyNames<O>]: O[Key] };
