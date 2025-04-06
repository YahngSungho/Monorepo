# @xstate/svelte

The '@xstate/svelte' package contains utilities for using XState with Svelte.

## API

### `useMachine(machine, options?)`

A function that creates an actor from the given `machine` and starts an actor that runs for the lifetime of the component.

#### Arguments

- `machine` - An XState machine.
- `options` (optional) - Actor options

#### Returns `{ snapshot, send, actorRef}`

- `snapshot` - A Svelte store representing the current state of the machine
- `send` - A function that sends events to the running actor ref.
- `actorRef` - The created actor ref.

### `useSelector(actorRef, selector, compare?, getSnapshot?)`

A function that returns Svelte store representing the selected value from the snapshot of an `actorRef`, such as an actor. The store will only be updated when the selected value changes, as determined by the optional `compare` function.

#### Arguments

- `actorRef` - An actor ref
- `selector` - a function that takes in an actor's current state (`snapshot`) as an argument and returns the desired selected value.
- `compare` (optional) - a function that determines if the current selected value is the same as the previous selected value.

## Matching States

When using hierarchical and parallel machines, the state values will be objects, not strings. In this case, it is best to use `state.matches(...)`.

```svelte
{#if $state.matches('idle')}
{:else if $state.matches({ loading: 'user' })}
{:else if $state.matches({ loading: 'friends' })}
{/if}
```

## Persisted and Rehydrated State

You can persist and rehydrate state with `useMachine(...)` via `options.snapshot`:

```javascript
// Get the persisted state config object from somewhere, e.g. localStorage
const persistedState = JSON.parse(localStorage.getItem('some-persisted-state-key'))

const { snapshot, send } = useMachine(someMachine, {
	snapshot: persistedState,
})
// state will initially be that persisted state, not the machine's initialState
```
