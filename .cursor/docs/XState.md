# How to use XState v5

## XState v4 to v5

### Creating [machines]() and actors

- Use `createMachine()`, not `Machine()`
- Use `createActor()`, not `interpret()`
- Use `machine.provide()`, not `machine.withConfig()`
- Set context with input, not `machine.withContext()`
- Actions ordered by default, predictableActionArguments no longer needed
- The `spawn()` function [has]() been removed
- Use getNextSnapshot(…) instead of machine.transition(…)
- Send events explictly instead of using autoForward
- The `state.toStrings()` method has been removed

##### states

- Use `state.getMeta()` instead of state.meta
- Use state.\_nodes instead of state.configuration
- Read events from inspection API instead of state.events

### Events and transitions

- Implementation functions receive a single argument
- `send()` is removed; use `raise()` or `sendTo()`
- Use `enqueueActions()` instead of `pure()` and `choose()`
- `actor.send()` no longer accepts string types
- `state.can()` no longer accepts string types
- Guarded transitions use guard, not cond
- Use params to pass params to actions & guards
- Use wildcard \*transitions, not strict mode
- Use explicit eventless (always) transitions
- Use reenter: true, not internal: false
- Transitions are internal by default, not external
- Child state nodes are always re-entered
- Use `stateIn()` to validate state transitions, not in
- Use `actor.subscribe()` instead of state.history
- Actions can throw errors without escalate

### Actors

- Use actor logic creators for invoke.src instead of functions
- Use invoke.input instead of invoke.data
- Use output in final states instead of data
- Don't use property mappers in input or output
- Use actors property on options object instead of services
- Use `subscribe()` for changes, not `onTransition()`
- `createActor()` (formerly `interpret()`) accepts a second argument to restore state
- Use `actor.getSnapshot()` to get actor’s state
- Loop over events instead of using `actor.batch()`
- Use snapshot.status === 'done' instead of snapshot.done
- state.nextEvents has been removed

### TypeScript

- Use types instead of schema
- Use types.typegen instead of tsTypes

---

## Cheatsheet

### Creating a state machine

```js
import { assign, createActor, setup } from 'xstate'

const machine = setup({
	/* ... */
}).createMachine({
	context: { count: 0 },
	id: 'toggle',
	initial: 'active',
	states: {
		active: {
			entry: assign({
				count: ({ context }) => context.count + 1,
			}),
			on: {
				toggle: { target: 'inactive' },
			},
		},
		inactive: {
			on: {
				toggle: { target: 'active' },
			},
		},
	},
})

const actor = createActor(machine)
actor.subscribe((snapshot) => {
	console.log(snapshot.value)
})

actor.start()
// logs 'active' with context { count: 1 }

actor.send({ type: 'toggle' })
// logs 'inactive' with context { count: 1 }
actor.send({ type: 'toggle' })
// logs 'active' with context { count: 2 }
actor.send({ type: 'toggle' })
// logs 'inactive' with context { count: 2 }
```

### Creating promise logic

```js
import { createActor, fromPromise } from 'xstate'

const promiseLogic = fromPromise(async () => {
	const response = await fetch('https://dog.ceo/api/breeds/image/random')
	const dog = await response.json()
	return dog
})

const actor = createActor(promiseLogic)

actor.subscribe((snapshot) => {
	console.log(snapshot)
})

actor.start()
// logs: {
//   message: "https://images.dog.ceo/breeds/kuvasz/n02104029_110.jpg",
//   status: "success"
// }
```

### Creating transition logic

A transition function is just like a reducer.

```js
import { createActor, fromTransition } from 'xstate'

const transitionLogic = fromTransition(
	(state, event) => {
		switch (event.type) {
			case 'inc': {
				return {
					...state,
					count: state.count + 1,
				}
			}
			default: {
				return state
			}
		}
	},
	{ count: 0 }, // initial state
)

const actor = createActor(transitionLogic)

actor.subscribe((snapshot) => {
	console.log(snapshot)
})

actor.start()
// logs { count: 0 }

actor.send({ type: 'inc' })
// logs { count: 1 }
actor.send({ type: 'inc' })
// logs { count: 2 }
```

### Creating observable logic

