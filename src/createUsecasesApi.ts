import { usecasesToSelectors } from "./usecasesToSelectors";
import type { UsecaseLike as UsecaseLike_selectors, GenericSelectors } from "./usecasesToSelectors";
import { usecasesToEvts } from "./usecasesToEvts";
import { UsecaseLike as UsecaseLike_evts, GetMemoizedCoreEvts } from "./usecasesToEvts";
import { usecasesToFunctions } from "./usecasesToFunctions";
import type {
    UsecaseLike as UsecaseLike_functions,
    GetMemoizedCoreFunctions
} from "./usecasesToFunctions";

export type UsecaseLike = UsecaseLike_selectors & UsecaseLike_evts & UsecaseLike_functions;

export type UsecasesApi<Usecase extends UsecaseLike> = {
    selectors: GenericSelectors<Usecase>;
    getMemoizedCoreEvts: GetMemoizedCoreEvts<Usecase>;
    getMemoizedCoreFunctions: GetMemoizedCoreFunctions<Usecase>;
};

export function createUsecasesApi<Usecase extends UsecaseLike>(
    usecasesArr: readonly Usecase[]
): UsecasesApi<Usecase> {
    const selectors = usecasesToSelectors(usecasesArr);
    const { getMemoizedCoreEvts } = usecasesToEvts(usecasesArr);
    const { getMemoizedCoreFunctions } = usecasesToFunctions(usecasesArr);

    return { selectors, getMemoizedCoreEvts, getMemoizedCoreFunctions };
}
