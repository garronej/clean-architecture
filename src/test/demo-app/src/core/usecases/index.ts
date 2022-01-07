import { usecase1Usecase_index, usecase1Usecase_setup } from "./usecase1";
import { usecase2Usecase_index, usecase2Usecase_setup } from "./usecase2";
import { usecase3Usecase_index, usecase3Usecase_setup } from "./usecase3";
import { compileUsecases } from "clean-redux";

export const { getAutoDispatchThunks, pure, selectors } = compileUsecases.index([usecase1Usecase_index, usecase2Usecase_index, usecase3Usecase_index]);
export const { createMiddlewareEvtAction, reducer } = compileUsecases.setup([usecase1Usecase_setup, usecase2Usecase_setup, usecase3Usecase_setup]);




