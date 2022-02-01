import type { AsyncThunkPayloadCreator, AsyncThunk, Dispatch } from "@reduxjs/toolkit";
import { createAsyncThunk as createAsyncThunk_base } from "@reduxjs/toolkit";

export function createAsyncThunkFactory<
    AsyncThunkConfig extends {
        /** return type for `thunkApi.getState` */
        state?: unknown;
        /** type for `thunkApi.dispatch` */
        dispatch?: Dispatch;
        /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
        extra?: unknown;
        /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
        rejectValue?: unknown;
        /** return type of the `serializeError` option callback */
        serializedErrorType?: unknown;
        /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
        pendingMeta?: unknown;
        /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
        fulfilledMeta?: unknown;
        /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
        rejectedMeta?: unknown;
    },
>() {
    function createAsyncThunk<
        SpecificAsyncThunkConfig extends {
            rejectValue?: unknown;
            serializedErrorType?: unknown;
            pendingMeta?: unknown;
            fulfilledMeta?: unknown;
            rejectedMeta?: unknown;
        } = {},
    >() {
        return function <ThunkName extends string, ThunkArg, Returned>(
            //NOTE: Here it's an eslint error that can be ignored.
            typePrefix: `${string}/${ThunkName}`,
            payloadCreator: AsyncThunkPayloadCreator<
                ThunkArg,
                Returned,
                Omit<AsyncThunkConfig, "rejectValue"> & {
                    rejectValue: unknown extends SpecificAsyncThunkConfig["rejectValue"]
                        ? unknown extends AsyncThunkConfig["rejectValue"]
                            ? Error
                            : AsyncThunkConfig["rejectValue"]
                        : SpecificAsyncThunkConfig["rejectValue"];
                } & {
                    serializedErrorType: unknown extends SpecificAsyncThunkConfig["serializedErrorType"]
                        ? AsyncThunkConfig["serializedErrorType"]
                        : SpecificAsyncThunkConfig["serializedErrorType"];
                } & {
                    pendingMeta: unknown extends SpecificAsyncThunkConfig["pendingMeta"]
                        ? AsyncThunkConfig["pendingMeta"]
                        : SpecificAsyncThunkConfig["pendingMeta"];
                } & {
                    fulfilledMeta: unknown extends SpecificAsyncThunkConfig["fulfilledMeta"]
                        ? AsyncThunkConfig["fulfilledMeta"]
                        : SpecificAsyncThunkConfig["fulfilledMeta"];
                } & {
                    rejectedMeta: unknown extends SpecificAsyncThunkConfig["rejectedMeta"]
                        ? AsyncThunkConfig["rejectedMeta"]
                        : SpecificAsyncThunkConfig["rejectedMeta"];
                }
            >,
        ): Record<ThunkName, AsyncThunk<Returned, ThunkArg, AsyncThunkConfig>> {
            const thunkName = typePrefix.split("/").reverse()[0];

            return { [thunkName]: createAsyncThunk_base(typePrefix, payloadCreator) } as any;
        };
    }

    return { createAsyncThunk };
}

/*
export type AsyncThunkConfig = {
	state: { myStateProp: string; };
	extra: {
		counterApi: { fetchCount: (amount: number) => Promise<{ data: number }> };
	};
	//By default we expect rejected value is error
	rejectValue: Error;
};

const { createAsyncThunk } = createAsyncThunkFactory<AsyncThunkConfig>();

export const { incrementAsync } = createAsyncThunk<{ rejectValue: number; }>()(
	`xxx/incrementAsync`,
	async (amount: number, { extra, getState, rejectWithValue }) => {

		const { myStateProp } = getState();


		const { data } = await extra.counterApi.fetchCount(amount);

		return data;
	},
);
*/
