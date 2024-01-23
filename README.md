<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/151054088-b21c1cd6-912a-4dcf-b54d-af74e8632620.png">  
</p>
<p align="center">
    <i>📐 TypeScript Clean Architecture Framework  📐</i>
    <br>
    <br>
    <a href="https://github.com/garronej/clean-architecture/actions">
      <img src="https://github.com/garronej/clean-architecture/workflows/ci/badge.svg?branch=main">
    </a>
    <a href="https://bundlephobia.com/package/clean-architecture">
      <img src="https://img.shields.io/bundlephobia/minzip/clean-architecture">
    </a>
    <a href="https://github.com/garronej/clean-architecture/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/clean-architecture">
    </a>
</p>

This is a Framework for building web application. It helps you decouple your UI component
and the core logic of your App.  
It can be used both on the frontend and the backend and integrate well with any UI framework
but it's primary use case is for building SPAs (Vite Projects) with React.

-   [Benefits](#benefits)
-   [Install / Import](#install--import)
-   [Examples setups](#examples-setups)
    -   [Example project](#example-project)
    -   [Canonical setup](#canonical-setup)
    -   [Enterprise grade app](#enterprise-grade-app)
-   [Starting the demo app](#starting-the-demo-app)

# Benefits

-   Clean architecture without [the object-orientedness](https://www.youtube.com/watch?v=QM1iUe6IofM).
-   No need to explicitly call `dispatch()` on the UI side.  
    As a matter of fact, Redux being used
    under the hood is an implementation detail that can as well be ignored by the dev working on the UI.
-   Strict isolation between the Core and the UI. Port your web app to React Native or switch to another
    UI framework without having to re-write a single line of the core logic.
-   It's not specifically a React framework, it's not even specifically a frontend framework, it can and is be used on the backend.
-   Names things once, it propagate through all the codebase via [TypeScript's template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html). No more hard to maintain stuttering.  
    Name things once then let intellisense guide you.
-   The core can tell the UI to do thing imperatively. Like "Play a sound now" which is something that
    is impossible to do cleanly with just states. (`isSoundShouldBePlayedNow: boolean` ?)

# Install / Import

```bash
$ yarn add clean-architecture evt
```

# Examples setups

## Example project

<img width="438" alt="image" src="https://github.com/garronej/snake-clean-architecture/assets/6702424/2cd5e5ee-0d5c-443b-95a7-b3c288da1233">

This is a very basic snake game implemented with Vite/TypeScript/React/Clean-Architecture.

[👉 `garronej/snake-clean-architecture`👈 ](https://github.com/garronej/snake-clean-architecture)

## Canonical setup

A canonical setup can be found here: [👉 `src/test/demo-app`👈 ](https://github.com/garronej/clean-architecture/tree/main/src/test/demo-app).

## Enterprise grade app

You can consult the source code of [onyxia-web](https://github.com/InseeFrLab/onyxia-web) to see how `clean-architecture` is used in a real world application.

<p align="center">
  <a href="https://github.com/InseeFrLab/onyxia">
  <i>Onyxia: A data science-oriented container launcher.</i>
    <img src="https://user-images.githubusercontent.com/6702424/231329083-180fe7a2-22a8-470f-910a-ef66300b6f35.png">
  </a>
</p>

# Starting the demo app

```bash
git clone https://github.com/garronej/clean-architecture
cd clean-architecture
yarn
yarn build
yarn start-demo-app
```
