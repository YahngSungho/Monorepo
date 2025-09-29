# Testing XState

Testing actor logic is important for ensuring that the logic is correct and that it behaves as expected. You can test your state machines and actors using various testing libraries and tools. You should follow the **Arrange, Act, Assert** pattern when writing tests for your state machines and actors:

- **Arrange** - set up the test by creating the actor logics (such as a state machine) and the actors from the actor logics.
- **Act** - send event(s) to the actor(s).
- **Assert** - assert that the actor(s) reached their expected state(s) and/or executed the expected side effects.

```ts
import { expect, test } from 'vitest'
import { createActor, setup } from 'xstate'

test('some actor', async () => {
	const notifiedMessages: string[] = []

	// 1. Arrange
	const machine = setup({
		actions: {
			notify: (_, parameters) => {
				notifiedMessages.push(parameters.message)
			},
		},
	}).createMachine({
		initial: 'inactive',
		states: {
			active: {
				entry: { params: { message: 'Active!' }, type: 'notify' },
				on: { toggle: { target: 'inactive' } },
			},
			inactive: {
				on: { toggle: { target: 'active' } },
			},
		},
	})

	const actor = createActor(machine)

	// 2. Act
	actor.start()
	actor.send({ type: 'toggle' }) // => should be in 'active' state
	actor.send({ type: 'toggle' }) // => should be in 'inactive' state
	actor.send({ type: 'toggle' }) // => should be in 'active' state

	// 3. Assert
	expect(actor.getSnapshot().value).toBe('active')
	expect(notifiedMessages).toEqual(['Active!', 'Active!'])
})
```

---

# @xstate/test

The @xstate/test package contains utilities for facilitating model-based testing for any software.

## Quick start

1. Create the machine that will be used to model the system under test (SUT):

   ```js
   import { createMachine } from 'xstate'
   
   const toggleMachine = createMachine({
   	id: 'toggle',
   	initial: 'inactive',
   	states: {
   		active: {
   			on: {
   				TOGGLE: 'inactive',
   			},
   		},
   		inactive: {
   			on: {
   				TOGGLE: 'active',
   			},
   		},
   	},
   })
   ```

2. Add assertions for each state in the machine (in this example, using Puppeteer):

   ```js
   // ...
   
   const toggleMachine = createMachine({
   	id: 'toggle',
   	initial: 'inactive',
   	states: {
   		active: {
   			meta: {
   				test: async (page) => {
   					await page.waitFor('input:not(:checked)')
   				},
   			},
   			on: {
   				/* ... */
   			},
   		},
   		inactive: {
   			meta: {
   				test: async (page) => {
   					await page.waitFor('input:checked')
   				},
   			},
   			on: {
   				/* ... */
   			},
   		},
   	},
   })
   ```

3. Create the model:

   ```js
   import { createModel } from '@xstate/test'
   import { createMachine } from 'xstate'
   
   const toggleMachine = createMachine(/* ... */)
   
   const toggleModel = createModel(toggleMachine).withEvents({
   	TOGGLE: {
   		exec: async (page) => {
   			await page.click('input')
   		},
   	},
   })
   ```

4. Create test plans and run the tests with coverage:

   ```js
   // ...
   
   describe('toggle', () => {
   	const testPlans = toggleModel.getShortestPathPlans()
   
   	for (const plan of testPlans) {
   		describe(plan.description, () => {
   			for (const path of plan.paths) {
   				it(path.description, async () => {
   					// do any setup, then...
   
   					await path.test(page)
   				})
   			}
   		})
   	}
   
   	it('should have full coverage', () => {
   		return toggleModel.testCoverage()
   	})
   })
   ```

## API

### `createModel(machine, options?)`

Creates an abstract testing model based on the `machine` passed in.

| Argument   | Type             | Description                                    |
| ---------- | ---------------- | ---------------------------------------------- |
| `machine`  | StateMachine     | The machine used to create the abstract model. |
| `options?` | TestModelOptions | Options to customize the abstract model        |

#### Returns

A `TestModel` instance.

### Methods

#### `model.withEvents(eventsMap)`

Provides testing details for each event. Each key in `eventsMap` is an object whose keys are event types and properties describe the execution and test cases for each event:

