# How to use XState v5

## XState v4 to v5

### Creating machines and actors

- Use `createMachine()`, not `Machine()`
- Use `createActor()`, not `interpret()`
- Use `machine.provide()`, not `machine.withConfig()`
- Set context with input, not `machine.withContext()`
- Actions ordered by default, predictableActionArguments no longer needed
- The `spawn()` function been removed
  - Instead of using the imported `spawn()` function to create actors inside `assign(...)` actions:
    Use the `spawnChild(...)` action creator (preferred)
    Or use the `spawn(...)` method from the first argument passed to the assigner function inside of `assign(...)` actions (useful if you need the actor ref in `context`)
- Use `getNextSnapshot(…)` instead of `machine.transition(…)`
  - The `machine.transition(...)` method now requires an "actor scope" for the 3rd argument, which is internally created by `createActor(...)`. Instead, use `getNextSnapshot(...)` to get the next snapshot from some actor logic based on the current snapshot and event:
- Send events explictly instead of using `autoForward`
  - The `autoForward` property on invoke configs has been removed. Instead, send events explicitly. In general, it's *not* recommended to forward all events to an actor. Instead, only forward the specific events that the actor needs.
- The `state.toStrings()` method has been removed

#### states

- Use `state.getMeta()` instead of state.meta
- Use state.\_nodes instead of state.configuration
- Read events from inspection API instead of state.events

### Events and transitions

- Implementation functions receive a single argument
- `send()` is removed; use `raise()` or `sendTo()`
  - The `send(...)` action creator is removed. Use `raise(...)` for sending events to self or `sendTo(...)` for sending events to other actors instead.
- Use `enqueueActions()` instead of `pure()` and `choose()`
  - The `pure()` and `choose()` methods have been removed. Use `enqueueActions()` instead.
- `actor.send()` no longer accepts string types
  - String event types can no longer be sent to, e.g., `actor.send(event)`; you must send an event object instead
- `state.can()` no longer accepts string types
  - String event types can no longer be sent to, e.g., `state.can(event)`; you must send an event object instead
- Guarded transitions use `guard`, not `cond`
  - The `cond` transition property for guarded transitions is now called `guard`
- Use `params` to pass params to actions & guards
  - Properties other than `type` on action objects and guard objects should be nested under a `params` property; `{ type: 'someType', message: 'hello' }` becomes `{ type: 'someType', params: { message: 'hello' }}`. These `params` are then passed to the 2nd argument of the action or guard implementation:
- Use wildcard `*` transitions, not strict mode
- Use explicit eventless (`always`) transitions
  - Eventless ("always") transitions must now be defined through the `always: { ... }` property of a state node; they can no longer be defined via an empty string:
- Use `reenter: true`, not `internal: false`
  - `internal: false` is now `reenter: true`. External transitions previously specified with `internal: false` are now specified with `reente`
- Transitions are internal by default, not external
  - All transitions are **internal by default**. This change is relevant for transitions defined on state nodes with `entry` or `exit` actions, invoked actors, or delayed transitions (`after`). If you relied on the previous XState v4 behavior where transitions implicitly re-entered a state node, use `reenter: true`
- Child state nodes are always re-entered
  - Child state nodes are always re-entered when they are targeted by transitions (both external and internal) defined on compound state nodes. This change is relevant only if a child state node has `entry` or `exit` actions, invoked actors, or delayed transitions (`after`). Add a `stateIn` guard to prevent undesirable re-entry of the child state.
- Use `stateIn()` to validate state transitions, not in
- Use `actor.subscribe()` instead of state.history
- Actions can throw errors without `eatscale`
  - The `escalate` action creator is removed. In XState v5 actions can throw errors, and they will propagate as expected. Errors can be handled using an `onError` transition.

### Actors

- Use actor logic creators for `invoke.src` instead of functions
- Use `invoke.input` instead of `invoke.data`
- Use `output` in final states instead of `data`
- Don't use property mappers in `input` or `output`
  - If you want to provide dynamic context to invoked actors, or produce dynamic output from final states, use a function instead of an object with property mappers.
