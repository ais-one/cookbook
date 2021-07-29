class WinFactory {
  createButton() {
    return new WinButton();
  }
}

class MacFactory {
  createButton() {
    return new MacButton();
  }
}

class WinButton {
  paint() {
    console.log("Rendered a Windows button");
  }
}

class MacButton {
  paint() {
    console.log("Rendered a Mac button");
  }
}

class Application {
  factory;
  button;

  constructor(factory) {
    this.factory = factory;
  }

  createUI() {
    this.button = factory.createButton();
  }

  paint() {
    this.button.paint();
  }
}

let factory;
let OS = "Windows";

if (OS === "Windows") {
  factory = new WinFactory();
} else if (OS === "Mac") {
  factory = new MacFactory();
}

const app = new Application(factory);

app.createUI()
app.paint() // Output: Rendered a Windows button