- `exec` (function): Function that executes the events. It is given two arguments:
  - `testContext` (any): any contextual testing data
  - `event` (EventObject): the event sent by the testing model
- `cases?` (EventObject[]): the sample event objects for this event type that can be sent by the testing model.

Example:

```js
const toggleModel = createModel(toggleMachine).withEvents({
	TOGGLE: {
		exec: async (page) => {
			await page.click('input')
		},
	},
})
```

### `testModel.getShortestPathPlans(options?)`

Returns an array of testing plans based on the shortest paths from the test model’s initial state to every other reachable state.

#### Options

| Argument | Type     | Description                                                                                                    |
| -------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `filter` | function | Takes in the `state` and returns `true` if the state should be traversed, or `false` if traversal should stop. |

This is useful for preventing infinite traversals and stack overflow errors:

```js
const todosModel = createModel(todosMachine).withEvents({
	/* ... */
})

const plans = todosModel.getShortestPathPlans({
	// Tell the algorithm to limit state/event adjacency map to states
	// that have less than 5 todos
	filter: (state) => state.context.todos.length < 5,
})
```

### `testModel.getSimplePathPlans(options?)`

Returns an array of testing plans based on the simple paths from the test model’s initial state to every other reachable state.

#### Options

| Argument | Type     | Description                                                                                                    |
| -------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `filter` | function | Takes in the `state` and returns `true` if the state should be traversed, or `false` if traversal should stop. |

### `testModel.getPlanFromEvents(events, options)`

| Argument  | Type                 | Description                                                                         |
| --------- | -------------------- | ----------------------------------------------------------------------------------- |
| `events`  | `EventObject[]`      | The sequence of events to create the plan                                           |
| `options` | `{ target: string }` | An object with a `target` property that should match the target state of the events |

Returns an array with a single testing plan with a single path generated from the `events`.

Throws an error if the last entered state does not match the `options.target`.

### `testModel.testCoverage(options?)`

Tests that all state nodes were covered (traversed) in the exected tests.

#### Options

| Argument | Type     | Description                                                                               |
| -------- | -------- | ----------------------------------------------------------------------------------------- |
| `filter` | function | Takes in each `stateNode` and returns `true` if that state node should have been covered. |

```js
// Only test coverage for state nodes with a `.meta` property defined:

testModel.testCoverage({
	filter: (stateNode) => !!stateNode.meta,
})
```

### `testPlan.description`

The string description of the testing plan, describing the goal of reaching the `testPlan.state`.

### `testPlan.paths`

The testing paths to get from the test model’s initial state to every other reachable state.

### `testPath.description`

The string description of the testing path, describing a sequence of events that will reach the `testPath.state`.

### `testPath.test(testContext)`

Executes each step in `testPath.segments` by:

1. Verifying that the SUT is in `segment.state`
2. Executing the event for `segment.event`

And finally, verifying that the SUT is in the target `testPath.state`.

NOTE: If your model has nested states, the `meta.test` method for each parent state of that nested state is also executed when verifying that the SUT is in that nested state.

---

# State machine testing strategies

## Testing State Machines in XState

Testing state machines is crucial for ensuring reliable application behavior. XState provides powerful tools and patterns for comprehensive testing of state machines, allowing developers to verify transitions, guards, actions, and overall machine behavior.

### Unit Testing State Transitions

State machine testing begins with verifying basic state transitions. We'll use Jest as our testing framework, but the concepts apply to any testing environment.

```javascript
// Import necessary testing utilities
import { createModel } from '@xstate/test'
import { createMachine, interpret } from 'xstate'

// Define a simple toggle machine for testing
const toggleMachine = createMachine({
	id: 'toggle',
	initial: 'inactive',
	states: {
		active: {
			on: { TOGGLE: 'inactive' },
		},
		inactive: {
			on: { TOGGLE: 'active' },
		},
	},
})

// Basic transition test
describe('Toggle Machine', () => {
	test('should transition states correctly', () => {
		const service = interpret(toggleMachine).start()
		expect(service.state.value).toBe('inactive')

		service.send('TOGGLE')
		expect(service.state.value).toBe('active')

		service.stop()
	})
})
```

### Testing Guards and Conditions

Guards are essential for controlling state transitions based on conditions. Here's how to test them effectively:

