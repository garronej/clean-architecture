import { memo, useEffect } from "react";
import { selectors, useCoreEvts, useCoreState, useCoreFunctions } from "ui/coreApi";
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

        (async ()=> {

            try{

                await usecase1.thunk1({ "pX": "" });

            }catch(error){
                console.log("============>", String(error));
            }

        })();

    },
        [usecase1]
    );

    return (
        <button onClick={() => usecase2.thunkX({ "pX": "ok" })}>
            Hello World {counter} {isReady} {isReadyBig}
        </button>
    );
});