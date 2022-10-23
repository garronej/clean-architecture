import type { ThunkAction, CreateEvt } from "../setup";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { State } from "../setup";
import { id } from "tsafe/id";
import { createSelector } from "@reduxjs/toolkit";
import type { Param0 } from "tsafe";

export type Usecase2State = {
    counter2: number;
    isDoingSomething2: boolean;
};

export const name = "usecase2";

export const { reducer, actions } = createSlice({
    name,
    "initialState": id<Usecase2State>({
        "counter2": -1,
        "isDoingSomething2": false,
    }),
    "reducers": {
        "thunkXStarted": state => {
            state.isDoingSomething2 = true;
        },
        "thunkXCompleted": (state, { payload }: PayloadAction<{ delta: number }>) => {
            const { delta } = payload;
            state.counter2 += delta;
            state.isDoingSomething2 = false;
        },
    },
});



export const thunks = {
    "thunkX":
        (params: { pX: string }): ThunkAction =>
        async (...args) => {
            const { pX } = params;
            const [dispatch, , thunkExtraArgument] = args;
            const { port2 } = thunkExtraArgument;

            dispatch(actions.thunkXStarted());

            const r = await port2.port2Method1({ "port2Method2Param1": pX });

            dispatch(actions.thunkXCompleted({ "delta": r }));
        },
    "thunkY":
        (params: { pY: string }): ThunkAction<Promise<number>> =>
        async (...args) => {
            const { pY } = params;
            const [dispatch, getState] = args;

            await dispatch(thunks.thunkX({ "pX": pY }));

            const { counter2 } = getState().usecase2;

            return counter2 + 42;
        },
};

export const privateThunks = {
    "initialize":
        (): ThunkAction =>
            async (...args) => {
                const [dispatch] = args;

                dispatch(actions.thunkXCompleted({ "delta": 1 }));
            },
};

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
        isReadyBig,
    };
})();


export const createEvt = ({ evtAction }: Param0<CreateEvt>) => {

    return evtAction
        .pipe(action => action.sliceName === "usecase2" ? [action] : null)
        .pipe(action => action.actionName === "thunkXCompleted" ? [action] : null);

};

