import { createUsecasesApi } from "redux-clean-architecture";
import { createCore, usecases } from "./setup";
export type { Core, State } from "./setup";

export { createCore };

export const usecasesApi = createUsecasesApi(usecases);

