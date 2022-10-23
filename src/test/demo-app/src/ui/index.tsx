

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CoreProvider } from "ui/coreApi/CoreProvider";
import { App } from "./App";
import { assert } from "tsafe/assert";

createRoot(
    (() => {
        const rootElement = document.getElementById("root");

        assert(rootElement !== null);

        return rootElement;

    })()
)
    .render(
        <StrictMode>
            <CoreProvider>
                <App />
            </CoreProvider>
        </StrictMode>
    );