- Use `actors` property on `options` object instead of `services`
  - services have been renamed to actors
- Use `subscribe()` for changes, not `onTransition()`
  - The actor.onTransition(...) method is removed. Use actor.subscribe(...) instead
- `createActor()` (formerly `interpret()`) accepts a second argument to restore state
  - `interpret(machine).start(state)` is now `createActor(machine, { snapshot }).start()`. To restore an actor at a specific state, you should now pass the state as the `snapshot` property of the `options` argument of `createActor(logic, options)`. The `actor.start()` property no longer takes in a `state` argument.
- Use `actor.getSnapshot()` to get actor’s state
  - Subscribing to an actor (`actor.subscribe(...)`) after the actor has started will no longer emit the current snapshot immediately. Instead, read the current snapshot from `actor.getSnapshot()`
- Loop over events instead of using `actor.batch()`
- Use `snapshot.status === 'done'` instead of `snapshot.done`
  - The `snapshot.done` property, which was previously in the snapshot object of state machine actors, is removed. Use `snapshot.status === 'done'` instead, which is available to all actors
- `state.nextEvents` has been removed
  - The `state.nextEvents` property is removed, since it is not a completely safe/reliable way of determining the next events that can be sent to the actor. If you want to get the next events according to the previous behavior, you can use this helper function:

### TypeScript

- Use `types` instead of `schema`
- Use `types.typegen` instead of `tsTypes`

---

# XState v5 Documentation

## State Machine (`createMachine`)

### 생성 (Creation)

- **`createMachine(configObj, { input, guards })`**: Creates a new state machine instance from a configuration object and optional implementation details.
- **Default Config Pattern (`setup`)**:
  - Use `setup(configObj)` chained with `.createMachine(configObj2)`.
  - `setup`'s `configObj` registers implementations upfront. Key properties include:
    - `actions`: Action implementations.
    - `actors`: Actor logic implementations (including other machines).
    - `guards`: Guard implementations.
    - `delays`: Named delay implementations (ms).
    - `states`: (Less common for registration, usually part of the main config).
  - **Using Registered Implementations**: Reference them within the machine config using their key string: `{ type: 'key string' }`.
- **Modifying Existing Machines**:
  - `myMachine.provide(configObj)`: Creates a new machine instance with provided implementations overriding or adding to the original ones.

### 스냅샷 (Machine Snapshots)

- **Get Next Snapshot**: Get the snapshot resulting from an event occurring in a specific state.

  ```js
  getNextSnapshot(
  	myMachine,
  	myMachine.resolveState({ value: 'myState' }), // The state snapshot to transition from
  	{ type: 'myEvent' }, // The event causing the transition
  )
  ```

- **Get Initial Snapshot**: Get the machine's initial snapshot, potentially with input.

  ```js
  getInitialSnapshot(
  	myMachine,
  	{ ...inputs }, // Optional input object
  )
  ```

### 상태 노드 (State Nodes)

- The machine itself and entries within the `states: { ...stateNodes }` object are state nodes.
- **State Node Properties**: Information set on the state node itself:
  - `id`: A unique identifier for the state node within the machine.
  - `tag`: A string or array of strings for categorizing the state.
  - `meta`: An object for static descriptive data about the state.
- **Transitions Set**: Define event handlers within a state node:
  - `on: { myEvent: { target: 'nextState', ... } }`

### 스냅샷 (Runtime Snapshot)

- Represents the **현재** (current) state of a machine-based actor.
- **Obtaining**: Get the snapshot from a running machine-based actor instance (e.g., via `actor.getSnapshot()` or subscription).
- **Checking State/Context**:
  - `snapshot.value`: The current state value.
    - Leaf Node (no children): State name string (e.g., `'idle'`).
    - Composite Node (has children): Object mapping child region to its active state (e.g., `{ loading: 'user' }`). For deeper nesting, it reflects the lowest active state (e.g., `{ settings: { theme: 'dark' } }`).
    - Parallel State Node: Object with multiple properties for each region (e.g., `{ monitor: 'on', mode: 'dark' }`).
  - `snapshot.context`: The current context data of the machine.