```javascript
// Machine with guards
const paymentMachine = createMachine(
	{
		context: {
			amount: 0,
		},
		id: 'payment',
		initial: 'idle',
		states: {
			idle: {
				on: {
					SUBMIT: [
						{
							cond: 'hasValidAmount',
							target: 'processing',
						},
					],
				},
			},
			processing: {
				on: {
					DONE: 'success',
				},
			},
			success: {
				type: 'final',
			},
		},
	},
	{
		guards: {
			hasValidAmount: (context) => context.amount > 0,
		},
	},
)

// Testing guard conditions
test('should only process valid amounts', () => {
	const service = interpret(paymentMachine).start()

	service.send('SUBMIT')
	expect(service.state.value).toBe('idle') // Should not transition

	service.send({ amount: 100, type: 'UPDATE' })
	service.send('SUBMIT')
	expect(service.state.value).toBe('processing')
})
```

### Testing Actions and Side Effects

Actions in state machines often produce side effects. Here's how to test them using mocks:

```javascript
// Machine with actions
const notificationMachine = createMachine({
	context: {
		message: '',
	},
	id: 'notification',
	initial: 'idle',
	states: {
		idle: {
			on: {
				SHOW: {
					actions: 'displayNotification',
					target: 'visible',
				},
			},
		},
		visible: {
			after: {
				3000: 'idle',
			},
		},
	},
})

// Testing actions with mocks
test('should execute notification action', () => {
	const displayMock = jest.fn()

	const testMachine = notificationMachine.withConfig({
		actions: {
			displayNotification: displayMock,
		},
	})

	const service = interpret(testMachine).start()
	service.send('SHOW')

	expect(displayMock).toHaveBeenCalled()
})
```

### Model-Based Testing

Model-based testing allows for comprehensive testing of all possible paths through a state machine:

```javascript
// Creating a test model
const toggleModel = createModel(toggleMachine).withEvents({
	TOGGLE: {
		exec: async (service) => {
			service.send('TOGGLE')
		},
	},
})

// Generate and run test paths
describe('Toggle Model', () => {
	const testPlans = toggleModel.getSimplePathPlans()

	for (const plan of testPlans) {
		describe(plan.description, () => {
			for (const path of plan.paths) {
				it(path.description, async () => {
					await path.test()
				})
			}
		})
	}
})
```

### Integration Testing with Services

When testing machines that communicate with external services, we need to mock these interactions:

```javascript
// Machine with service integration
const fetchMachine = createMachine({
	id: 'fetch',
	initial: 'idle',
	states: {
		failure: {},
		idle: {
			on: { FETCH: 'loading' },
		},
		loading: {
			invoke: {
				onDone: 'success',
				onError: 'failure',
				src: 'fetchData',
			},
		},
		success: {},
	},
})

// Testing service integration
test('should handle successful API calls', (done) => {
	const mockFetchData = () => Promise.resolve({ data: 'test' })

	const service = interpret(
		fetchMachine.withConfig({
			services: {
				fetchData: mockFetchData,
			},
		}),
	).start()

	service.onTransition((state) => {
		if (state.matches('success')) {
			done()
		}
	})

	service.send('FETCH')
})
```

Testing state machines requires a combination of unit tests for individual components and integration tests for the complete system. By following these patterns and utilizing XState's testing utilities, you can ensure your state machines behave correctly under various conditions and scenarios.

The key to effective state machine testing is to cover all possible states, transitions, and edge cases while maintaining readable and maintainable test code. Regular testing helps catch issues early and ensures your state machines remain reliable as your application evolves.

## Testing Actor Systems in XState

Testing actor systems requires a systematic approach to ensure both individual actors and their interactions function correctly. XState provides robust testing utilities that help verify state machine behavior, transitions, and communication between actors.

### Unit Testing Individual Actors

Unit testing actors involves verifying the behavior of individual state machines in isolation. XState's testing utilities allow us to simulate events and assert expected state changes.

The following code demonstrates how to set up basic unit tests for a simple counter actor:

```javascript
// counter.machine.js
import { createMachine } from 'xstate'

// Create a simple counter machine
const counterMachine = createMachine({
	context: { count: 0 },
	id: 'counter',
	initial: 'active',
	states: {
		active: {
			on: {
				DECREMENT: {
					actions: 'decrementCount',
				},
				INCREMENT: {
					actions: 'incrementCount',
				},
			},
		},
	},
})
```

