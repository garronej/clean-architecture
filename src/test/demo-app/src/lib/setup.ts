import type { Action, ThunkAction as GenericThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { id } from "tsafe/id";
import type { Port1 } from "./ports/Port1";
import type { Port2 } from "./ports/Port2";
import { createPort2 } from "./secondaryAdapters/createProt2";
import type { Port2Config } from "./secondaryAdapters/createProt2";
import { createPort1 } from "./secondaryAdapters/createPort1";
import type { Port1Config } from "./secondaryAdapters/createPort1";
import * as usecase1 from "./usecases/usecase1";
import * as usecase2 from "./usecases/usecase2";
import * as usecase3 from "./usecases/usecase2";
import { usecasesToReducer } from "../../../..";
import type { ReturnType } from "tsafe";

export const usecases = [usecase1, usecase2, usecase3];

export type CreateStoreParams = {
    port1Config: Port1Config;
    port2Config: Port2Config;
};

export type ThunksExtraArgument = {
    createStoreParams: CreateStoreParams;
    port1: Port1;
    port2: Port2;
};

export async function createStore(params: CreateStoreParams) {
    const [port1, port2] = await Promise.all([
        createPort1(params.port1Config),
        createPort2(params.port2Config),
    ]);

    const store = configureStore({
        "reducer": usecasesToReducer(usecases),
        "middleware": getDefaultMiddleware =>
            getDefaultMiddleware({
                "thunk": {
                    "extraArgument": id<ThunksExtraArgument>({
                        "createStoreParams": params,
                        port1,
                        port2,
                    }),
                },
            }),
    });

    await store.dispatch(usecase3.privateThunks.initialize());

    return store;
}

type Store = ReturnType<typeof createStore>;

export type Dispatch = Store["dispatch"];

export type State = ReturnType<Store["getState"]>;

export type ThunkAction<RtnType = Promise<void>> = GenericThunkAction<
    RtnType,
    State,
    ThunksExtraArgument,
    Action<string>
>;