- **Getting Meta Data**:
  - `snapshot.meta`: Merged `meta` data from all _currently active_ state nodes.
  - `snapshot.getMeta()`: Returns _all_ meta data defined on _all_ state nodes within the machine configuration (not just active ones).
- **Current Actors**:
  - `snapshot.children`: An object containing references to currently invoked or spawned actors.
  - Access individual actors via their `id`: `snapshot.children[actorId]` yields the actor's `ref`.
- **Checking Possible Transitions**:
  - `snapshot.can({ type: eventString })`: Returns `true` if the current state can transition upon receiving the specified event, `false` otherwise.
- **Checking Tags**:
  - `snapshot.hasTag(tagString)`: Returns `true` if any active state node has the specified tag, `false` otherwise.
- **Matching State Values**:
  - `snapshot.matches(stateString | stateObject)`: Checks if the `snapshot.value` matches a given state path string (e.g., `'loading.user'`) or a partial state value object (e.g., `{ loading: 'user' }`). Useful for checking if the machine is "in" a certain state or set of states.
- **Getting Final Output**:
  - `snapshot.output`: Contains the output data if the machine has reached a top-level final state and defined an `output`.

### 컨텍스트 (Context)

- The dynamic, extended state of the machine.
- **Changing Context**:

  - Must be done immutably via an **action**. Use the `assign` action.
  - Static update: `assign({ key: newValue, anotherKey: 'literal' })`.
  - Dynamic update:

    ```js
    assign({
      key: ({ event, context }) => /* calculate newValue based on event/context */
    })
    ```

- **Dynamic Initial Context**: Define `context` as a function to compute it when the actor is created. Actors created at different times can have different initial contexts.

  ```js
  ;() => ({ timestamp: Date.now() /* ... */ })
  ```

- **Input-based Initial Context**: Define `context` as a function receiving `input`.

  ```js
  ;({ input }) => ({ userId: input.id /* ... */ })
  ```

### 트랜지션 (Transitions)

- **Setting in Machine Config**: Defined within the `on` property of a state node.

  ```js
  states: {
    myState: {
      on: {
        myEvent: { target: 'nextState', actions: [ /* ... */ ] }
      }
    }
  }
  ```

- **Fallback Event (`*`)**: Handles any event not explicitly defined in the `on` object.

  - `on: { '*': { target: 'someState', /* ... */ } }`

- **Prefix Wildcard Event**: Handles any event starting with a specific prefix.
  - `on: { 'myPrefix.*': { target: 'anotherState', /* ... */ } }`
- **Multiple Targets (Parallel States)**: Cause transitions in multiple regions of a parallel state simultaneously.
  - `on: { myEvent: { target: ['stateA', 'stateB.child'] } }`
- **Triggering Actor Transitions**: Send an event to the actor instance (`actor.send(...)`).
- **Self-Transition**: A transition that doesn't change the state but can execute actions. Defined by omitting the `target` property.
  - `on: { myEvent: { actions: [ /* ... */ ] /* no target here */ } }`
- **Relative Targeting**:

  - Target Sibling State: Use a dot prefix (`.`). Defined in the _parent_ state's `on` object.

    ```js
    // In parent state config
    {
    	{
    		;('.targetSiblingState')
    	}
    }
    ```

  - Target Sibling's Descendant: `{ target: 'siblingState.child.grandChild' }`
  - Target Parent's Descendant: `{ target: '.child.grandChild' }`

- **Absolute Targeting (by ID)**: Target any state node anywhere in the machine using its `id`.
  - `{ target: '#myStateId' }`
- **Re-entering States**: Force exit and entry actions to run even if transitioning to the same state (or a descendant).
  - `on: { myEvent: { target: 'someState', reenter: true } }`
- **`always` Transitions (Transient Transitions)**: Automatically taken if the condition (guard) is met upon entering the state. Evaluated _after_ entry actions.
  - `myState: { always: { guard: 'someCondition', target: 'nextState', actions: [/* ... */] } }` (Can be an array for multiple conditions).
