import { usecasesToSelectors } from "./usecasesToSelectors";
import { usecasesToReducer } from "./usecasesToReducer";
import { usecasesToAutoDispatchThunks } from "./usecasesToAutoDispatchThunks";
import { usecasesToPureFunctions } from "./usecasesToPureFunctions";
import { createMiddlewareEvtActionFactory } from "./middlewareEvtAction";
import type { UsecaseLike_index, UsecaseLike_setup } from "./UsecaseLike";

export const compileUsecases = {
    "setup": <Usecase extends UsecaseLike_setup>(usecases: Usecase[]) => {
        const { createMiddlewareEvtAction } = createMiddlewareEvtActionFactory(usecases);
        const reducer = usecasesToReducer(usecases);

        return { createMiddlewareEvtAction, reducer };
    },
    "index": <Usecase extends UsecaseLike_index>(usecases: Usecase[]) => {
        const selectors = usecasesToSelectors(usecases);
        const { getAutoDispatchThunks } = usecasesToAutoDispatchThunks(usecases);
        const pure = usecasesToPureFunctions(usecases);

        return { selectors, getAutoDispatchThunks, pure };
    },
};
