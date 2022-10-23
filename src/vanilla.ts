import type { UsecasesApi, UsecaseLike } from "./createUsecasesApi";
import type { CoreLike as CoreLike_functions } from "./usecasesToFunctions";
import type { CoreLike as CoreLike_evts } from "./usecasesToEvts";
import { Evt } from "evt";

type CoreLike<Usecase extends UsecaseLike> = CoreLike_functions<Usecase> & CoreLike_evts;

/** To use on the backend */
export async function createVanillaApi<
    CoreParams extends Record<string, unknown>,
    Usecase extends UsecaseLike,
    Core extends CoreLike<Usecase>
>(params: {
    createCore: (params: CoreParams) => Promise<Core>;
    usecasesApi: UsecasesApi<Usecase>;
    coreParams: CoreParams;
}) {
    const { createCore, usecasesApi, coreParams } = params;

    const { selectors, getMemoizedCoreEvts, getMemoizedCoreFunctions } = usecasesApi;

    const core = await createCore(coreParams);

    const {
        getState,
        thunksExtraArgument: { evtAction }
    } = core;

    const functions = getMemoizedCoreFunctions(core);

    const coreEvts = getMemoizedCoreEvts(core);

    const evtStateUpdated = Evt.asNonPostable(evtAction.pipe(() => [undefined as void]));

    return {
        getState,
        evtStateUpdated,
        selectors,
        coreEvts,
        ...functions
    };
}