```js
import { interval } from 'rxjs'
import { createActor, fromObservable } from 'xstate'

const observableLogic = fromObservable(() => interval(1000))

const actor = createActor(observableLogic)

actor.subscribe((snapshot) => {
	console.log(snapshot)
})

actor.start()
// logs 0, 1, 2, 3, 4, 5, ...
// every second
```

### Creating callback logic

```js
import { createActor, fromCallback } from 'xstate'

const callbackLogic = fromCallback(({ receive, sendBack }) => {
	const i = setTimeout(() => {
		sendBack({ type: 'timeout' })
	}, 1000)

	receive((event) => {
		if (event.type === 'cancel') {
			console.log('canceled')
			clearTimeout(i)
		}
	})

	return () => {
		clearTimeout(i)
	}
})

const actor = createActor(callbackLogic)

actor.start()

actor.send({ type: 'cancel' })
// logs 'canceled'
```

### Parent states

```js
import { createActor, setup } from 'xstate'

const machine = setup({
	/* ... */
}).createMachine({
	id: 'parent',
	initial: 'active',
	states: {
		active: {
			initial: 'one',
			on: {
				NEXT: { target: 'inactive' },
			},
			states: {
				one: {
					on: {
						NEXT: { target: 'two' },
					},
				},
				two: {},
			},
		},
		inactive: {},
	},
})

const actor = createActor(machine)

actor.subscribe((snapshot) => {
	console.log(snapshot.value)
})

actor.start()
// logs { active: 'one' }

actor.send({ type: 'NEXT' })
// logs { active: 'two' }

actor.send({ type: 'NEXT' })
// logs 'inactive'
```

### Actions

```js
import { setup, createActor } from 'xstate';

const machine = setup({
  actions: {
    activate: () => {/* ... */},
    deactivate: () => {/* ... */},
    notify: (_, params: { message: string }) => {/* ... */},
  }
}).createMachine({
  id: 'toggle',
  initial: 'active',
  states: {
    active: {
      // highlight-next-line
      entry: { type: 'activate' },
      // highlight-next-line
      exit: { type: 'deactivate' },
      on: {
        toggle: {
          target: 'inactive',
          // highlight-next-line
          actions: [{ type: 'notify' }],
        },
      },
    },
    inactive: {
      on: {
        toggle: {
          target: 'active',
          // highlight-start
          actions: [
            // action with params
            {
              type: 'notify',
              params: {
                message: 'Some notification',
              },
            },
          ],
          // highlight-end
        },
      },
    },
  },
});

const actor = createActor(
  machine.provide({
    actions: {
      notify: (_, params) => {
        console.log(params.message ?? 'Default message');
      },
      activate: () => {
        console.log('Activating');
      },
      deactivate: () => {
        console.log('Deactivating');
      },
    },
  }),
);

actor.start();
// logs 'Activating'

actor.send({ type: 'toggle' });
// logs 'Deactivating'
// logs 'Default message'

actor.send({ type: 'toggle' });
// logs 'Some notification'
// logs 'Activating'
```

### Guards

```js
import { createActor, setup } from 'xstate'

const machine = setup({
	// highlight-end
	actions: {
		notifyNotAllowed: () => {
			console.log('Cannot be toggled')
		},
	},
	// highlight-start
	guards: {
		canBeToggled: ({ context }) => context.canActivate,
		isAfterTime: (_, params) => {
			const { time } = params
			const [hour, minute] = time.split(':')
			const now = new Date()
			return now.getHours() > hour && now.getMinutes() > minute
		},
	},
}).createMachine({
	context: {
		canActivate: false,
	},
	id: 'toggle',
	initial: 'active',
	states: {
		active: {
			on: {
				toggle: {
					// Guard with params
					// highlight-next-line
					guard: { params: { time: '16:00' }, type: 'isAfterTime' },
					target: 'inactive',
				},
			},
			// ...
		},
		inactive: {
			on: {
				toggle: [
					{
						// highlight-next-line
						guard: 'canBeToggled',
						target: 'active',
					},
					{
						actions: 'notifyNotAllowed',
					},
				],
			},
		},
	},
})

const actor = createActor(machine)

actor.start()
// logs 'Cannot be toggled'
```

### Invoking actors

