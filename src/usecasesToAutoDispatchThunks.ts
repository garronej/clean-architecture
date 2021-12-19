/* eslint-disable no-lone-blocks */
import "minimal-polyfills/Object.fromEntries";
import type { Param0 } from "tsafe";
import { objectKeys } from "tsafe/objectKeys";
import type { ThunkAction, AnyAction } from "@reduxjs/toolkit";

export type ThunkToAutoDispatchThunk<Thunk extends (params: any) => ThunkAction<any, any, any, any>> = (
    params: Param0<Thunk>,
) => ReturnType<Thunk> extends ThunkAction<infer R, any, any, any> ? R : never;

export function thunkToAutoDispatchThunk<
    Thunk extends (params: any) => ThunkAction<any, any, any, AnyAction>,
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
        >,
    ) => ReturnType<Thunk> extends ThunkAction<infer RtnType, any, any, AnyAction> ? RtnType : never;
}): ThunkToAutoDispatchThunk<Thunk> {
    const { dispatch, thunk } = params;

    return (params: Param0<Thunk>) => dispatch(thunk(params)) as any;
}

export type ThunksToAutoDispatchThunks<
    Thunks extends Record<string, (params: any) => ThunkAction<any, any, any, AnyAction>>,
> = { [Key in keyof Thunks]: ThunkToAutoDispatchThunk<Thunks[Key]> };

export function thunksToAutoDispatchThunks<
    Thunks extends Record<string, (params: any) => ThunkAction<any, any, any, any>>,
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
        >,
    ) => ReturnType<Thunks[keyof Thunks]> extends ThunkAction<infer RtnType, any, any, AnyAction>
        ? RtnType
        : never;
}): ThunksToAutoDispatchThunks<Thunks> {
    const { dispatch, thunks } = params;
    return Object.fromEntries(
        objectKeys(thunks).map(name => [
            name,
            thunkToAutoDispatchThunk({ "thunk": thunks[name], dispatch }),
        ]),
    ) as any;
}

const wordId = "Thunks";

export function usecasesToAutoDispatchThunks<
    Usecase extends {
        name: string;
        thunks: Record<string, (params: any) => ThunkAction<any, any, any, any>>;
    },
>(
    usecases: readonly Usecase[],
): {
    getAutoDispatchThunks: (
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
            >,
        ) => ReturnType<Usecase["thunks"][keyof Usecase["thunks"]]> extends ThunkAction<
            infer RtnType,
            any,
            any,
            AnyAction
        >
            ? RtnType
            : never,
    ) => {
        [Key in `${Usecase["name"]}${typeof wordId}`]: ThunksToAutoDispatchThunks<
            Extract<
                Usecase,
                { name: Key extends `${infer Name}${typeof wordId}` ? Name : never }
            >["thunks"]
        >;
    };
} {
    return null as any;
}
