import { Provider as StoreProvider } from "react-redux";
import { createStore } from "lib";
import { useAsync } from "react-async-hook";

export const LibProvider = () => {
    return <StoreProvider></StoreProvider>;
};
