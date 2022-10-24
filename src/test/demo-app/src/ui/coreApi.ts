import { createReactApi } from "redux-clean-architecture/react";
import { usecasesApi, createCore } from "core";

export const {
    createCoreProvider,
    selectors,
    useCoreEvts,
    useCoreFunctions,
    useCoreState,
    useCoreExtras,
} = createReactApi({
    createCore,
    usecasesApi
});
