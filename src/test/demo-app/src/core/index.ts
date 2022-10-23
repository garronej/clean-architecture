import { usecasesToSelectors, usecasesToFunctions, usecasesToEvts } from "redux-clean-architecture";
import { createCore, usecases } from "./setup";
export type { Core, State } from "./setup";

export { createCore };
export const selectors = usecasesToSelectors(usecases);
export const { getMemoizedCoreFunctions } = usecasesToFunctions(usecases);
export const { getMemoizedCoreEvts } = usecasesToEvts(usecases);

