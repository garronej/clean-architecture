import { usecasesToSelectors } from "./usecasesToSelectors";
import type { UsecaseLike as UsecaseLike_selectors, Selectors } from "./usecasesToSelectors";
import { usecasesToEvts } from "./usecasesToEvts";
import { UsecaseLike as UsecaseLike_evts, GetMemoizedCoreEvts } from "./usecasesToEvts";
import { usecasesToFunctions } from "./usecasesToFunctions";
import type {
    UsecaseLike as UsecaseLike_functions,
    GetMemoizedCoreFunctions
} from "./usecasesToFunctions";

export type UsecaseLike = UsecaseLike_selectors & UsecaseLike_evts & UsecaseLike_functions;

export type UsecasesApi<Usecase extends UsecaseLike> = {
    selectors: Selectors<Usecase>;
    getMemoizedCoreEvts: GetMemoizedCoreEvts<Usecase>;
    getMemoizedCoreFunctions: GetMemoizedCoreFunctions<Usecase>;
};

export function createUsecasesApi<Usecase extends UsecaseLike>(
    usecases: readonly Usecase[]
): UsecasesApi<Usecase> {
    const selectors = usecasesToSelectors(usecases);
    const { getMemoizedCoreEvts } = usecasesToEvts(usecases);
    const { getMemoizedCoreFunctions } = usecasesToFunctions(usecases);

    return { selectors, getMemoizedCoreEvts, getMemoizedCoreFunctions };
}
