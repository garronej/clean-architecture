import { memo, useEffect } from "react";
import { getCoreSync, useCoreState } from "core";
import { useEvt } from "evt/hooks";

export const App = memo(() => {
    const counter = useCoreState("usecase2", "counter2");
    const isReady = useCoreState("usecase2", "isReady");
    const isReadyBig = useCoreState("usecase2", "isReadyBig");
    const {
        functions: { usecase1, usecase2 },
        evts: { evtUsecase2 }
    } = getCoreSync();

    useEvt(
        ctx => {
            evtUsecase2.attach(ctx, ({ payload: { delta } }) => {
                console.log({ delta });
            });
        },
        [evtUsecase2]
    );

    useEffect(() => {
        usecase1.thunk1({ "pX": "" });
    }, [usecase1]);

    return (
        <button onClick={() => usecase2.thunkX({ "pX": "ok" })}>
            Hello World {counter} {isReady} {isReadyBig}
        </button>
    );
});
