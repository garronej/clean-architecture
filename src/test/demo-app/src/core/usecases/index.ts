import { usecase1Usecase_index, usecase1Usecase_setup } from "./usecase1";
import { usecase2Usecase_index, usecase2Usecase_setup } from "./usecase2";
import { usecase3Usecase_index, usecase3Usecase_setup } from "./usecase3";
import { usecasesToReducer, createMiddlewareEvtActionFactory, usecasesToSelectors, usecasesToAutoDispatchThunks } from "clean-redux";

const usecases_index = [usecase1Usecase_index, usecase2Usecase_index , usecase3Usecase_index];
const usecases_setup = [usecase1Usecase_setup, usecase2Usecase_setup, usecase3Usecase_setup];

export const { createMiddlewareEvtAction } = createMiddlewareEvtActionFactory(usecases_setup);
export const reducer = usecasesToReducer(usecases_setup);

export const selectors = usecasesToSelectors(usecases_index);
export const { getAutoDispatchThunks } = usecasesToAutoDispatchThunks(usecases_index);