Here's how to test the counter machine using Jest:

```javascript
// counter.test.js
import { interpret } from 'xstate'

import { counterMachine } from './counter.machine'

describe('Counter Machine', () => {
	// Create a new service before each test
	let counterService

	beforeEach(() => {
		counterService = interpret(counterMachine).start()
	})

	afterEach(() => {
		counterService.stop()
	})

	test('should increment counter', () => {
		counterService.send('INCREMENT')
		expect(counterService.state.context.count).toBe(1)
	})
})
```

### Integration Testing Actor Communication

Testing communication between actors requires a more comprehensive approach. We need to verify that actors can send and receive messages correctly.

```javascript
// parent.machine.js
import { createMachine, spawn } from 'xstate'

import { counterMachine } from './counter.machine'

const parentMachine = createMachine({
	context: {
		counterRef: null,
	},
	id: 'parent',
	initial: 'idle',
	states: {
		idle: {
			entry: assign({
				counterRef: () => spawn(counterMachine),
			}),
			on: {
				SEND_TO_COUNTER: {
					actions: (context) => context.counterRef.send('INCREMENT'),
				},
			},
		},
	},
})
```

Testing actor communication involves verifying that messages are properly forwarded:

```javascript
// integration.test.js
import { interpret } from 'xstate'

import { parentMachine } from './parent.machine'

describe('Parent-Child Communication', () => {
	let parentService

	beforeEach(() => {
		parentService = interpret(parentMachine).start()
	})

	test('should forward INCREMENT to counter actor', (done) => {
		parentService.onTransition((state) => {
			if (state.context.counterRef) {
				expect(state.context.counterRef.state.context.count).toBe(1)
				done()
			}
		})

		parentService.send('SEND_TO_COUNTER')
	})
})
```

### Mocking Actor References

Sometimes we need to test actor interactions without spawning real child actors. XState allows mocking actor references:

```javascript
// mock-testing.js
import { createMachine } from 'xstate'

const mockCounterReference = {
	send: jest.fn(),
	subscribe: jest.fn(),
}

const testMachine = createMachine({
	// Machine configuration
}).withConfig({
	services: {
		counterActor: () => mockCounterReference,
	},
})
```

### Testing State Transitions

Verifying state transitions is crucial for ensuring actor behavior correctness. XState provides utilities to assert state values and context:

```javascript
// transition.test.js
import { createMachine } from 'xstate'

const toggleMachine = createMachine({
	id: 'toggle',
	initial: 'inactive',
	states: {
		active: {
			on: { TOGGLE: 'inactive' },
		},
		inactive: {
			on: { TOGGLE: 'active' },
		},
	},
})

test('should toggle states correctly', () => {
	const service = interpret(toggleMachine).start()

	expect(service.state.value).toBe('inactive')
	service.send('TOGGLE')
	expect(service.state.value).toBe('active')
})
```

### Testing Actor System Performance

Performance testing ensures actor systems can handle expected loads. Here's an example of measuring actor creation and message processing time:

```javascript
// performance.test.js
import { createMachine, interpret } from 'xstate'

test('should handle multiple actors efficiently', async () => {
	const startTime = performance.now()

	const actors = Array.from({ length: 100 }, () => interpret(counterMachine).start())

	// Send messages to all actors
	for (const actor of actors) actor.send('INCREMENT')

	const endTime = performance.now()
	const executionTime = endTime - startTime

	expect(executionTime).toBeLessThan(1000) // Should complete within 1 second

	// Cleanup
	for (const actor of actors) actor.stop()
})
```

Testing actor systems requires attention to various aspects including individual behavior, communication patterns, and system performance. By following these testing approaches and utilizing XState's testing utilities, we can build reliable and maintainable actor-based applications. Remember to always test edge cases, error conditions, and concurrent scenarios to ensure robust system behavior.

## Understanding XState Debugging Tools

Debugging state machines in XState requires a systematic approach and the right tools. The XState ecosystem provides several powerful debugging capabilities that help developers identify and fix issues in their state machines effectively.

### XState Inspector

The XState Inspector is a crucial tool for debugging state machines in real-time. It provides a visual representation of your state machine, allowing you to observe state transitions, events, and context changes as they occur.

Let's set up the XState Inspector in a React application:

