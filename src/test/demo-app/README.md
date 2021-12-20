# Canonical setup

Don't try to figure out what the App actually accomplishes, it doesn't do anything that makes sense.  
The focus is on the architecture and showing off how types are inferred.

NOTE: Do not forget `"baseUrl": "src"` in `tsconfig.json` to be able to import without using relative path.
E.g. `import { ... } from "lib";`.

-   Your app's `src` directory should contain a `lib` dir that
    is the brain of your app and an `app` dir that contains
    the UI components.
-   The `lib` directory should be completely agnostic from the UI
    framework in use in the application. For example, if you are defining a hook somewhere in the `lib` directory,
    you are doing it wrong. The `lib` directory must never import anything from the `app` directory.
    It must be possible to switch from Vue to React
    without changing a single line of code in the `lib` directory.
-   All the interaction that your app is supposed to make with the outside work should be described, as type only
    in the `src/lib/ports` directory.
    If, for example, your app consumes a REST API, you should create a port called, for example, `MyRestApiClient`.
-   The interfaces defined in `src/lib/ports` should be implemented in the `src/lib/secondaryAdapter` directory.
    Do not hesitate to provide multiple implementations for a single port. It is very useful for example to be able
    to provide a mock adapter for a given port if you wish to be able to run your application in degraded mode.
    For implementing `MyRestApiClient` you would for example create a file called `src/lib/secondaryAdapters/createMyRestApiClient.ts`
    that internally make uses of a library like [`axios`](https://axios-http.com) to make the HTTP requests to your REST API.
-   The `src/lib/usecases` directory should contains the method and states that will be needed to give the App an user interface.
