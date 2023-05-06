import type { Thunks } from "../setup";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { State } from "../setup";
import { id } from "tsafe/id";
import { createSelector } from "@reduxjs/toolkit";

export type Usecase1State = {
    counter: number;
    isDoingSomething: boolean;
};

export const name = "usecase1";

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<Usecase1State>({
        "counter": 0,
        "isDoingSomething": false
    }),
    "reducers": {
        "thunk1Started": state => {
            state.isDoingSomething = true;
        },
        "thunk1Completed": (state, { payload }: PayloadAction<{ delta: number }>) => {
            const { delta } = payload;
            state.counter += delta;
            state.isDoingSomething = false;
        }
    }
});

export const thunks = {
    "thunk1":
        (params: { pX: string }) =>
        async (...args) => {
            const { pX } = params;
            const [dispatch, getState, thunkExtraArgument] = args;
            const { port2 } = thunkExtraArgument;

            if (getState().usecase1.isDoingSomething) {
                return;
            }

            dispatch(actions.thunk1Started());

            const r = await port2.port2Method1({ "port2Method2Param1": pX });

            dispatch(actions.thunk1Completed({ "delta": r }));
        },
    "thunk2":
        (params: { pY: string }) =>
        async (...args): Promise<number> => {
            const { pY } = params;
            const [dispatch, getState, { evtAction }] = args;

            if (getState().usecase2.isDoingSomething2) {
                await evtAction.waitFor(
                    e =>
                        e.sliceName === "usecase2" &&
                        e.actionName === "thunkXCompleted" &&
                        e.payload.delta !== 666
                );
            }

            await dispatch(thunks.thunk1({ "pX": pY }));

            const { counter } = getState().usecase1;

            return counter + 42;
        }
} satisfies Thunks;

export const selectors = (() => {
    const isBig = (state: State) => {
        const { counter } = state.usecase1;
        return counter > 1000;
    };

    const isReady = (state: State) => {
        const { counter, isDoingSomething } = state.usecase1;
        return !isDoingSomething && !isNaN(counter);
    };

    const isReadyBig = createSelector(isBig, isReady, (isBig, isReady) => isReady && isBig);

    return {
        isReady,
        isReadyBig
    };
})();
