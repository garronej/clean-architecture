<p align="center">
    <img src="https://user-images.githubusercontent.com/6702424/80216211-00ef5280-863e-11ea-81de-59f3a3d4b8e4.png">  
</p>
<p align="center">
    <i>Toolkit for implementing <b>clean architecture</b> using <b>Redux</b></i>
    <br/>
    <i>Focuses on achieving great type inference</i>
    <br/>
    <i>Easy to navigate, easy to maintain</i>
    <br>
    <br>
    <img src="https://github.com/garronej/beyond-redux-toolkit/workflows/ci/badge.svg?branch=main">
    <img src="https://img.shields.io/bundlephobia/minzip/beyond-redux-toolkit">
    <img src="https://img.shields.io/npm/dw/beyond-redux-toolkit">
    <img src="https://img.shields.io/npm/l/beyond-redux-toolkit">
</p>

This repo aims to be a guide on how to implement Clean Architecture using `@redux/toolkit`.  
The NPM library `clean-redux` is a set of utils that you will
need to achieve perfect type inference.
# Install / Import

```bash
$ yarn add beyond-redux-toolkit
```
# Documentation  

To see how the tool is actually meant to be used refer to the 
canonical clean architecture setup located in `src/test/demo-app`.  

- Your app's `src` directory should contain a `lib` dir that
  is the brain of your app and an `app` dir that contains 
  the UI components.
- The `lib` directory should be completely agnostic from the UI 
  framwork in use in the appication. For example, if you are defing a hook somewhere in the `lib` directroy, you are doing it wrong. The `lib` directory must never import anything from the `app` directory. It must be possible to switch from Vue to React
  without changing a single line of code in the `lib` directory.

To understand what the exposed function do in detail, please refer to 
[the compile time unit tests](https://github.com/garronej/redux-clean-archi-toolkit/tree/main/src/test/types) they worth more than a thousand word.

# A production example  


<p align="center">
  <a href="https://github.com/InseeFrLab/onyxia-web">
  <i>Onyxia: A datacience oriented container launcher.<i>
    <img src="https://user-images.githubusercontent.com/6702424/139264787-37efc793-1d55-4fa4-a4a9-782af8357cff.png">
  </a>
</p>
