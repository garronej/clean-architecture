import type { UsecaseLike as UsecaseLike1 } from "./middlewareEvtAction";
import type { UsecaseLike as UsecaseLike2 } from "./usecasesToAutoDispatchThunks";
import type { UsecaseLike as UsecaseLike3 } from "./usecasesToPureFunctions";
import type { UsecaseLike as UsecaseLike4 } from "./usecasesToReducer";
import type { UsecaseLike as UsecaseLike5 } from "./usecasesToSelectors";

export type UsecaseLike_setup = UsecaseLike1 & UsecaseLike4;
export type UsecaseLike_index = UsecaseLike2 & UsecaseLike3 & UsecaseLike5;
