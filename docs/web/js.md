## JS Concepts

### Closures
```js
const first = () => {
  const greet = 'Hi'
  const second = () => {
    const name = 'Aa'
    alert(greet)
  }
  return second
}
const func = first()
func() // alert popup Hi
```

### Currying

```js
const curriedMultiply = (a) => (b) => a * b
curriedMultiply(3)(4)
```

### Compose

```js
const compose = (f,g) => (a) => f(g(a))
const inc = num => num + 1
const x2 = num => num * 2
compose(inc, x2)(5) // return value should be (5 * 2) + 1 = 11 
```


### ES2020

```js
// BigInt
1n + 2n // typeof "bigint"

// nullish coalensce ?? (if null or undefined)
aa?.bb.?cc ?? 'is empty string'

const authorName = book?.author?.firstName ?? 'Unknown'
if undefined, then 'Unkonwn'


// optional chaining ?.
aa?.bb?.cc -> undefined

// Promise.allSettled

// globalThis
```

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries


### call / apply / bind...


#### Function.prototype.call()

The method Call invokes the function and allows you to pass in arguments one by one using commas.

```js
let customer1 = { name: 'Leo', email: 'leo@gmail.com' };
let customer2 = { name: 'Nat', email: 'nat@hotmail.com' };

function greeting(text) {
    console.log(`${text} ${this.name}`);
}

greeting.call(customer1, 'Hello'); // Hello Leo
greeting.call(customer2, 'Hello'); // Hello Nat
```

#### Function.prototype.apply()

The method Apply invokes the function and allows you to pass in arguments as an array.

```js
let customer1 = { name: 'Leo', email: 'leo@gmail.com' };
let customer2 = { name: 'Nat', email: 'nat@hotmail.com' };
function greeting(text, text2) {
   console.log(`${text} ${this.name}, ${text2}`);
}
greeting.apply(customer1, ['Hello', 'How are you?']); // output Hello Leo, How are you?
greeting.apply(customer2, ['Hello', 'How are you?']); // output Hello Natm How are you?
```

#### Function.prototype.bind()

The Bind method returns a new function, allowing you to pass in a this array and any number of arguments. Use it when you want that function to later be called with a certain context like events.

```js
let customer1 = { name: 'Leo', email: 'leo@gmail.com' };
let customer2 = { name: 'Nat', email: 'nat@hotmail.com' };
function greeting(text) {
   console.log(`${text} ${this.name}`);
}
let helloLeo = greeting.bind(customer1);
let helloNat = greeting.bind(customer2);
helloLeo('Hello'); // Hello Leo
helloNat('Hello'); // Hello Nat
```


Call and Apply are interchangeable. You can decide whether it’s easier to send in an array or a comma separated list of arguments.

Bind is different. It always returns a new function. We can use Bind to curry functions like in the example. We can take a simple hello function and turn it into a helloJon or helloKelly. You can use it for events where we don’t know when they’ll be fired but know what context is.

### Classes / Prototypes

TBD

## Scope

https://levelup.gitconnected.com/how-does-hoisting-work-in-javascript-es6-b0e06727e071


### Global Scope

```js
let global = 'I see global.'
function scopeFunction(){
    console.log(global);
}

scopeFunction(); // outputs 'I see global.'
```

### Local Scope

```js
function myFunction(){
    var localFunction = 'I see local';
    console.log(localFunction); 
}

myFunction(); // outputs 'I see functional scope'
console.log(localFunction); // Outputs an error 'localFunction is not defined'
```


### Hoisting

```js
var a = 'hi';
function myFunction(){
    console.log(a); // undefined - var/let/const a from below is hoisted up here...
    var a = 'hello';
    console.log(a); // 'hello'
}
myFunction();
```

```js
var a = 'hi';
function myFunction(){
    var a; // the a in the local scope is hoisted here and a is 'undefined
    console.log(a); // outputs 'undefined
    a = 'hello';
    console.log(a); // outputs 'hello'
}
myFunction();
console.log(a); // outputs 'hi'
```


Javascript will hoist var, const, and let variable declarations to the top of its scope. While this is true, const and let will not behave the same as var. var will hoist a declaration and initialize the variable as undefined if the definition is not provided. However, const and let will hoist the variable declaration and not initialize the variable if the definition is not provided

```js
function myFunction(){
    a;
    console.log(a);
    let a = 'hello'; // if var instead of let, we will reach here 
}
myFunction(); 
```

```js
function myFunction(){
    let a; // a's declaration is hoisted here, but remains uninitialized
    a; // Will get a ReferenceError: Cannot access 'a' before initialization
    console.log(a);
    a = 'hello'; // everything above this line of code is referenced as temporal dead zone
}
myFunction(); 
```




### https://medium.com/javascript-in-plain-english/factories-are-still-better-than-classes-in-javascript-47f15071904e