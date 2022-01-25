import { usecasesToSelectors, usecasesToAutoDispatchThunks } from "redux-clean-architecture";
import { createStore, usecases } from "./setup";
export type { Dispatch, State } from "./setup";

export { createStore };
export const selectors = usecasesToSelectors(usecases);
export const { getAutoDispatchThunks } = usecasesToAutoDispatchThunks(usecases);