- **`after` Transitions (Delayed Transitions)**: Transition after a specified delay.

  - `myState: { after: { 5000: { target: 'nextState', actions: [/* ... */] } } }` (Delay in milliseconds)
  - Using Named Delays (defined in `setup`):

    ```js
    // 1. In setup
    setup({ delays: { myTime: 2000 } })
    // 2. In state node
    myState: { after: { myTime: { target: 'nextState', actions: [/* ... */] } } }
    ```

### 액션 (Actions)

- Fire-and-forget side effects.
- **Placement**: Can be defined in:
  - `myEvent: { actions: [ action ] }` (On event transition)
  - `entry: [ action ]` (On state entry)
  - `exit: [ action ]` (On state exit)
- **Action Object**: Reference a predefined action (from `setup`).

  - `{ type: 'actionName', params: { key: 'value' } }`
  - **Dynamic Parameters**: Calculate params based on context/event.

    ```js
    {
      type: 'myAction',
      params: ({ context, event }) => ({ dynamicValue: event.value, userId: context.user.id })
    }
    ```

- **Inline Action**: Define the action function directly.

  - `({ context, event, action }) => { /* side effect logic here */ }`

- **Context Update (`assign`)**: The primary action for updating context.

  ```js
  assign({
  	count: 10, // Static assignment
  	user: ({ event }) => event.user, // Dynamic assignment
  	counter: ({ context }) => context.counter + 1, // Based on previous context
  })
  ```

- **`raise` Action**: Send an event to the machine itself (internal event).

  - `raise({ type: 'INTERNAL_EVENT', value: 42 })`
  - `raise(({ context, event }) => ({ type: 'DYNAMIC_EVENT', data: context.someData }))`
  - Can include options: `raise(eventObj, { id: 'myRaiseId', delay: 100 })`

- **`sendTo` Action**: Send an event to another actor (child, invoked, or external).
  - `sendTo('actorId', { type: 'EVENT_FOR_ACTOR' })`
  - `sendTo(actorRef, { type: 'EVENT_FOR_ACTOR' })`
  - Dynamic target/event: `sendTo(({ context }) => context.targetActorRef, ({ event }) => ({ type: 'FORWARDED', original: event }))`
  - Can include options: `sendTo(target, eventObj, { id: 'mySendId', delay: 'shortDelay' })`
- **`enqueueActions` Action**: Define a sequence of actions to be executed one after another, potentially conditionally.

  ```js
  enqueueActions(({ context, event, enqueue, check }) => {
  	// enqueue an action object or inline function
  	enqueue({ type: 'action1' })
  	enqueue.assign({ counter: ({ context }) => context.counter + 1 })
  	enqueue.sendTo('childId', { type: 'DO_SOMETHING' })
  
  	// conditionally enqueue
  	if (check('someGuard')) {
  		enqueue({ type: 'conditionalAction' })
  	}
  	if (check(({ context }) => context.value > 10)) {
  		enqueue({ type: 'anotherConditionalAction' })
  	}
  })
  ```

- **`log` Action**: Log a message or expression.

  - `log('Entering state X')`
  - `log(({ context, event }) =>`Event ${event.type} received with context ${context.value}`)`

- **`cancel` Action**: Cancel a delayed `sendTo` or `raise` action using its `id`.
  - `cancel('mySendId')`
- **`stopChild` Action**: Stop a spawned actor.
  - `stopChild('spawnedActorId')`
  - `stopChild(actorRef)`
  - Dynamic target: `stopChild(({ context }) => context.actorRefToStop)`

### 가드 (Guards)

- Conditions that determine if a transition or action should occur. Must be pure functions.
- **Guard Creation (in `setup`)**:
  - `guards: { myGuard: ({ context, event }, params) => /* return boolean */ }`
  - `params` are passed if the guard is used with parameters.
- **Guard Usage (in transitions/`always`)**:
  - Reference by ID: `myEvent: { target: '...', guard: 'myGuard' }`
  - Inline Guard: `myEvent: { target: '...', guard: ({ context, event }) => context.count > 10 }`
  - Parameterized Guard: `myEvent: { target: '...', guard: { type: 'myGuard', params: { threshold: 5 } } }`
