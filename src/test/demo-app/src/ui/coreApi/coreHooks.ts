import { useCore } from "./CoreProvider";
import { createReactApi } from "redux-clean-architecture/react";
import { usecasesApi } from "core";

export const {
    selectors,
    useCoreEvts,
    useCoreFunctions,
    useCoreState
} = createReactApi({
    useCore,
    usecasesApi
});
