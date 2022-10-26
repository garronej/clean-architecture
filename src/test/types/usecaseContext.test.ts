import { createUsecaseContextApi } from "../../usecaseContext";
import type { ThunksExtraArgumentLike } from "../../usecaseContext";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";

{
    type Context = {
        _usecaseContextBrand: unknown;
    };

    const { getContext, setContext } = createUsecaseContextApi<Context>();

    {
        type GetContextExpected = (extraArg: ThunksExtraArgumentLike) => Context;

        assert<Equals<GetContextExpected, typeof getContext>>();
    }

    {
        type SetContextExpected = (
            extraArg: ThunksExtraArgumentLike,
            context: Context | (() => Context)
        ) => void;

        assert<Equals<SetContextExpected, typeof setContext>>();
    }
}
