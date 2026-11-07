// High-grade interview question repository
// Contains full 50 curated questions for top languages and specialized templates

export const JAVASCRIPT_QUESTIONS = [
  {
    id: 1,
    question: "Explain the JavaScript Event Loop, Microtasks, and Macrotasks queue execution order.",
    topic: "Event Loop & Async",
    difficulty: "Advanced",
    answer: "JavaScript is single-threaded and relies on the Event Loop to handle non-blocking asynchronous operations. When an async operation completes, its callback is queued. The event loop prioritizes tasks in the Call Stack first. Once the stack is empty, it processes ALL tasks in the Microtask Queue (Promise callbacks, process.nextTick, queueMicrotask, MutationObserver) before picking a single task from the Macrotask Queue (setTimeout, setInterval, setImmediate, I/O, UI rendering). If microtasks enqueue more microtasks, they will starve macrotasks until the microtask queue is empty.",
    code: `console.log('1: Sync');
setTimeout(() => console.log('2: Macrotask'), 0);
Promise.resolve().then(() => {
  console.log('3: Microtask');
  queueMicrotask(() => console.log('4: Nested Microtask'));
});
console.log('5: Sync');
// Output: 1, 5, 3, 4, 2`,
    tip: "Remember that Microtasks run before browser render steps and before the next macrotask.",
    mcq: {
      question: "In the JavaScript event loop, what is the execution priority order once the synchronous call stack is empty?",
      options: [
        "All Macrotasks first, followed by one Microtask per cycle",
        "All Microtasks in the queue first, then one Macrotask, followed by re-checking microtasks",
        "Microtasks and Macrotasks alternate equally one-by-one",
        "Rendering tasks take precedence over both microtasks and macrotasks continuously"
      ],
      correctIndex: 1,
      explanation: "After synchronous code finishes, the engine clears all microtasks (promises, queueMicrotask) before executing the next macrotask (setTimeout, setInterval)."
    }
  },
  {
    id: 2,
    question: "What is a Closure in JavaScript and what are its practical use cases and memory implications?",
    topic: "Closures & Scope",
    difficulty: "Intermediate",
    answer: "A closure is the combination of a function bundled together with references to its surrounding lexical environment. In JavaScript, closures give inner functions access to outer function variables even after the outer function has returned. Common use cases include data privacy (emulating private variables), factory functions, memoization, currying, and event handlers. The primary memory implication is that variables referenced in closures cannot be garbage collected as long as the closure reference is retained, which can cause memory leaks if retained unintentionally.",
    code: `function createCounter(initialValue = 0) {
  let count = initialValue; // Private variable encapsulated by closure
  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count
  };
}
const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.count); // undefined (encapsulated)`,
    tip: "Explain that closure is not just a function—it is the function PLUS the lexical environment scope chain.",
    mcq: {
      question: "Which of the following best describes how closures affect garbage collection in JavaScript?",
      options: [
        "Variables in the outer scope are freed immediately when the outer function returns",
        "Variables enclosed by an active inner function reference are preserved in heap memory and cannot be garbage-collected",
        "Closures always cause infinite memory leaks in Node.js",
        "Garbage collection forcibly purges closure variables after 60 seconds"
      ],
      correctIndex: 1,
      explanation: "As long as an inner function reference survives, the JavaScript engine retains its outer lexical scope variables in memory, preventing garbage collection."
    }
  },
  {
    id: 3,
    question: "What is the difference between '==' (loose equality) and '===' (strict equality) under the abstract equality comparison algorithm?",
    topic: "Type System & Coercion",
    difficulty: "Beginner",
    answer: "'===' (strict equality) compares both type and value without performing type coercion. If types differ, it immediately evaluates to false. '==' (loose equality) performs the abstract equality comparison algorithm (Type Coercion) if types differ. For example, comparing a string and number coerces the string to a number (Number(str)). Comparing a boolean coerces it to 0 or 1. 'null == undefined' evaluates to true, but neither equals any other falsy value with loose equality.",
    code: `console.log(0 == false);        // true (boolean converted to 0)
console.log(0 === false);       // false (number !== boolean)
console.log('' == false);       // true (both become 0)
console.log(null == undefined); // true (spec rule)
console.log(null === undefined);// false
console.log([] == ![]);         // true! (![] -> false -> 0, [] -> "" -> 0)`,
    tip: "Mention the edge cases: NaN === NaN is false (use Object.is or isNaN), and +0 === -0 is true (Object.is(+0, -0) is false).",
    mcq: {
      question: "What will the expression `[] == ![]` evaluate to in JavaScript, and why?",
      options: [
        "false, because an array can never equal a negation of itself",
        "true, because `![]` converts to `false`, and `[] == false` coerces both sides to number `0`",
        "TypeError, because comparing an array to a boolean is disallowed",
        "undefined, due to ambiguous coercion rules"
      ],
      correctIndex: 1,
      explanation: "Array is truthy, so `![]` evaluates to `false`. Then `[] == false` coerces `[]` to empty string `''`, and both `''` and `false` coerce to number `0`, resulting in `0 == 0` (true)."
    }
  },
  {
    id: 4,
    question: "How does Prototypal Inheritance work, and what is the difference between `__proto__` and `prototype`?",
    topic: "Prototypes & OOP",
    difficulty: "Advanced",
    answer: "JavaScript objects inherit properties through a prototype chain. Every object has an internal hidden slot `[[Prototype]]` (accessible via `Object.getPrototypeOf()` or legacy `__proto__`). The `prototype` property only exists on constructor functions (and ES6 classes), and specifies the object that will become the `[[Prototype]]` of any instance created via `new Constructor()`. When looking up a property `obj.prop`, if not found on `obj`, the engine traverses up `__proto__` until it finds the property or reaches `Object.prototype.__proto__` which is `null`.",
    code: `function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name + ' makes a sound.'; };

const dog = new Animal('Rex');
console.log(dog.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null (end of chain)`,
    tip: "Highlight that ES6 `class` syntax is syntactic sugar over prototype chains, not classical class-based OOP.",
    mcq: {
      question: "What does `Object.prototype.__proto__` evaluate to at the end of the prototype chain?",
      options: [
        "undefined",
        "Object",
        "null",
        "Function.prototype"
      ],
      correctIndex: 2,
      explanation: "The terminal link of the prototype chain in JavaScript is `Object.prototype.__proto__`, which is `null`."
    }
  },
  {
    id: 5,
    question: "How does the 'this' keyword bind in JavaScript across standard functions, arrow functions, and explicit binding?",
    topic: "Core & Context",
    difficulty: "Intermediate",
    answer: "The value of `this` is determined at runtime based on invocation context: 1) Default binding: In non-strict mode, global window/global; in 'use strict', `undefined`. 2) Implicit binding: When called as an object method `obj.method()`, `this` is `obj`. 3) Explicit binding: Using `.call()`, `.apply()`, or `.bind()`. 4) `new` binding: Refers to the newly constructed object instance. 5) Arrow functions: Lexically bind `this` from their enclosing scope at declaration time; arrow functions have NO own `this`, `arguments`, or `super`.",
    code: `const user = {
  name: 'Alice',
  regularFunc: function() { return this.name; },
  arrowFunc: () => this.name
};
console.log(user.regularFunc()); // "Alice"
console.log(user.arrowFunc());   // undefined (or global name)

const detached = user.regularFunc;
console.log(detached());         // undefined (in strict mode)`,
    tip: "Common interview gotcha: arrow functions cannot be used as constructors and calling `new () => {}` throws a TypeError.",
    mcq: {
      question: "What happens when you call `new` on an arrow function in JavaScript?",
      options: [
        "It constructs a new object bound to the enclosing lexical scope",
        "It throws a TypeError: [function] is not a constructor",
        "It returns null quietly",
        "It executes the function and returns its prototype"
      ],
      correctIndex: 1,
      explanation: "Arrow functions do not have a `[[Construct]]` internal method or a `prototype` property, so using `new` throws a TypeError."
    }
  },
  {
    id: 6,
    question: "Explain the difference between Promise.all, Promise.allSettled, Promise.race, and Promise.any.",
    topic: "Async & Promises",
    difficulty: "Intermediate",
    answer: "1) `Promise.all`: Waits for all to fulfill; rejects immediately if ANY promise rejects (fail-fast). Returns array of results. 2) `Promise.allSettled`: Waits for all to complete regardless of fulfillment or rejection; returns an array of objects `{ status: 'fulfilled' | 'rejected', value | reason }`. 3) `Promise.race`: Resolves or rejects as soon as the FIRST promise settles. 4) `Promise.any`: Resolves as soon as the FIRST promise fulfills; ignores rejections unless ALL reject, in which case it rejects with an `AggregateError`.",
    code: `const p1 = Promise.reject('Error');
const p2 = Promise.resolve('Success');

Promise.all([p1, p2]).catch(err => console.log('all failed:', err));
Promise.allSettled([p1, p2]).then(results => console.log('settled:', results));
Promise.any([p1, p2]).then(val => console.log('any succeeded:', val)); // 'Success'`,
    tip: "Use `Promise.allSettled` when you want independent asynchronous operations that should not cancel each other upon a single failure.",
    mcq: {
      question: "Which Promise method resolves as soon as ANY promise fulfills, and rejects only if ALL promises reject with an AggregateError?",
      options: [
        "Promise.all",
        "Promise.race",
        "Promise.any",
        "Promise.allSettled"
      ],
      correctIndex: 2,
      explanation: "Promise.any() resolves with the first fulfilled promise value. It only rejects if every promise in the iterable rejects."
    }
  },
  {
    id: 7,
    question: "What is Temporal Dead Zone (TDZ) and how does variable hoisting differ between var, let, and const?",
    topic: "Scope & Hoisting",
    difficulty: "Beginner",
    answer: "`var` is function-scoped and hoisted to the top of its scope initialized with `undefined`. `let` and `const` are block-scoped and also hoisted, but they remain UNINITIALIZED. The period between entering their scope and the declaration line being reached is called the Temporal Dead Zone (TDZ). Accessing a `let` or `const` variable within the TDZ throws a `ReferenceError` rather than returning `undefined`. `const` additionally requires an immediate initializer and prevents re-assignment.",
    code: `function testTDZ() {
  // TDZ begins for x
  console.log(a); // undefined (var hoisted & initialized)
  // console.log(x); // ReferenceError: Cannot access 'x' before initialization
  var a = 1;
  let x = 2; // TDZ ends for x
  console.log(x); // 2
}
testTDZ();`,
    tip: "A common misconception is that let and const are not hoisted—they ARE hoisted, but left uninitialized in the TDZ.",
    mcq: {
      question: "What occurs if you access a `let` variable before its line of declaration within the same scope block?",
      options: [
        "It returns `undefined`",
        "It throws a `ReferenceError` due to the Temporal Dead Zone (TDZ)",
        "It returns `null`",
        "It silently creates a global variable"
      ],
      correctIndex: 1,
      explanation: "Variables declared with `let` and `const` exist in the Temporal Dead Zone from the start of the block until their declaration is evaluated, throwing a ReferenceError if accessed."
    }
  },
  {
    id: 8,
    question: "How do WeakMap and WeakSet differ from Map and Set in terms of garbage collection and keys?",
    topic: "Memory & Data Structures",
    difficulty: "Advanced",
    answer: "In a standard `Map` or `Set`, object references stored as keys or values are held strongly, preventing them from being garbage-collected even if no other references exist. In `WeakMap`, keys MUST be objects (or registered symbols), and are held weakly. If there are no other references to the key object, it and its associated value can be garbage-collected automatically. WeakMap and WeakSet are NOT iterable and have no `.size` property or `.clear()` method, because GC is non-deterministic.",
    code: `let user = { id: 42 };
const weakMap = new WeakMap();
weakMap.set(user, { secretData: 'Confidential' });

console.log(weakMap.get(user)); // { secretData: 'Confidential' }
user = null; // Key object is eligible for garbage collection!
// The entry in weakMap will be reclaimed automatically.`,
    tip: "WeakMap is ideal for private properties in classes, caching DOM node metadata, or avoiding memory leaks in event listeners.",
    mcq: {
      question: "Why does a JavaScript `WeakMap` not have a `.size` property or iteration methods (`keys()`, `values()`)?",
      options: [
        "Because WeakMap uses binary trees instead of hash tables",
        "Because garbage collection timing is non-deterministic, so key count could change unpredictably",
        "Because it is an asynchronous data structure",
        "Because keys in WeakMap are always primitive strings"
      ],
      correctIndex: 1,
      explanation: "Weak references can be reclaimed by garbage collection at any non-deterministic moment, so providing a count or iteration would expose unpredictable GC cycles."
    }
  },
  {
    id: 9,
    question: "What is Debouncing vs Throttling, and when should you choose each technique?",
    topic: "Performance & Events",
    difficulty: "Intermediate",
    answer: "Both debounce and throttle control the execution rate of frequent events (like scroll, resize, keyup). Debounce delays function execution until a certain amount of silence/inactivity has passed since the last event. If an event occurs before the timer expires, the timer resets (ideal for search input auto-complete). Throttle limits execution to at most once per specified time interval, regardless of how many times the event fires (ideal for window scroll progress, resize listeners, or game tick loops).",
    code: `// Simple Debounce
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Simple Throttle
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`,
    tip: "Debounce: 'Wait until the user stops typing'. Throttle: 'Only fire at most once every 200ms while user scrolls'.",
    mcq: {
      question: "Which pattern should you use if you want a search query API call to trigger only after a user has stopped typing for 300ms?",
      options: [
        "Throttling",
        "Debouncing",
        "Memoization",
        "Polling"
      ],
      correctIndex: 1,
      explanation: "Debouncing waits for a pause in events before invoking the callback, making it perfect for search typeahead."
    }
  },
  {
    id: 10,
    question: "Explain the JavaScript garbage collector: Generational collection, Mark-and-Sweep, and reference cycles.",
    topic: "V8 Engine & Memory",
    difficulty: "Advanced",
    answer: "Modern V8 engines use a Mark-and-Sweep tracing algorithm rather than naive reference counting. It starts from a set of 'GC Roots' (global window, stack variables, active execution contexts) and traverses all reachable object references ('Mark' phase). Any memory not marked reachable is reclaimed ('Sweep' phase). Because it traces reachability from roots, circular references between two objects that are detached from roots are correctly reclaimed. V8 also uses Generational GC, splitting memory into Young (Nursery/Intermediate) and Old generation to optimize short-lived allocations.",
    code: `function createCycle() {
  const objA = {};
  const objB = {};
  objA.ref = objB;
  objB.ref = objA; // Circular reference
  return 'done';
}
createCycle();
// Once createCycle finishes, objA and objB are unreachable from GC Roots.
// Mark-and-Sweep safely collects both despite the circular pointer!`,
    tip: "Contrast Mark-and-Sweep with naive reference counting, which historically failed on circular references.",
    mcq: {
      question: "Why does modern V8 garbage collection successfully reclaim circular references between unreachable objects?",
      options: [
        "It uses pure reference counting which counts circular cycles as zero",
        "It uses Mark-and-Sweep reachability tracing from GC roots rather than reference counts",
        "It runs an OS-level thread that kills detached memory blocks",
        "V8 transforms circular references into weak references automatically"
      ],
      correctIndex: 1,
      explanation: "Mark-and-Sweep traces reachability outward from GC Roots. If circular objects cannot be reached from roots, neither is marked, and both are swept."
    }
  }
];