```javascript
// Import necessary dependencies
import { inspect } from '@xstate/inspect'
import { useMachine } from '@xstate/react'

// Initialize the inspector before your app renders
if (process.env.NODE_ENV === 'development') {
	inspect({
		iframe: false, // Opens in new window
		url: 'https://stately.ai/viz', // Uses Stately visualization
	})
}

// Usage in component
function App() {
	const [state, send] = useMachine(toggleMachine, {
		devTools: true, // Enable inspector connection
	})

	return <div>{/* Your component JSX */}</div>
}
```

### Debug Mode and Logging

XState provides built-in logging capabilities that help track state transitions and event flows. The debug mode can be enabled to get detailed information about machine execution.

```javascript
// Creating a machine with debug mode
import { createMachine, interpret } from 'xstate'

const toggleMachine = createMachine({
	id: 'toggle',
	initial: 'inactive',
	states: {
		active: {
			on: { TOGGLE: 'inactive' },
		},
		inactive: {
			on: { TOGGLE: 'active' },
		},
	},
})

// Initialize service with logging
const service = interpret(toggleMachine, {
	devTools: true,
	logger: (event) => {
		console.log('Event:', event.type)
		console.log('Current State:', event.state.value)
		console.log('Context:', event.state.context)
	},
}).start()
```

### Custom Action Tracing

Implementing custom action tracing helps monitor specific behaviors within your state machine. This is particularly useful for complex state machines with multiple actions.

```javascript
// Machine with traced actions
const tracedMachine = createMachine(
	{
		context: { count: 0 },
		id: 'traced',
		initial: 'idle',
		states: {
			counting: {
				entry: 'logEntry',
				exit: 'logExit',
			},
			idle: {
				on: {
					INCREMENT: {
						actions: 'trackIncrement',
						target: 'counting',
					},
				},
			},
		},
	},
	{
		actions: {
			logEntry: () => console.log('Entered counting state'),
			logExit: () => console.log('Exited counting state'),
			trackIncrement: (context, event) => {
				console.log(`Increment tracked: ${context.count + 1}`)
			},
		},
	},
)
```

### State History Tracking

Implementing state history tracking helps debug complex state transitions and understand the path taken to reach a particular state.

```javascript
// Machine with history tracking
const historyMachine = createMachine(
	{
		context: {
			history: [], // Stores state transition history
		},
		id: 'history',
		initial: 'start',
		states: {
			end: {
				entry: 'recordHistory',
			},
			middle: {
				entry: 'recordHistory',
				on: { NEXT: 'end' },
			},
			start: {
				entry: 'recordHistory',
				on: { NEXT: 'middle' },
			},
		},
	},
	{
		actions: {
			recordHistory: assign({
				history: (context, event) => [
					...context.history,
					{ state: event.type, timestamp: Date.now() },
				],
			}),
		},
	},
)
```

### Error Handling and Recovery

Implementing proper error handling mechanisms helps identify and recover from unexpected states or transitions.

```javascript
// Machine with error handling
const errorHandlingMachine = createMachine(
	{
		id: 'errorHandling',
		initial: 'operational',
		states: {
			error: {
				entry: 'notifyError',
				on: {
					RETRY: 'operational',
				},
			},
			operational: {
				invoke: {
					onError: {
						actions: 'logError',
						target: 'error',
					},
					src: 'riskyOperation',
				},
				on: {
					ERROR: 'error',
				},
			},
		},
	},
	{
		actions: {
			logError: (context, event) => {
				console.error('Operation failed:', event.data)
			},
			notifyError: () => {
				console.warn('System entered error state')
			},
		},
		services: {
			riskyOperation: () => Promise.reject('Something went wrong'),
		},
	},
)
```

### Testing State Transitions

Proper testing of state transitions ensures your state machine behaves as expected. XState provides utilities for testing state machines.

```javascript
// Testing state transitions
import { createMachine, interpret } from 'xstate'

const testMachine = createMachine({
	id: 'test',
	initial: 'idle',
	states: {
		idle: {
			on: { START: 'running' },
		},
		running: {
			on: { STOP: 'idle' },
		},
	},
})

// Test helper function
function testTransition(machine, initialState, event, expectedState) {
	const service = interpret(machine).start(initialState)
	service.send(event)
	console.assert(
		service.state.matches(expectedState),
		`Expected state ${expectedState}, got ${service.state.value}`,
	)
}

// Run test
testTransition(testMachine, 'idle', 'START', 'running')
```

