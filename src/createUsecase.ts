import type { UsecaseLike_setup, UsecaseLike_index } from "./UsecaseLike";

export const createUsecase = {
    "setup": <Usecase extends UsecaseLike_setup>(
        usecase: Usecase,
    ): Record<`${Usecase["name"]}Usecase_setup`, Usecase> => {
        return { [usecase.name]: usecase } as any;
    },
    "index": <Usecase extends UsecaseLike_index>(
        usecase: Usecase,
    ): Record<`${Usecase["name"]}Usecase_index`, Usecase> => {
        return { [usecase.name]: usecase } as any;
    },
};