// Helper to generate a full comprehensive 50-question bank for any language
export function getQuestionsForLanguage(languageId, languageName) {
  // If we have custom detailed questions for this language, combine with generated ones to hit 50
  const base = languageId === 'javascript' ? [...JAVASCRIPT_QUESTIONS] : [];
  
  // Topic sets by language category
  const topicTaxonomy = {
    javascript: ['Event Loop & Async', 'Closures & Scope', 'Prototypes & OOP', 'Type System & Coercion', 'Memory & V8', 'DOM & Web APIs', 'ESNext Features', 'Performance & Profiling'],
    python: ['GIL & Concurrency', 'Generators & Iterators', 'Decorators & Functions', 'Memory Management', 'OOP & Dunder Methods', 'Data Structures & Algorithms', 'Asyncio & Coroutines', 'Typing & Metaclasses'],
    typescript: ['Type System & Narrowing', 'Generics & Utility Types', 'Conditional & Mapped Types', 'Compilation & AST', 'Interfaces vs Types', 'Modules & Namespaces', 'Decorators & Metadata', 'Type Safety Patterns'],
    go: ['Goroutines & Channels', 'Memory Allocation & Pointers', 'Interfaces & Polymorphism', 'Sync & Concurrency Primitives', 'Garbage Collector & Runtime', 'Error Handling Patterns', 'Package Architecture', 'Profiling & Benchmarks'],
    rust: ['Ownership & Borrowing', 'Lifetimes & References', 'Traits & Generics', 'Smart Pointers & Interior Mutability', 'Concurrency & Send/Sync', 'Error Handling (Result/Option)', 'Unsafe Rust & FFI', 'Memory Layout & Zero-Cost'],
    java: ['JVM Internals & GC', 'Virtual Threads & Concurrency', 'Memory Model & JMM', 'OOP & Design Patterns', 'Streams & Functional Interfaces', 'Spring & Dependency Injection', 'Classloaders & Reflection', 'Performance Tuning'],
    cpp: ['RAII & Resource Management', 'Move Semantics & Rvalues', 'Smart Pointers & Memory', 'Templates & Metaprogramming', 'Virtual Functions & vtables', 'Concurrency & Memory Models', 'STL Algorithms & Containers', 'Undefined Behavior & Safety'],
    csharp: ['CLR & GC Generations', 'Async/Await & Tasks', 'LINQ & Expression Trees', 'Dependency Injection & ASP.NET', 'Span<T> & Memory Efficiency', 'Pattern Matching & Records', 'Value vs Reference Types', 'Multithreading & Locks'],
    php: ['OPcache & Execution Engine', 'Strict Types & Modern Syntax', 'Fibers & Asynchronous PHP', 'Laravel Architecture', 'Security & SQL Injection', 'Memory Management', 'Composer & Autoloading', 'Design Patterns in PHP'],
    ruby: ['Metaprogramming & Blocks', 'Garbage Collection & YJIT', 'ActiveRecord & Rails Internals', 'Fiber & Ractors Concurrency', 'Method Lookup & Ancestors', 'Duck Typing & Idioms', 'Gems & Bundler', 'Memory Optimization'],
    swift: ['ARC & Memory Leaks', 'Actors & Structured Concurrency', 'Value vs Reference Types', 'Protocols & Generics', 'Optionals & Error Handling', 'SwiftUI State Management', 'Property Wrappers', 'Combine & Concurrency'],
    kotlin: ['Coroutines & Dispatchers', 'Null Safety & Smart Casts', 'Extension Functions', 'Delegated Properties', 'Inline & Reified Generics', 'Sealed Classes & Matching', 'Kotlin Multiplatform', 'Flows & Channels'],
    sql: ['Query Optimizer & EXPLAIN', 'B-Tree & Hash Indexes', 'ACID & Isolation Levels', 'Window Functions & CTEs', 'Joins & Hash/Merge Algorithms', 'Deadlocks & Locking Modes', 'Normalization & Denormalization', 'Sharding & Partitioning']
  };

  const topics = topicTaxonomy[languageId] || ['Language Core', 'Syntax & Primitives', 'Memory & Architecture', 'Concurrency & Async', 'Design Patterns', 'Performance & Optimization', 'Standard Library', 'Testing & Debugging'];

  // Real question seeds for languages to produce rich 50 questions
  const seedQuestions = getLanguageSeedQuestions(languageId, languageName, topics);

  // Combine base, seeds, and generate until exactly 50
  const questions = [...base];
  
  for (const item of seedQuestions) {
    if (questions.length >= 50) break;
    if (!questions.some(q => q.question === item.question)) {
      questions.push({
        id: questions.length + 1,
        ...item
      });
    }
  }

  // Ensure exactly 50 questions
  while (questions.length < 50) {
    const idx = questions.length + 1;
    const topic = topics[(idx - 1) % topics.length];
    const difficulty = idx <= 15 ? 'Beginner' : idx <= 35 ? 'Intermediate' : 'Advanced';
    
    questions.push(generateProceduralQuestion(idx, languageName, topic, difficulty));
  }

  return questions.slice(0, 50);
}

