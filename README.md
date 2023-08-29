# 📟 Terminal Web

## 📖 Introduction

This React component will generate a CLI with custom shell commands

### Terminal Features

- 🧰 Custom commands
- 🎮 Interactive shell
- 📝 Command autocompletion
- 🎨 Colors
- ✍🏻 Typing effects
- 📜 Commands history
- 🏹 Keybinds

### Code features

- ♻ Reutilizable code


## 📥 How to implement?

The component will fit the parent container so it can be used as a full screen component or within a secondary container of some other main structure

### Import component
```js
// Importing the component from a relative path (yours may be slightly different)
import TerminalWeb from "./components/terminal_web/terminal_web"
```
### Compoent setup
```js
// Prompt prefix
const prefix = "Type your commands here >>> "
// Mesage displayed from the beggining
const initialMessage = "This message will be printed at the first load of the terminal"
// Commands and their output
const commands = {
  hello: "Hello World!!!"  // This string will be pinted when the `hello` command is typed
  hello2: ["Hello world", "My name is Tom", "Goodbye..."]  // This command print the array strings in different lines
  helloTo: (pipes, l) => pipes.stdin(`Hello ${l[0]} from ${l[1]}`),  // The command `helloTo Tommy England` will print "Hello Tommy from England"
  "run mygame": MyGameComponent  // This command will render in fullscreen the React component provided here
}
```
### Compoent render
```html
<div className={scss.wrapper}>
  <TerminalWeb prefix={prefix} initialMessage={initialMessage} commands={commands} />
</div>
```


