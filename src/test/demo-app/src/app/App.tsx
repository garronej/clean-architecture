import { memo, useEffect } from "react";
import { selectors, useThunks, useSelector } from "app/libApi";

export const App = memo(() => {
    const counter = useSelector(state => state.usecase2.counter2);
    const { isReady } = useSelector(selectors.usecase2.isReady);
    const { isReadyBig } = useSelector(selectors.usecase2.isReadyBig);
    const { usecase1Thunks, usecase2Thunks } = useThunks();

    useEffect(() => {
        usecase1Thunks.thunk1({ "pX": "" }).then(v => {
            /*...*/
        });
    }, [usecase1Thunks]);

    return (
        <button onClick={() => usecase2Thunks.thunkX({ "pX": "ok" })}>
            Hello World {counter} {isReady} {isReadyBig}
        </button>
    );
});
