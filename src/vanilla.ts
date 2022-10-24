import type { UsecasesApi, UsecaseLike as UsecaseLike_create } from "./createUsecasesApi";
import type { GetMemoizedCoreFunctions } from "./usecasesToFunctions";
import type { UsecaseLike as UseCaseLike_reducer } from "./usecasesToReducer";
import type { GenericCore } from "./createCore";
import type { UsecaseLike as UsecaseLike_evt } from "./middlewareEvtAction";
import type { GetMemoizedCoreEvts } from "./usecasesToEvts";
import type { GenericSelectors } from "./usecasesToSelectors";
import { Evt } from "evt";
import type { NonPostableEvt } from "evt";

type UsecaseLike = UsecaseLike_create & UseCaseLike_reducer & UsecaseLike_evt;

type VanillaApi<
    Usecase extends UsecaseLike,
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>
> = {
    getState: GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase>["getState"];
    evtStateUpdated: NonPostableEvt<void>;
    selectors: GenericSelectors<Usecase>;
    coreEvts: ReturnType<GetMemoizedCoreEvts<Usecase>>;
    extras: GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase>["thunksExtraArgument"];
    functions: ReturnType<GetMemoizedCoreFunctions<Usecase>>;
};

/** To use on the backend */
export async function createVanillaApi<
    CoreParams extends Record<string, unknown>,
    Usecase extends UsecaseLike,
    ThunksExtraArgumentWithoutEvtAction extends Record<string, unknown>
>(params: {
    createCore: (
        params: CoreParams
    ) => Promise<GenericCore<ThunksExtraArgumentWithoutEvtAction, Usecase>>;
    usecasesApi: UsecasesApi<Usecase>;
    coreParams: CoreParams;
}): Promise<VanillaApi<Usecase, ThunksExtraArgumentWithoutEvtAction>> {
    const { createCore, usecasesApi, coreParams } = params;

    const { selectors, getMemoizedCoreEvts, getMemoizedCoreFunctions } = usecasesApi;

    const core = await createCore(coreParams);

    const { getState, thunksExtraArgument: extras } = core;

    const functions = getMemoizedCoreFunctions(core as any);

    const coreEvts = getMemoizedCoreEvts(core);

    const evtStateUpdated = Evt.asNonPostable(extras.evtAction.pipe(() => [undefined as void]));

    return {
        getState,
        evtStateUpdated,
        selectors,
        coreEvts,
        functions,
        extras
    };
}
