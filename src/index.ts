export type { GenericThunks } from "./usecasesToFunctions";
export type { GenericCreateEvt } from "./usecasesToEvts";
export { createCoreFromUsecases } from "./createCore";
export {
    createObjectThatThrowsIfAccessed,
    isObjectThatThrowIfAccessed,
    AccessError
} from "./createObjectThatThrowsIfAccessed";
export { createUsecaseContextApi } from "./usecaseContext";