Debugging state machines effectively requires a combination of these tools and techniques. The XState Inspector provides visual feedback, while logging and custom tracing help track specific behaviors. Error handling ensures graceful recovery from failures, and proper testing validates the expected behavior of your state machines. Remember to leverage these debugging capabilities during development to create robust and reliable state machines.

## Understanding Actor System Monitoring

Monitoring actor systems is crucial for maintaining, debugging, and optimizing applications built with XState. Effective monitoring helps developers track state transitions, identify bottlenecks, and ensure proper system behavior.

### Setting Up the Inspector

The XState Inspector is a powerful tool that provides real-time visualization of your actor system. It allows you to observe state changes, events, and context updates as they occur.

```typescript
// Initialize the inspector in your application
import { inspect } from '@xstate/inspect'

// Start the inspector before creating any machines
inspect({
	iframe: false, // Set to true for iframe mode
	url: 'https://stately.ai/viz', // Default visualization URL
})
```

### Implementing Custom Monitors

Custom monitors provide granular control over what aspects of your actor system you want to track. They can be implemented by creating a monitor service that subscribes to machine updates.

```typescript
// Create a custom monitor service
const customMonitor = {
	onEvent: (event) => {
		console.log('Event received:', event)
	},
	onTransition: (state, event) => {
		console.log('State transition:', {
			event: event.type,
			timestamp: new Date().toISOString(),
			value: state.value,
		})
	},
}
```

### Performance Monitoring

Track the performance of your actor system by measuring transition times and identifying potential bottlenecks. This is especially important in complex systems with multiple interacting actors.

```typescript
// Implement performance monitoring
const withPerformanceTracking = (machine) => {
	return machine.withConfig({
		actions: {
			trackTransition: (context, event) => {
				const startTime = performance.now()
				// Track transition duration
				const duration = performance.now() - startTime
				console.log(`Transition took ${duration}ms`)
			},
		},
	})
}
```

### Event Logging and Analysis

Comprehensive event logging helps in debugging and understanding system behavior. Implement structured logging to capture important information about state transitions and events.

```typescript
// Create a structured logger for events
const eventLogger = {
	logEvent: (event, metadata) => {
		const logEntry = {
			metadata,
			payload: event.data,
			timestamp: Date.now(),
			type: event.type,
		}

		// Store or process log entry
		console.log('Event logged:', logEntry)
	},
}
```

### Error Handling and Recovery

Implement robust error handling mechanisms to catch and respond to issues within your actor system. This includes monitoring for unexpected state transitions and handling error events.

```typescript
// Set up error handling for actor system
const errorHandlingConfig = {
	actions: {
		logError: (context, event) => {
			console.error('Actor system error:', {
				error: context.error,
				event,
				state: context.currentState,
			})
		},
		notifyAdmin: (context) => {
			// Send notification to system administrator
		},
	},
	guards: {
		hasError: (context) => Boolean(context.error),
	},
}
```

### Real-time Monitoring Dashboard

Create a monitoring dashboard to visualize the current state of your actor system. This provides an overview of active actors, state distributions, and system health.

```typescript
// Implementation of a basic monitoring dashboard
class ActorSystemDashboard {
	private activeActors = new Map()

	// Get system statistics
	getSystemStats() {
		return {
			activeStates: Array.from(this.activeActors.values(), (a) => a.currentState),
			totalActors: this.activeActors.size,
		}
	}

	// Track actor lifecycle
	registerActor(actor) {
		this.activeActors.set(actor.id, {
			currentState: actor.state.value,
			events: [],
			startTime: Date.now(),
		})
	}

	// Update actor status
	updateActorStatus(actorId, newState) {
		const actor = this.activeActors.get(actorId)
		if (actor) {
			actor.currentState = newState
			actor.lastUpdate = Date.now()
		}
	}
}
```

Monitoring actor systems effectively requires a combination of tools and techniques. By implementing comprehensive monitoring solutions, developers can ensure their applications remain reliable and performant while facilitating easier debugging and maintenance. Remember to regularly review and adjust your monitoring strategy based on system requirements and observed patterns.
