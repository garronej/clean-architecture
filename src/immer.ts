// Just some utility types not directly used but exported since immer is
// not directly accessible by the user of the library.

import type { Draft } from "immer";

export { Draft };

export type WritableDraft<T> = {
    -readonly [K in keyof T]: Draft<T[K]>;
};
