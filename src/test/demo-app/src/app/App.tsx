import { memo } from "react";
import { selectors, useThunks, useSelector } from "app/libApi";

export const App = memo(() => {
    const counter = useSelector(state => state.usecase1.counter);
    const { isReady } = useSelector(selectors.usecase1.isReady);
    const { isReadyBig } = useSelector(selectors.usecase1.isReadyBig);
    const { usecase1Thunks, usecase2Thunks } = useThunks();

    usecase1Thunks.thunk1({ "pX": "" }).then(v => {
        /*...*/
    });

    return (
        <div onClick={() => usecase2Thunks.thunkX({ "pX": "xxx" })}>
            Hello World {counter} {isReady} {isReadyBig}
        </div>
    );
});
