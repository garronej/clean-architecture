import { usecasesToSelectors, usecasesToAutoDispatchThunks } from "../../../..";
import { createStore, usecases } from "./setup";
export type { Dispatch, State } from "./setup";

export { createStore };
export const selectors = usecasesToSelectors(usecases);
export const { getAutoDispatchThunks } = usecasesToAutoDispatchThunks(usecases);
