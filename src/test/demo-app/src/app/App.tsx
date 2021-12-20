import { useThunks, useSelector, selectors } from "app/libApi";

export function App() {

    const { usecase1Thunks } = useThunks();

    const { isReady } = useSelector(selectors.usecase1.isReady);

    return (
        <button onClick={() => usecase1Thunks.thunk1({ pX: "" })}>
            Hello World {isReady}
        </button>
    );
};