```js
import { assign, createActor, fromPromise, setup } from 'xstate'

const loadUserLogic = fromPromise(async () => {
	const response = await fetch('https://jsonplaceholder.typicode.com/users/1')
	const user = await response.json()
	return user
})

const machine = setup({
	// highlight-next-line
	actors: { loadUserLogic },
}).createMachine({
	context: {
		user: undefined,
	},
	id: 'toggle',
	initial: 'loading',
	states: {
		doSomethingWithUser: {
			// ...
		},
		failure: {
			// ...
		},
		loading: {
			// highlight-start
			invoke: {
				id: 'loadUser',
				onDone: {
					actions: assign({
						user: ({ event }) => event.output,
					}),
					target: 'doSomethingWithUser',
				},
				onError: {
					actions: ({ event }) => {
						console.log(event.error)
					},
					target: 'failure',
				},
				src: 'loadUserLogic',
			},
			// highlight-end
		},
	},
})

const actor = createActor(machine)

actor.subscribe((snapshot) => {
	console.log(snapshot.context.user)
})

actor.start()
// eventually logs:
// { id: 1, name: 'Leanne Graham', ... }
```

### Spawning actors

```js
import { assign, createActor, fromPromise, setup } from 'xstate'

const loadUserLogic = fromPromise(async () => {
	const response = await fetch('https://jsonplaceholder.typicode.com/users/1')
	const user = await response.json()
	return user
})

const machine = setup({
	actors: {
		loadUserLogic,
	},
}).createMachine({
	context: {
		userRef: undefined,
	},
	on: {
		loadUser: {
			actions: assign({
				// highlight-start
				userRef: ({ spawn }) => spawn('loadUserLogic'),
				// highlight-end
			}),
		},
	},
})

const actor = createActor(machine)
actor.subscribe((snapshot) => {
	const { userRef } = snapshot.context
	console.log(userRef?.getSnapshot())
})
actor.start()

actor.send({ type: 'loadUser' })
// eventually logs:
// { id: 1, name: 'Leanne Graham', ... }
```

### Input and output

```js
import { setup, createActor } from 'xstate';

const greetMachine = setup({
  types: {
    context: {} as { message: string },
    input: {} as { name: string },
  }
}).createMachine({
  // highlight-start
  context: ({ input }) => ({
    message: `Hello, ${input.name}`,
  }),
  // highlight-end
  entry: ({ context }) => {
    console.log(context.message);
  },
});

const actor = createActor(greetMachine, {
  // highlight-start
  input: {
    name: 'David',
  },
  // highlight-end
});

actor.start();
// logs 'Hello, David'
```

### Invoking actors with input

```js
import { createActor, fromPromise, setup } from 'xstate'

const loadUserLogic = fromPromise(async ({ input }) => {
	const response = await fetch(`https://jsonplaceholder.typicode.com/users/${input.id}`)
	const user = await response.json()
	return user
})

const machine = setup({
	actors: {
		loadUserLogic,
	},
}).createMachine({
	initial: 'loading user',
	states: {
		'loading user': {
			invoke: {
				id: 'loadUser',
				// highlight-start
				input: {
					id: 3,
				},
				// highlight-end
				onDone: {
					actions: ({ event }) => {
						console.log(event.output)
					},
				},
				src: 'loadUserLogic',
			},
		},
	},
})

const actor = createActor(machine)

actor.start()
// eventually logs:
// { id: 3, name: 'Clementine Bauch', ... }
```

### Types

```ts
import { setup, fromPromise } from 'xstate';

const promiseLogic = fromPromise(async () => {
  /* ... */
});

const machine = setup({
  types: {
    context: {} as {
      count: number;
    };
    events: {} as
      | { type: 'inc'; }
      | { type: 'dec' }
      | { type: 'incBy'; amount: number };
    actions: {} as
      | { type: 'notify'; params: { message: string } }
      | { type: 'handleChange' };
    guards: {} as
      | { type: 'canBeToggled' }
      | { type: 'isAfterTime'; params: { time: string } };
    children: {} as {
      promise1: 'someSrc';
      promise2: 'someSrc';
    };
    delays: 'shortTimeout' | 'longTimeout';
    tags: 'tag1' | 'tag2';
    input: number;
    output: string;
  },
  actors: {
    promiseLogic
  }
}).createMachine({
  // ...
});
```