- **`stateIn` Guard**: A built-in guard creator to check if the machine is currently in a specific state (using ID). This check is relative to the _entire_ machine.
  - `myEvent: { guard: stateIn('#someStateId'), target: '...' }`
- **Conditional Transitions (Guard Array)**: Define multiple transitions for the same event, guarded differently. The _first_ one whose guard evaluates to `true` is taken.

  ```js
  {
  	;[
  		{ guard: 'isVip', target: 'vipArea' },
  		{ guard: ({ context }) => context.age >= 18, target: 'adultSection' },
  		{ target: 'defaultSection' }, // Fallback transition (no guard or guard is true)
  	]
  }
  ```

### 초기 상태 (Initial State)

- Specifies the default child state to enter when entering a composite state.
- `myCompositeState: { initial: 'myDefaultChildState', states: { ... } }`

### 최종 상태 (Final State)

- Represents the completion of a state region or the entire machine.
- **Set**: Define a state node with `type: 'final'`.
  - `myState: { type: 'final' }`
- **Machine Behavior on Final State**:
  - When a machine reaches a top-level final state, all its activities (invoked/spawned actors, delays) are canceled & cleaned up.
  - It stops processing further events.
- **`onDone` Event**: Fired on the parent state when a child state region reaches a final state. For the root machine, the actor itself transitions to a "done" status.
- **Output**: Define data to be emitted when reaching a final state.
  - `myFinalState: { type: 'final', output: ({ context }) => ({ result: context.finalData }) }`

### 히스토리 상태 (History State)

- **Purpose**: Remembers the last active state configuration of its parent state. Transitioning _to_ a history state redirects the transition _to_ the remembered state(s).
- **Set**: Define a state node with `type: 'history'`. A `target` is required as a fallback if no history exists.
  - `historyNode: { type: 'history', target: 'defaultChildState' }`
- **Shallow vs. Deep**:
  - `shallow` (default): Remembers only the direct active child state of the parent.
  - `deep`: Remembers the full path of active descendant states (e.g., `parent.child.grandchild`).
  - Set via `history` property: `historyNode: { type: 'history', history: 'deep' }`

### 병렬 상태 (Parallel State)

- Allows multiple state regions to be active simultaneously.
- **Set**: Define a state node with `type: 'parallel'`.
  - `myParallelState: { type: 'parallel', states: { regionA: { ... }, regionB: { ... } } }`
- **`onDone` Condition**: The parent state's `onDone` transition is only triggered when _all_ regions within the parallel state have reached their own final state.

## 액터 모델 (Actor Model)

### 이벤트 (Events)

- Actors communicate with each other via **`비동기`** (asynchronous) message passing (events).

### 내부 상태 업데이트 (Internal State Update)

- An actor can only update its _own_ internal state.
- Updates happen in response to received messages (events).
- External entities cannot directly modify an actor's state.

### 통신 (Communication)

- Actors communicate by asynchronously sending and receiving events.

### 메일박스 (Mailbox)

- Each actor has a mailbox (event queue). Events are processed sequentially, one at a time.

### 상태 공유 (Sharing State)

- Actors can share parts of their internal state by:
  - Sending events containing data to other actors.
  - Exporting snapshots which are sent to subscribers (`subscribe`).

### 액터 시작 (Starting Actors)

- ```js
    const actor = createActor(someActorLogic, { input: /* optional input */ });
    actor.start(); // Starts the actor and its mailbox processing
  ```

### 이벤트 보내기 (Sending Events)

- Send an event (message) to an actor:
  - `actorRef.send({ type: 'eventName', /* other properties */ })`

### 응답하기 (Responding to Events)

- To reply to a sender, the original event often needs to include the sender's reference (`ref`). The receiving actor can then use that `ref` in a `send` call.

### 구독하기 (Subscribing to State Changes)

- Trigger a callback whenever the actor's state transitions:
  - `const subscription = myActor.subscribe((snapshot) => { /* use snapshot */ });`