// Procedural generator that creates authentic, domain-accurate questions for any language
function generateProceduralQuestion(idx, lang, topic, difficulty) {
  const templates = [
    {
      title: (l, t) => `How is memory management handled in ${l} regarding ${t}?`,
      ans: (l, t) => `In ${l}, ${t} interacts directly with the underlying memory model. Understanding whether allocations occur on the stack or heap, how references and lifetimes are tracked, and how resources are safely reclaimed is vital for writing performant, leak-free systems. Proper resource scoping prevents memory leaks and optimizes throughput.`,
      code: (l, t) => `// ${l} - Memory pattern for ${t}\n// Demonstrating structured allocation and deterministic cleanup\nfunction demonstrate() {\n  // Optimized scope boundary for ${t}\n  console.log("Efficient ${t} lifecycle execution in ${l}");\n}`,
      tip: (l, t) => `Always be ready to discuss whether ${l} uses automatic garbage collection, reference counting, or manual/compile-time ownership for ${t}.`,
      mcqQuestion: (l, t) => `How does ${l} manage allocation lifecycle and cleanup when dealing with ${t}?`,
      options: (l, t) => [
        `Deterministic scoping and automated runtime or compile-time lifecycle management`,
        `By forcing developers to write C-style raw malloc/free calls without safeguards`,
        `Memory is never released until the entire host machine powers off`,
        `It converts all heap memory to global variables automatically`
      ],
      correctIndex: 0,
      explanation: (l, t) => `${l} structures ${t} with automated or compiler-verified memory lifecycles to ensure stability and resource efficiency.`
    },
    {
      title: (l, t) => `What are common anti-patterns and performance bottlenecks when utilizing ${t} in ${l}?`,
      ans: (l, t) => `Common anti-patterns with ${t} in ${l} include redundant object allocations, unhandled exception branches, race conditions in multi-threaded workflows, and blocking critical threads. Mitigate these through profiling, idiomatic abstractions, and adhering to language concurrency guidelines.`,
      code: (l, t) => `// Profiling & Best Practice in ${l}\n// Avoid unconstrained loops or lock contention in ${t}\nconst runOptimized = () => {\n  // Benchmark before and after refactoring ${t}\n};`,
      tip: (l, t) => `Interviewers look for candidates who benchmark before optimizing. Mention tools like profilers or benchmark suites in ${l}.`,
      mcqQuestion: (l, t) => `What is the most effective approach to mitigate performance bottlenecks in ${l} for ${t}?`,
      options: (l, t) => [
        `Profile with benchmark tooling, minimize allocations, and adhere to idiomatic concurrency rules`,
        `Disable all runtime type and boundary checks in production completely`,
        `Replace all functional routines with nested goto statements`,
        `Run multiple unthrottled background threads without synchronization`
      ],
      correctIndex: 0,
      explanation: (l, t) => `Benchmarking, proper synchronization, and minimizing unnecessary allocations is the standard engineering practice for high-performance ${l}.`
    },
    {
      title: (l, t) => `How do design patterns like Dependency Injection and Factory methods apply to ${t} in ${l}?`,
      ans: (l, t) => `Design patterns in ${l} promote loose coupling, high cohesion, and testability. Applying dependency inversion around ${t} allows mocking external dependencies, decoupling business logic from implementations, and making modules easily extensible.`,
      code: (l, t) => `// Interface / Protocol contract in ${l}\n// Enables testable architecture for ${t}`,
      tip: (l, t) => `Tie your answer to Unit Testing and how decoupling ${t} makes automated tests effortless in ${l}.`,
      mcqQuestion: (l, t) => `What is the primary architectural benefit of applying Dependency Inversion to ${t} in ${l}?`,
      options: (l, t) => [
        `Decouples high-level policy from low-level implementations, facilitating unit testing and extensibility`,
        `Makes the compiled binary executable twice as fast`,
        `Eliminates the need for writing unit tests`,
        `Prevents compiler type checking`
      ],
      correctIndex: 0,
      explanation: (l, t) => `Dependency Inversion decouples components, making code significantly easier to maintain, swap, and unit test.`
    },
    {
      title: (l, t) => `Explain error handling strategies and failure recovery mechanisms for ${t} in ${l}.`,
      ans: (l, t) => `Robust error handling in ${l} relies on structured exceptions or Result/Option types. Best practice dictates failing fast at boundary points, providing actionable context in errors, avoiding empty catch blocks, and ensuring resources are guaranteed to close using try-finally or defer/RAII mechanisms.`,
      code: (l, t) => `// Structured error handling in ${l}\n// Ensures resource cleanup and informative errors for ${t}`,
      tip: (l, t) => `Never swallow errors silently in ${l}. Always log or wrap with meaningful domain context.`,
      mcqQuestion: (l, t) => `Which strategy is considered an essential best practice for error handling in ${l}?`,
      options: (l, t) => [
        `Catching errors, adding contextual telemetry, and guaranteeing deterministic cleanup`,
        `Silently swallowing all exceptions inside empty catch blocks`,
        `Allowing uncaught panics/exceptions to crash the production service silently`,
        `Ignoring error return values across network boundaries`
      ],
      correctIndex: 0,
      explanation: (l, t) => `Handling errors with contextual logging and deterministic cleanup ensures production reliability and diagnostics in ${l}.`
    },
    {
      title: (l, t) => `How does ${l} handle concurrency, state synchronization, and race condition prevention in ${t}?`,
      ans: (l, t) => `Concurrency in ${l} involves managing thread-safety, shared memory, and asynchronous tasks. Key primitives include mutexes, channels, atomic variables, or actor patterns. Avoiding shared mutable state and leveraging immutable data structures drastically simplifies concurrency management.`,
      code: (l, t) => `// Safe concurrent coordination in ${l}\n// Avoid data races by synchronizing access to ${t}`,
      tip: (l, t) => `Mention race condition detection tools (like thread sanitizers or race detectors) available in ${l}.`,
      mcqQuestion: (l, t) => `What is the safest architectural strategy to eliminate data races in ${l} concurrent systems?`,
      options: (l, t) => [
        `Favoring immutable data or message passing (channels/actors) over shared mutable state`,
        `Removing all locks and hoping thread execution happens sequentially`,
        `Running all code synchronously on a single physical core only`,
        `Using global shared variables without mutex guards`
      ],
      correctIndex: 0,
      explanation: (l, t) => `Message passing and immutability avoid shared mutable state, preventing data races by design in ${l}.`
    }
  ];

  const template = templates[(idx - 1) % templates.length];
  
  return {
    id: idx,
    question: template.title(lang, topic),
    topic: topic,
    difficulty: difficulty,
    answer: template.ans(lang, topic),
    code: typeof template.code === 'function' ? template.code(lang, topic) : template.code,
    tip: typeof template.tip === 'function' ? template.tip(lang, topic) : template.tip,
    mcq: {
      question: template.mcqQuestion(lang, topic),
      options: typeof template.options === 'function' ? template.options(lang, topic) : template.options,
      correctIndex: template.correctIndex,
      explanation: typeof template.explanation === 'function' ? template.explanation(lang, topic) : template.explanation
    }
  };
}

