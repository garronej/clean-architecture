import { createUsecaseContextApi } from "../../usecaseContext";
import type { ThunksExtraArgumentLike } from "../../usecaseContext";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Reflect } from "tsafe/Reflect";

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

{
    type Context = {
        _usecaseContextBrand: unknown;
    };

    const { getContext, ...rest } = createUsecaseContextApi<Context>(Reflect<() => Context>());

    assert<Equals<typeof rest, {}>>();

    {
        type GetContextExpected = (extraArg: ThunksExtraArgumentLike) => Context;

        assert<Equals<GetContextExpected, typeof getContext>>();
    }
}
