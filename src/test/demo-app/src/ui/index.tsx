import { render } from "react-dom";
import { CoreProvider } from "./coreApi/CoreProvider";
import { App } from "./App";

render(
    <CoreProvider>
        <App />
    </CoreProvider>,
    document.getElementById("root"),
);
