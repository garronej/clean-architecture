import "minimal-polyfills/Object.fromEntries";
import type { Param0 } from "tsafe";
import { objectKeys } from "tsafe/objectKeys";
import type { ThunkAction, AnyAction } from "@reduxjs/toolkit";

export type ThunkToFunction<Thunk extends (params: any) => ThunkAction<any, any, any, any>> = (
    params: Param0<Thunk>
) => ReturnType<Thunk> extends ThunkAction<infer R, any, any, any> ? R : never;

export function thunkToFunction<
    Thunk extends (params: any) => ThunkAction<any, any, any, AnyAction>
>(params: { thunk: Thunk; dispatch: any }): ThunkToFunction<Thunk> {
    const { dispatch, thunk } = params;

    return (params: Param0<Thunk>) => dispatch(thunk(params));
}

export type ThunksToFunctions<
    Thunks extends Record<string, (params: any) => ThunkAction<any, any, any, AnyAction>>
> = { [Key in keyof Thunks]: ThunkToFunction<Thunks[Key]> };

export function thunksToFunctions<
    Thunks extends Record<string, (params: any) => ThunkAction<any, any, any, any>>
>(params: { thunks: Thunks; dispatch: any }): ThunksToFunctions<Thunks> {
    const { dispatch, thunks } = params;
    return Object.fromEntries(
        objectKeys(thunks).map(name => [name, thunkToFunction({ "thunk": thunks[name], dispatch })])
    ) as any;
}

export type UsecaseLike = {
    name: string;
    thunks: Record<string, (params: any) => ThunkAction<any, any, any, any>>;
};

export type CoreFunctions<Usecase extends UsecaseLike> = {
    [Key in Usecase["name"]]: ThunksToFunctions<Extract<Usecase, { name: Key }>["thunks"]>;
};

export function usecasesToFunctions<Usecase extends UsecaseLike>(params: {
    usecasesArr: readonly Usecase[];
    store: {
        dispatch: any;
    };
}): {
    functions: CoreFunctions<Usecase>;
} {
    const { store, usecasesArr } = params;

    const functions = Object.fromEntries(
        usecasesArr.map(({ name, thunks }) => [
            name,
            thunksToFunctions({ thunks, "dispatch": store.dispatch })
        ])
    ) as any;

    return { functions };
}
