import { memo, useEffect } from "react";
import { selectors, useCoreEvts, useCoreState, useCoreFunctions } from "core";
import { useEvt } from "evt/hooks";

export const App = memo(() => {
    const counter = useCoreState(state => state.usecase2.counter2);
    const { isReady } = useCoreState(selectors.usecase2.isReady);
    const { isReadyBig } = useCoreState(selectors.usecase2.isReadyBig);
    const { usecase1, usecase2 } = useCoreFunctions();
    const { evtUsecase2 } = useCoreEvts();

    useEvt(ctx => {
        evtUsecase2.attach(ctx, ({ payload: { delta } }) => {
            console.log({ delta });
        });
    }, [evtUsecase2]);

    useEffect(() => {

        usecase1.thunk1({ "pX": "" });

    }, [usecase1]);

    return (
        <button onClick={() => usecase2.thunkX({ "pX": "ok" })}>
            Hello World {counter} {isReady} {isReadyBig}
        </button>
    );
});