# 📟 Terminal Web

## 📖 Introduction

This React component will generate a CLI with custom shell commands

### Terminal Features

- 🧰 Custom commands
- 🎮 Interactive shell
- 📝 Command autocompletion
- 🎨 Colors
- ⌨ Typing effects
- 📜 Commands history
- 🏹 Keybinds
- 📱 Responsive design

### Code features

- 📔 Documented components
- ♻ Reusable code
- 🧪 Tested code (test files included)


## 📥 How to implement?

The component will fit the parent container so it can be used as a full screen component or within a secondary container of some other main structure

### Import component
```js
// Importing the component from a relative path (yours may be slightly different)
import TerminalWeb from "./components/terminal_web/terminal_web"
```
### Component setup
```js
// Prompt prefix
const prefix = "Type your commands here >>> "
// Message displayed from the beginning
const initialMessage = "This message will be printed at the first load of the terminal"
// Commands and their output
const commands = {
  hello: "Hello World!!!"  // This string will be printed when the `hello` command is typed
  hello2: ["Hello world", "My name is Tom", "Goodbye..."]  // This command print the array strings in different lines
  helloTo: (pipes, l) => pipes.stdin(`Hello ${l[0]} from ${l[1]}`),  // The command `helloTo Tommy England` will print "Hello Tommy from England"
  "run myGame": MyGameComponent  // This command will render in fullscreen the React component provided here
}
```
### Component render
```html
<div className={scss.wrapper}>
  <TerminalWeb prefix={prefix} initialMessage={initialMessage} commands={commands} />
</div>
```

## 🕷 Known bugs

> If you discover some bug that is not included in this list, please contact me or make a **pull request**

1. Output text is not selectable
2. Async line component wont work with nested JSX tags