import { getAutoDispatchThunks, selectors } from "lib";
import type { Dispatch, State } from "lib";
import { useDispatch, useSelector as reactRedux_useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export { selectors };

export const useSelector: TypedUseSelectorHook<State> = reactRedux_useSelector;

export function useThunks() {
    const dispatch = useDispatch<Dispatch>();

    return getAutoDispatchThunks(dispatch);
}