- **Unsubscribe**: Call the `.unsubscribe()` method on the object returned by `subscribe()`.
  - `subscription.unsubscribe();`
- **Error Handling in Subscription**: Subscribe specifically to errors.
  - `myActor.subscribe({ error: (err) => { /* handle error */ } });`

### 액터 로직 생성 함수 (Actor Logic Creators)

- **`createMachine`**: (Already covered) Creates state machine logic.
  - _Snapshot Spec_: `{ value: string | object, context: any }`
- **`fromTransition`**: Simple logic that only determines the next state based on the current state and received event. No actions, context changes built-in.

  - ```js
    const actorLogic = fromTransition(
    	(currentState, event) => {
    		// Transition function
    		if (event.type === 'INCREMENT') {
    			return currentState + 1
    		}
    		return currentState // Stay in the same state
    	},
    	0, // Initial state
    )
    ```

  - `initialState` can be a value or a function `({ input }) => initialStateValue`.
  - _Snapshot Spec_: `{ context: currentState }` (The state _is_ the context).

- **`fromObservable`**: Logic driven by an external Observable stream.

  - **Implementation**:

    ```js
    const actorLogic = fromObservable(({ input, self }) => {
    	// Return an Observable here
    	return someObservableSource(input.config)
    })
    ```

    The actor's snapshot context will reflect the latest value emitted by the observable.

  - _Snapshot Spec_: `{ context: latestValueFromObservable }`
  - **Note**: All XState actors are themselves `observable`.