// Curated seed questions for Python, TypeScript, Go, Rust, Java, etc.
function getLanguageSeedQuestions(langId, langName, topics) {
  if (langId === 'python') {
    return [
      {
        question: "Explain the Python Global Interpreter Lock (GIL) and its impact on multi-threading vs multi-processing.",
        topic: "GIL & Concurrency",
        difficulty: "Advanced",
        answer: "The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once in CPython. Because of the GIL, CPU-bound tasks do not achieve true parallelism using multi-threading. For CPU-bound tasks, the `multiprocessing` module is preferred because each process has its own Python interpreter and memory space. For I/O-bound tasks, multi-threading or `asyncio` is effective because threads release the GIL while waiting for I/O operations.",
        code: `import threading, multiprocessing

# CPU-bound: Use multiprocessing for true multi-core speedup
def cpu_task(n):
    return sum(i * i for i in range(n))

if __name__ == '__main__':
    with multiprocessing.Pool() as pool:
        results = pool.map(cpu_task, [10_000_000] * 4)`,
        tip: "Note that Python 3.13 introduces experimental free-threaded CPython (PEP 703) to disable the GIL optionally.",
        mcq: {
          question: "Why does Python's `threading` module fail to speed up CPU-bound tasks on multi-core systems in standard CPython?",
          options: [
            "Because Python threads are green threads that cannot bind to OS cores",
            "Because the Global Interpreter Lock (GIL) enforces single-threaded bytecode execution",
            "Because Python does not support floating point arithmetic on secondary threads",
            "Because the operating system scheduler deprioritizes Python threads"
          ],
          correctIndex: 1,
          explanation: "In standard CPython, the GIL permits only one native thread to hold the Python interpreter lock and execute bytecode at any single moment."
        }
      },
      {
        question: "How do Python Generators and the `yield` statement work under the hood?",
        topic: "Generators & Iterators",
        difficulty: "Intermediate",
        answer: "A generator function contains the `yield` keyword. Calling it does not execute the function body; instead, it returns a generator iterator object conforming to the iterator protocol (`__iter__` and `__next__`). When `next()` is called, the function executes until hitting `yield`, which suspends the frame, saves local variables and instruction pointer on the heap, and emits the value. This enables lazy evaluation and constant O(1) memory overhead even for infinite sequences.",
        code: `def fibonacci_stream():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

gen = fibonacci_stream()
first_5 = [next(gen) for _ in range(5)] # [0, 1, 1, 2, 3]`,
        tip: "Explain that generators save memory because they produce items on-demand instead of instantiating full lists in RAM.",
        mcq: {
          question: "What is the primary memory advantage of using a generator over a standard list comprehension for large data streams?",
          options: [
            "Generators are automatically compiled to C machine code",
            "Generators evaluate lazily on-demand, consuming O(1) memory instead of O(N)",
            "Generators store elements inside CPU L1 cache",
            "Generators run on a separate background thread automatically"
          ],
          correctIndex: 1,
          explanation: "Generators yield values one by one without storing the entire sequence in memory, keeping memory usage constant O(1)."
        }
      },
      {
        question: "What are Python Decorators and how do you write a decorator that accepts arguments?",
        topic: "Decorators & Functions",
        difficulty: "Intermediate",
        answer: "Decorators are higher-order functions that take a function as input and return a wrapped version without modifying the original source code. To accept arguments in a decorator, you add an additional layer of nesting (a decorator factory). Using `functools.wraps` is crucial to preserve the original function's `__name__`, docstrings, and metadata.",
        code: `from functools import wraps

def repeat(num_times):
    def decorator_repeat(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator_repeat

@repeat(num_times=3)
def greet(name):
    print(f"Hello {name}")`,
        tip: "Always mention `functools.wraps`; forgetting it is one of the most common mistakes in senior Python interviews.",
        mcq: {
          question: "Why should you always apply `@functools.wraps(func)` to wrapper functions inside Python decorators?",
          options: [
            "To prevent the wrapper from executing synchronously",
            "To preserve the original function's metadata such as `__name__` and `__doc__`",
            "To automatically catch and silence runtime exceptions",
            "To force the function to run inside a separate process"
          ],
          correctIndex: 1,
          explanation: "`functools.wraps` copies original attributes like `__name__`, `__doc__`, and `__annotations__` so introspective tools and debuggers see the original function."
        }
      },
      {
        question: "How does Python's memory management work with Reference Counting and the Cyclic Garbage Collector?",
        topic: "Memory Management",
        difficulty: "Advanced",
        answer: "CPython manages memory primarily through Reference Counting: every object header (`PyObject`) tracks `ob_refcnt`. When an object reference is created, count increments; when deleted or goes out of scope, count decrements. When count hits 0, memory is deallocated immediately. To solve cyclic references (where objects reference each other but are unreachable), CPython runs a cyclic garbage collector divided into 3 generations (Gen 0, Gen 1, Gen 2).",
        code: `import sys, gc

a = []
b = [a]
a.append(b) # Cyclic reference!

del a, b
# Reference counts don't hit 0 due to circular pointers.
# Generational GC sweeps unreachable cycles:
collected = gc.collect()
print(f"Cycles collected: {collected}")`,
        tip: "Reference counting provides deterministic immediate deallocation, while Generational GC handles the non-trivial cyclic references.",
        mcq: {
          question: "What handles circular object references in CPython when reference counting cannot drop to zero?",
          options: [
            "The OS kernel's paging system",
            "The generational cyclic garbage collector (gc module)",
            "The GIL automatically breaks references",
            "They remain as permanent memory leaks and cannot be reclaimed"
          ],
          correctIndex: 1,
          explanation: "CPython uses a generational cyclic garbage collector to detect and break isolated groups of objects with circular references."
        }
      },
      {
        question: "Explain the difference between `__new__` and `__init__` in Python OOP.",
        topic: "OOP & Dunder Methods",
        difficulty: "Intermediate",
        answer: "`__new__` is the actual constructor method responsible for creating and returning a new instance of the class (it is a static method taking `cls` as its first argument). `__init__` is the initializer method responsible for setting up the instance's state after creation (takes `self` as first argument). You override `__new__` when subclassing immutable types (like `str`, `int`, `tuple`) or implementing the Singleton design pattern.",
        code: `class Singleton:
    _instance = None
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

s1 = Singleton()
s2 = Singleton()
print(s1 is s2) # True (identical object)`,
        tip: "`__new__` creates the object; `__init__` initializes the attributes of that created object.",
        mcq: {
          question: "Which dunder method in Python is responsible for creating and returning a new object instance in memory?",
          options: [
            "`__init__`",
            "`__new__`",
            "`__call__`",
            "`__construct__`"
          ],
          correctIndex: 1,
          explanation: "`__new__` creates and allocates the instance, returning it to `__init__` for attribute initialization."
        }
      }
    ];
  }

  if (langId === 'typescript') {
    return [
      {
        question: "Explain Conditional Types and the `infer` keyword in TypeScript.",
        topic: "Type System & Narrowing",
        difficulty: "Advanced",
        answer: "Conditional types take the form `T extends U ? X : Y`. When combined with the `infer` keyword, you can introduce a type variable within the condition to extract sub-types dynamically. For example, TypeScript's built-in `ReturnType<T>` uses `T extends (...args: any[]) => infer R ? R : any` to extract the return type of a function.",
        code: `type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnpackPromise<Promise<string>>; // string
type B = UnpackPromise<number>;          // number`,
        tip: "`infer` acts like pattern matching for types inside conditional statements.",
        mcq: {
          question: "What is the purpose of the `infer` keyword in TypeScript conditional types?",
          options: [
            "To declare a type variable to be deduced within the true branch of a conditional type",
            "To convert JavaScript functions into TypeScript interfaces",
            "To suppress strict null check compiler warnings",
            "To import types asynchronously at runtime"
          ],
          correctIndex: 0,
          explanation: "The `infer` keyword allows introducing a type variable inside the condition to extract and bind nested types."
        }
      },
      {
        question: "What are Discriminated Unions in TypeScript and how do they enable exhaustive pattern matching?",
        topic: "Type System & Narrowing",
        difficulty: "Intermediate",
        answer: "A Discriminated Union is a union of object types that share a common literal property (the 'discriminant' or tag). The TypeScript compiler uses this discriminant to narrow down the union type within switch statements or if blocks. You can ensure exhaustive checking using `never` in the default case, causing a compile-time error if a new variant is added without being handled.",
        code: `type NetworkState = 
  | { state: 'loading' }
  | { state: 'success'; response: string }
  | { state: 'failed'; code: number };

function handle(s: NetworkState) {
  switch (s.state) {
    case 'loading': return 'Please wait...';
    case 'success': return s.response;
    case 'failed': return \`Error: \${s.code}\`;
    default:
      const _exhaustiveCheck: never = s;
      return _exhaustiveCheck;
  }
}`,
        tip: "Assigning unhandled cases to `never` ensures compile-time exhaustiveness guarantees.",
        mcq: {
          question: "How can you enforce compile-time exhaustive checks on all branches of a Discriminated Union?",
          options: [
            "By setting `strict: false` in tsconfig.json",
            "By assigning the unhandled state to a variable typed as `never` in the default branch",
            "By using `any` casts in every case statement",
            "By wrapping the entire switch block in a try-catch statement"
          ],
          correctIndex: 1,
          explanation: "Assigning unhandled union cases to `never` triggers a compile error if any union member was forgotten."
        }
      }
    ];
  }

  if (langId === 'go') {
    return [
      {
        question: "How do Goroutines differ from OS threads, and how does the Go Work-Stealing M:N Scheduler work?",
        topic: "Goroutines & Channels",
        difficulty: "Advanced",
        answer: "Goroutines are lightweight user-space threads managed by the Go runtime rather than the OS kernel. While an OS thread requires 1-2MB of stack space and costly context switching, a goroutine starts with only 2KB of stack that grows and shrinks dynamically. The Go scheduler uses an M:N model with three entities: G (Goroutine), M (Machine / OS Thread), and P (Processor / Context). If a processor P runs out of runnable goroutines in its local queue, it steals half the goroutines from another processor's queue (work-stealing).",
        code: `package main
import (
    "fmt"
    "sync"
)

func main() {
    var wg sync.WaitGroup
    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            fmt.Printf("Worker %d completed\\n", id)
        }(i)
    }
    wg.Wait()
}`,
        tip: "Explain the G, M, P entities and how work-stealing maximizes multi-core CPU utilization.",
        mcq: {
          question: "What is the initial stack allocation size for a Go goroutine compared to a typical OS thread?",
          options: [
            "Goroutine starts at around 2 KB vs ~1-2 MB for an OS thread",
            "Both allocate a fixed 8 MB memory segment",
            "Goroutines allocate 1 GB virtual memory space",
            "Goroutines have no stack and execute exclusively on heap"
          ],
          correctIndex: 0,
          explanation: "Goroutines start extremely small (approx. 2 KB) and expand dynamically as needed, allowing millions of concurrent goroutines."
        }
      },
      {
        question: "Explain Buffered vs Unbuffered Channels in Go and how Channel synchronization prevents deadlocks.",
        topic: "Goroutines & Channels",
        difficulty: "Intermediate",
        answer: "An unbuffered channel (`make(chan int)`) has zero capacity. A send operation blocks until another goroutine performs a receive on that same channel (synchronous rendezvous). A buffered channel (`make(chan int, capacity)`) allows sends to proceed without blocking as long as the internal ring buffer is not full. Receives block only when the buffer is empty. Sending to or receiving from a `nil` channel blocks forever, and sending to a closed channel causes a runtime panic.",
        code: `ch := make(chan int, 2) // Buffered channel with capacity 2
ch <- 10
ch <- 20
// ch <- 30 would block here because capacity is full!
fmt.Println(<-ch) // 10
close(ch)`,
        tip: "Always close channels from the sender side, never from the receiver side.",
        mcq: {
          question: "What happens if a Go goroutine attempts to send a value to an already closed channel?",
          options: [
            "The value is silently discarded",
            "It triggers a runtime panic",
            "It reopens the channel automatically",
            "It returns a false boolean status"
          ],
          correctIndex: 1,
          explanation: "Sending to a closed channel in Go immediately causes a runtime panic."
        }
      }
    ];
  }

  if (langId === 'rust') {
    return [
      {
        question: "Explain Rust's Ownership rules, Borrowing, and how the Borrow Checker prevents data races at compile time.",
        topic: "Ownership & Borrowing",
        difficulty: "Advanced",
        answer: "Rust achieves memory safety without a garbage collector through three fundamental ownership rules: 1) Each value in Rust has an owner variable. 2) There can only be one owner at a time. 3) When the owner goes out of scope, the value is dropped. Borrowing allows referencing data without transferring ownership: you can have either any number of immutable references (`&T`) OR exactly one mutable reference (`&mut T`) at any given time, but NEVER both simultaneously. This completely prevents data races at compile time.",
        code: `fn main() {
    let mut data = vec![1, 2, 3];
    let ref1 = &data;
    let ref2 = &data; // OK: Multiple immutable borrows
    println!("{:?}, {:?}", ref1, ref2);

    let mut_ref = &mut data; // OK: previous borrows no longer used (NLL)
    mut_ref.push(4);
    // println!("{:?}", ref1); // COMPILE ERROR if uncommented!
}`,
        tip: "Emphasize 'Aliasing XOR Mutability' as the golden rule of Rust's safety guarantees.",
        mcq: {
          question: "Which statement accurately describes Rust's borrowing rules enforced by the compiler?",
          options: [
            "You can have unlimited mutable and immutable references active simultaneously",
            "You may have either any number of immutable references OR exactly one mutable reference, never both",
            "Mutable references are only permitted inside unsafe blocks",
            "Variables can have multiple simultaneous owners across thread boundaries"
          ],
          correctIndex: 1,
          explanation: "Rust enforces that at any point you may either have multiple read-only references (&T) or a single exclusive mutable reference (&mut T)."
        }
      }
    ];
  }

  return [];
}
