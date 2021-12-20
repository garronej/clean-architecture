import { usecasesToSelectors, usecasesToAutoDispatchThunks } from "clean-redux";
import { createStore, usecases } from "./setup";
export type { Dispatch, State } from "./setup";

export { createStore };
export const selectors = usecasesToSelectors(usecases);
export const { getAutoDispatchThunks } = usecasesToAutoDispatchThunks(usecases);