- **`fromCallback`**: Intended for invoking callback-based services. Sends events back to the parent/invoker.

  - **Intent**: Receive event -> Run callback -> Send event back to parent. Like a callback attached to the parent's event.
  - **Implementation**:

    ```js
    const actorLogic = fromCallback(({ sendBack, receive, input }) => {
    	// sendBack(event): Sends an event back to the invoker (parent by default)
    	// receive(callback): Registers a listener for events sent TO this callback actor
    
    	receive((event) => {
    		console.log('Callback actor received:', event)
    		// Example: Perform task and send result back
    		const result = performTask(event.data)
    		sendBack({ type: 'CALLBACK_RESULT', result })
    	})
    
    	// Optional: Perform initial action
    	sendBack({ type: 'CALLBACK_READY' })
    
    	// Optional: Return a cleanup function (stopCallback)
    	return () => {
    		/* cleanup logic */
    	}
    })
    ```

  - **Specifying `sendBack` Target**: (Original text didn't specify how, typically handled by the system/invoker relationship).

- **`fromPromise`**: Logic based on a Promise.

  - **Implementation**:

    ```js
    const actorLogic = fromPromise(async ({ input }) => {
    	const result = await someAsyncOperation(input.data)
    	return result // This becomes the output on success
    })
    ```

  - _Snapshot Spec_: `{ status: 'pending' | 'error' | 'done', output: any | undefined, error: any | undefined }`
  - **Convert Actor to Promise**: `toPromise(promiseActor)` (Resolves/rejects based on the actor's final state).

- **`fromEventObservable`**: Creates an actor that forwards events sent to it directly to its parent/invoker, acting as a proxy.
  - **Effect**: When invoked, events sent _to_ this actor logic instance go _directly_ to the invoking machine, bypassing the event observable actor itself.

### 고차 액터 로직 (Higher-Level Actor Logic)

- Wrappers around existing actor logic to add or modify behavior.
- **Implementation Pattern**:

  ```js
  const enhancedLogic = (originalLogic) => {
  	// Create new logic based on original
  	const newLogic = {
  		...originalLogic,
  		// Override or add properties/methods
  		transition: (state, event, ctx) => {
  			/* ... */
  		},
  	}
  	return newLogic
  }
  ```

### `emptyActor`

- A simple actor that does nothing.
- **Implementation**: `const emptyActor = createEmptyActor()`

### 액터 시스템 (Actor System)

- **Creation**: An actor system is implicitly created when you create a "root" actor using `createActor(actorLogic)`. All actors spawned _by_ this root actor (and their descendants) become part of that system.
- **Accessing the System**:
  - From an actor instance: `actor.system`
  - From within state machine actions/guards/etc.: Use the `system` property from the function arguments (`{ system }`).
- **Registering Actors with the System**: Assign a stable ID within the system.
  - `invoke`: Use the `systemId` property in the invoke configuration: `invoke: { src: ..., systemId: 'myService' }`.
  - `spawn`: Provide `systemId` in the options object: `spawn(logic, { systemId: 'myDynamicActor' })`.

### 액터 상태 기반 Promise (Promises from Actors)

- **Wait for 'done'**: Create a Promise that resolves when the actor reaches its 'done' state.
  - **Mechanism**: Resolves with `snapshot.output` when the actor is done.
  - **Error**: Rejects if the actor reaches an 'error' state or is stopped prematurely.
  - **Implementation**: `const output = await toPromise(myActor);`
- **Wait for Condition**: Create a Promise that resolves when the actor's snapshot satisfies a specific condition.

  - **Implementation**:

    ```js
    const snapshotSatisfyingCondition = await waitFor(
    	myActor,
    	(snapshot) => snapshot.matches('someState') && snapshot.context.value > 10, // Predicate function
    	{ timeout: 5000 }, // Optional timeout in ms
    )
    ```

### 내고장성 (Fault Tolerance)

- Strategies for a parent actor to handle failures in a child actor: Restart, Terminate, Ignore, Resume/Restore.
- **Resume/Restore**: Involves saving the child actor's state periodically and restoring it from the last known good state upon failure.

### 스테이트머신 내 액터 라이프사이클 (Actor Lifecycle within State Machines)

- **`invoke` Start/Stop**:
  - Starts when the parent machine _enters_ the state where the actor is invoked.
  - Stops when the parent machine _exits_ that state.
- **`spawn` Start/Stop**:
  - Starts when the `spawn` action is executed during a transition.
  - Stops when:
    - A `stopChild` action targets it.
    - The parent machine itself stops.

### 지속성 (Persistence)

- Saving and restoring actor state.
- **Pattern Code**:

  - **Save Current State**:

    ```js
    myActor.subscribe((snapshot) => {
    	if (snapshot.status !== 'active') return // Or handle other statuses
    	try {
    		// getPersistedSnapshot includes state value, context, and potentially child states
    		const persistedState = JSON.stringify(actor.getPersistedSnapshot())
    		localStorage.setItem('myActorStateKey', persistedState)
    	} catch (error) {
    		console.error('Failed to save state', error)
    	}
    })
    ```

  - **Restore State**:

    ```js
    const persistedStateJSON = localStorage.getItem('myActorStateKey')
    let actorOptions = {}
    if (persistedStateJSON) {
    	try {
    		const persistedSnapshot = JSON.parse(persistedStateJSON)
    		// Pass the deserialized snapshot to createActor
    		actorOptions = { snapshot: persistedSnapshot }
    	} catch (error) {
    		console.error('Failed to parse persisted state', error)
    	}
    }
    // Add other options like input if needed
    const myActor = createActor(myMachineLogic, {
    	...actorOptions,
    	input: {
    		/* ... */
    	},
    })
    myActor.start()
    ```

### 호출 (Invoke)

- **`State machines`** can invoke actors.
- **vs. Actions**:
  - Allows two-way communication (sending/receiving events) between parent machine and invoked actor.
  - Invoked machine actors can invoke/spawn their _own_ child actors, forming hierarchies.
- **Implementation (within a state node's config)**:

  ```js
  invoke: {
    // Required: The actor logic to invoke
    src: actorLogicOrId, // Can be actor logic object or a string ID registered in setup
  
    // Optional: Unique ID for this invoked actor instance
    id: 'myInvokedActor',
  
    // Optional: Input data for the invoked actor
    input: ({ context, event }) => ({ data: context.someData, trigger: event.type }),
  
    // Optional: Handle events sent back *from* the invoked actor
    onDone: { target: 'successState', actions: assign({ result: ({ event }) => event.output }) },
    onError: { target: 'failureState', actions: assign({ error: ({ event }) => event.data }) }, // Note: onError often has event.data
    onSnapshot: { actions: ({ event }) => console.log('Actor snapshot:', event.snapshot) },
  
    // ... other transition properties like guards can be used on onDone/onError/onSnapshot
  }
  ```

  - **Invoking Registered Actors**: Use the string key from `setup`: `setup({ actors: { myService: someLogic } })` then `invoke: { src: 'myService', ... }`.
  - **Multiple Invokes**: Use an array: `invoke: [ { src: 'actor1', id: 'a1' }, { src: 'actor2', id: 'a2' } ]`.
  - **Provided `src`**: Define `src` as a string ID (`'myActor'`) in the machine, then provide the actual logic when creating the _parent_ actor: `createActor(myMachine.provide({ actors: { myActor: actualLogic } }))`.

- **Lifecycle**: The invoked actor starts when the invoking state is entered and stops when it's exited.
- **Root Invokes**: Define `invoke` at the top level of `createMachine` for actors active throughout the machine's lifetime.
  - `createMachine({ id: 'root', invoke: { src: 'globalService', id: 'svc' }, ... })`
- **Invoked Actor Events (Sent to Parent)**:
  - `onDone`: Triggered when the invoked actor reaches its top-level final state. The event payload (`event.output`) contains the `output` data from the actor's final state.
  - `onError`: Triggered if the invoked actor terminates due to an error (e.g., uncaught exception, promise rejection in `fromPromise`). The event payload (`event.data`) typically contains the error details.
  - `onSnapshot`: Triggered whenever the invoked actor emits a new snapshot (changes state or context). The event payload (`event.snapshot`) contains the actor's snapshot. This is similar to `actor.subscribe`.
- **Accessing Invoked Actors from Parent Snapshot**:
  - `parentSnapshot.children.myInvokedActorId` provides access to the actor's reference, allowing:
    - `id`: The actor's ID.
    - `send`: A function to send events _to_ the actor.
    - `getSnapshot`: A function to get the actor's _current_ snapshot synchronously.

### 글로벌 완료 이벤트 (Global Done Event)

- Access the output of a _done_ invoked actor using a special event type structure: `xstate.done.actor.[actorId]`. This can be useful for transitions defined higher up in the machine.

### Invoke vs. Spawn 차이점

- **Invoke**: Typically for actors representing **`single state`**-based tasks or services tightly coupled to a specific state(s) in the parent. Usually a finite & known number of these exist per state. Lifecycle tied to the state.
- **Spawn**: Typically for actors created dynamically based on **`action`** triggers (e.g., creating an actor for each item in a list). Can have a **`dynamic`** number. Lifecycle managed explicitly via `spawn` and `stopChild` actions, or tied to the parent machine's overall lifetime.

### 스폰 (Spawn)

- Creating actors dynamically via actions.
- **Creation Methods**:

  - `spawnChild(actorLogic, options)`: Action creator for spawning. Options: `{ input, id, systemId }`.
  - Using `assign` with the `spawn` action creator (available in `assign`'s callback) to store the reference (`ActorRef`) in context:

    ```js
    assign({
    	spawnedActorRef: ({ spawn, context, event }) =>
    		spawn(someActorLogic, {
    			id: `item-${event.id}`,
    			input: { parentData: context.value, itemData: event.data },
    			systemId: `worker-${event.id}`, // Optional system registration
    		}),
    })
    ```

    - **Use Case**: When you need to reference the spawned actor later (e.g., to send it events or stop it).
    - **Cleanup Caution**: To prevent memory leaks, when the actor is no longer needed, explicitly stop it using `stopChild` and remove its reference from the context:

      ```js
      ;[
      	stopChild(({ context }) => context.spawnedActorRef), // or stopChild('actorId')
      	assign({ spawnedActorRef: undefined }),
      ]
      ```

- **Stopping Spawned Actors**:
  - `stopChild('actorId')`
  - `stopChild(actorRef)`
  - `stopChild(({ context }) => context.someActorRef)` (Dynamically select actor to stop)

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
import { createActor,setup } from 'xstate';

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
import { createActor,setup } from 'xstate';

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
