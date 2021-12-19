import { usecasesToSelectors, usecasesToAutoDispatchThunks } from "./beyond-redux-toolkit";
import { createStore, usecases } from "./setup";
export type { Dispatch, State } from "./setup";

export { createStore };
export const selectors = usecasesToSelectors(usecases);
export const { getAutoDispatchThunks } = usecasesToAutoDispatchThunks(usecases);
