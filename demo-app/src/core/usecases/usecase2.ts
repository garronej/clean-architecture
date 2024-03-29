import type { Thunks, CreateEvt } from "../bootstrap";
import type { State as RootState } from "../bootstrap";
import { id } from "tsafe/id";
import { createUsecaseContextApi, createUsecaseActions, createSelector } from "clean-architecture";

export type State = {
    counter2: number;
    isDoingSomething2: boolean;
};

export const name = "usecase2";

export const { reducer, actions } = createUsecaseActions({
    name,
    "initialState": id<State>({
        "counter2": -1,
        "isDoingSomething2": false
    }),
    "reducers": {
        "thunkXStarted": state => {
            state.isDoingSomething2 = true;
        },
        "thunkXCompleted": (state, { payload }: { payload: { delta: number } }) => {
            const { delta } = payload;
            state.counter2 += delta;
            state.isDoingSomething2 = false;
        }
    }
});

export const thunks = {
    "thunkX":
        (params: { pX: string }) =>
        async (...args) => {
            const { pX } = params;
            const [dispatch, , rootContext] = args;
            const { port2 } = rootContext;

            const { n } = getContext(rootContext);

            dispatch(actions.thunkXStarted());

            const r = await port2.port2Method1({ "port2Method2Param1": pX });

            dispatch(actions.thunkXCompleted({ "delta": r + n }));
        },
    "thunkY":
        (params: { pY: string }) =>
        async (...args): Promise<number> => {
            const { pY } = params;
            const [dispatch, getState] = args;

            await dispatch(thunks.thunkX({ "pX": pY }));

            const { counter2 } = getState().usecase2;

            return counter2 + 42;
        }
} satisfies Thunks;

export const privateThunks = {
    "initialize":
        () =>
        async (...args) => {
            const [dispatch, , rootContext] = args;

            setContext(rootContext, () => ({ "n": 42 }));

            dispatch(actions.thunkXCompleted({ "delta": 1 }));
        }
} satisfies Thunks;

type Context = {
    n: number;
};

const { getContext, setContext } = createUsecaseContextApi<Context>();

export const selectors = (() => {
    const state = (state: RootState) => state[name];

    const counter2 = createSelector(state, state => state.counter2);

    const isBig = createSelector(state, state => {
        return state.counter2 > 1000;
    });

    const isReady = createSelector(state, state => {
        const { isDoingSomething2, counter2 } = state;
        return !isDoingSomething2 && !isNaN(counter2);
    });

    const isReadyBig = createSelector(isBig, isReady, (isBig, isReady) => isReady && isBig);

    return {
        counter2,
        isReady,
        isReadyBig
    };
})();

export const createEvt = (({ evtAction }) =>
    evtAction
        .pipe(action => (action.usecaseName === "usecase2" ? [action] : null))
        .pipe(action =>
            action.actionName === "thunkXCompleted" ? [action] : null
        )) satisfies CreateEvt;
