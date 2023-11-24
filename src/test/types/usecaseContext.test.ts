import { createUsecaseContextApi } from "../../usecaseContext";
import type { RootContextLike } from "../../usecaseContext";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Reflect } from "tsafe/Reflect";

{
    type Context = {
        _usecaseContextBrand: unknown;
    };

    const { getContext, setContext } = createUsecaseContextApi<Context>();

    {
        type GetContextExpected = (rootContext: RootContextLike) => Context;

        assert<Equals<GetContextExpected, typeof getContext>>();
    }

    {
        type SetContextExpected = (
            rootContext: RootContextLike,
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
        type GetContextExpected = (rootContext: RootContextLike) => Context;

        assert<Equals<GetContextExpected, typeof getContext>>();
    }
}
