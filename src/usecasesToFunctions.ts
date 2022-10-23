import "minimal-polyfills/Object.fromEntries";
import { Polyfill as WeakMap } from "minimal-polyfills/WeakMap";
import type { Param0 } from "tsafe";
import { objectKeys } from "tsafe/objectKeys";
import type { ThunkAction, AnyAction, Action } from "@reduxjs/toolkit";

export type ThunkToFunction<Thunk extends (params: any) => ThunkAction<any, any, any, any>> = (
    params: Param0<Thunk>
) => ReturnType<Thunk> extends ThunkAction<infer R, any, any, any> ? R : never;

export function thunkToFunction<
    Thunk extends (params: any) => ThunkAction<any, any, any, AnyAction>
>(params: {
    thunk: Thunk;
    dispatch: (
        thunkAction: ThunkAction<
            ReturnType<Thunk> extends ThunkAction<infer RtnType, any, any, AnyAction> ? RtnType : never,
            ReturnType<Thunk> extends ThunkAction<any, infer State, any, AnyAction> ? State : never,
            ReturnType<Thunk> extends ThunkAction<any, any, infer ExtraThunkArg, AnyAction>
                ? ExtraThunkArg
                : never,
            AnyAction
        >
    ) => ReturnType<Thunk> extends ThunkAction<infer RtnType, any, any, AnyAction> ? RtnType : never;
}): ThunkToFunction<Thunk> {
    const { dispatch, thunk } = params;

    return (params: Param0<Thunk>) => dispatch(thunk(params)) as any;
}

export type ThunksToFunctions<
    Thunks extends Record<string, (params: any) => ThunkAction<any, any, any, AnyAction>>
> = { [Key in keyof Thunks]: ThunkToFunction<Thunks[Key]> };

export function thunksToFunctions<
    Thunks extends Record<string, (params: any) => ThunkAction<any, any, any, any>>
>(params: {
    thunks: Thunks;
    dispatch: (
        thunkAction: ThunkAction<
            ReturnType<Thunks[keyof Thunks]> extends ThunkAction<infer RtnType, any, any, AnyAction>
                ? RtnType
                : never,
            ReturnType<Thunks[keyof Thunks]> extends ThunkAction<any, infer State, any, AnyAction>
                ? State
                : never,
            ReturnType<Thunks[keyof Thunks]> extends ThunkAction<
                any,
                any,
                infer ExtraThunkArg,
                AnyAction
            >
                ? ExtraThunkArg
                : never,
            AnyAction
        >
    ) => ReturnType<Thunks[keyof Thunks]> extends ThunkAction<infer RtnType, any, any, AnyAction>
        ? RtnType
        : never;
}): ThunksToFunctions<Thunks> {
    const { dispatch, thunks } = params;
    return Object.fromEntries(
        objectKeys(thunks).map(name => [name, thunkToFunction({ "thunk": thunks[name], dispatch })])
    ) as any;
}

export type UsecaseLike = {
    name: string;
    thunks: Record<string, (params: any) => ThunkAction<any, any, any, any>>;
};

export type CoreLike<Usecase extends UsecaseLike> = {
    dispatch: (
        thunkAction: ThunkAction<
            ReturnType<Usecase["thunks"][keyof Usecase["thunks"]]> extends ThunkAction<
                infer RtnType,
                any,
                any,
                AnyAction
            >
                ? RtnType
                : never,
            ReturnType<Usecase["thunks"][keyof Usecase["thunks"]]> extends ThunkAction<
                any,
                infer State,
                any,
                AnyAction
            >
                ? State
                : never,
            ReturnType<Usecase["thunks"][keyof Usecase["thunks"]]> extends ThunkAction<
                any,
                any,
                infer ExtraThunkArg,
                AnyAction
            >
                ? ExtraThunkArg
                : never,
            AnyAction
        >
    ) => ReturnType<Usecase["thunks"][keyof Usecase["thunks"]]> extends ThunkAction<
        infer RtnType,
        any,
        any,
        AnyAction
    >
        ? RtnType
        : never;
};

export type GetMemoizedCoreFunctions<Usecase extends UsecaseLike> = (core: CoreLike<Usecase>) => {
    [Key in Usecase["name"]]: ThunksToFunctions<Extract<Usecase, { name: Key }>["thunks"]>;
};

export function usecasesToFunctions<Usecase extends UsecaseLike>(
    usecases: readonly Usecase[]
): {
    getMemoizedCoreFunctions: GetMemoizedCoreFunctions<Usecase>;
} {
    const functionsBtDispatch = new WeakMap<Record<string, unknown>, any>();

    return {
        "getMemoizedCoreFunctions": core => {
            let functions = functionsBtDispatch.get(core);

            if (functions !== undefined) {
                return functions;
            }

            functions = Object.fromEntries(
                usecases.map(({ name, thunks }) => [
                    name,
                    thunksToFunctions({ thunks, "dispatch": core.dispatch })
                ])
            ) as any;

            functionsBtDispatch.set(core, functions);

            return functions;
        }
    };
}

export type GenericThunks<
    Core extends {
        getState: () => any;
        thunksExtraArgument: Record<string, unknown>;
    }
> = Record<
    string,
    (
        params: any
    ) => ThunkAction<any, ReturnType<Core["getState"]>, Core["thunksExtraArgument"], Action<string>>
>;
