import type { ThunkAction } from "../setup";
import { createUsecase } from "clean-redux";

export const name = "usecase3" as const;


export const thunks = {
    "thunkZ":
        (params: { pZ: string }): ThunkAction<string> =>
        (...args) => {
            const { pZ } = params;
            const [, getState] = args;

            return pZ + getState().usecase1.counter;
        },
};


export const { usecase3Usecase_index } = createUsecase.index({ name, thunks });
export const { usecase3Usecase_setup } = createUsecase.setup({ name, "reducer": null });
