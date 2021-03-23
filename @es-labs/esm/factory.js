function greeterFactory(greeting = "Hello") {
  return {
    greet: () => console.log(`${greeting}!`)
  }
}

export default greeterFactory