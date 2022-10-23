import { createReactApi } from "redux-clean-architecture/react";
import { usecasesApi, createCore } from "core";
export type { CoreParams } from "core";

export const {
    CoreProvider, 
    selectors,
    useCoreEvts,
    useCoreFunctions,
    useCoreState
} = createReactApi({
    createCore,
    usecasesApi
});
