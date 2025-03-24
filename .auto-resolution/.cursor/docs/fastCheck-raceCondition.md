# Race conditions

Easily detect race conditions in your JavaScript code

## Overview​

---

Race conditions can easily occur in JavaScript due to its event-driven nature. Any situation where JavaScript has the ability to schedule tasks could potentially lead to race conditions.

> A race condition \[...\] is the condition \[...\] where the system's substantive behavior is dependent on the **sequence** or timing of other **uncontrollable events**.

_Source: <https://en.wikipedia.org/wiki/Race_condition>_

Identifying and fixing race conditions can be challenging as they can occur unexpectedly. It requires a thorough understanding of potential event flows and often involves using advanced debugging and testing tools.
To address this issue, fast-check includes a set of built-in tools specifically designed to help in detecting race conditions. The `scheduler` arbitrary has been specifically designed for detecting and testing race conditions, making it an ideal tool for addressing these challenges in your testing process.

## The scheduler instance​

---

The `scheduler` arbitrary is able to generate instances of `Scheduler`. They come with following interface:

- `schedule: <T>(task: Promise<T>, label?: string, metadata?: TMetadata, act?: SchedulerAct) => Promise<T>` \- Wrap an existing promise using the scheduler. The newly created promise will resolve when the scheduler decides to resolve it (see `waitOne` and `waitAll` methods).
- `scheduleFunction: <TArgs extends any[], T>(asyncFunction: (...args: TArgs) => Promise<T>, act?: SchedulerAct) => (...args: TArgs) => Promise<T>` \- Wrap all the promise produced by an API using the scheduler. `scheduleFunction(callApi)`
- `scheduleSequence(sequenceBuilders: SchedulerSequenceItem<TMetadata>[], act?: SchedulerAct): { done: boolean; faulty: boolean, task: Promise<{ done: boolean; faulty: boolean }> }` \- Schedule a sequence of operations. Each operation requires the previous one to be resolved before being started. Each of the operations will be executed until its end before starting any other scheduled operation.
- `count(): number` \- Number of pending tasks waiting to be scheduled by the scheduler.
- `waitOne: (act?: SchedulerAct) => Promise<void>` \- Wait one scheduled task to be executed. Throws if there is no more pending tasks.
- `waitAll: (act?: SchedulerAct) => Promise<void>` \- Wait all scheduled tasks, including the ones that might be created by one of the resolved task. Do not use if `waitAll` call has to be wrapped into an helper function such as `act` that can relaunch new tasks afterwards. In this specific case use a `while` loop running while `count() !== 0` and calling `waitOne` \- *see CodeSandbox example on userProfile*.
- `waitFor: <T>(unscheduledTask: Promise<T>, act?: SchedulerAct) => Promise<T>` \- Wait as many scheduled tasks as need to resolve the received task. Contrary to `waitOne` or `waitAll` it can be used to wait for calls not yet scheduled when calling it (some test solutions like supertest use such trick not to run any query before the user really calls then on the request itself). Be aware that while this helper will wait eveything to be ready for `unscheduledTask` to resolve, having uncontrolled tasks triggering stuff required for `unscheduledTask` might make replay of failures harder as such asynchronous triggers stay out-of-control for fast-check.
- `report: () => SchedulerReportItem<TMetaData>[]` \- Produce an array containing all the scheduled tasks so far with their execution status. If the task has been executed, it includes a string representation of the associated output or error produced by the task if any.
  Tasks will be returned in the order they get executed by the scheduler.

With:

```
typeSchedulerSequenceItem<TMetadata>=
|{builder:()=>Promise<any>; label:string; metadata?: TMetadata }
|(()=>Promise<any>);

```

You can also define an hardcoded scheduler by using `fc.schedulerFor(ordering: number[])` \- *should be passed through `fc.constant` if you want to use it as an arbitrary*. For instance: `fc.schedulerFor([1,3,2])` means that the first scheduled promise will resolve first, the third one second and at the end we will resolve the second one that have been scheduled.

## Scheduling methods​

---

### schedule​

Create a scheduled `Promise` based on an existing one --- *aka. wrapped `Promise`*. The life-cycle of the wrapped `Promise` will not be altered at all. On its side the scheduled `Promise` will only resolve when the scheduler decides it.

Once scheduled by the scheduler, the scheduler will wait the wrapped `Promise` to resolve before sheduling anything else.

Catching exceptions is your responsability

Similar to any other `Promise`, if there is a possibility that the wrapped `Promise` may be rejected, you have to handle the output of the scheduled `Promise` on your end, just as you would with the original `Promise`.

**Signature**

```
schedule:<T>(task:Promise<T>)=>Promise<T>;
schedule:<T>(task:Promise<T>, label?:string, metadata?: TMetadata, customAct?: SchedulerAct)=>Promise<T>;

```

**Usage**

Any algorithm taking raw `Promise` as input might be tested using this scheduler.

For instance, `Promise.all` and `Promise.race` are examples of such algorithms.

**Snippet**

```
// Let suppose:
// - s        : Scheduler
// - shortTask: Promise   - Very quick operation
// - longTask : Promise   - Relatively long operation
shortTask.then(()=>{
// not impacted by the scheduler
// as it is directly using the original promise
});
const scheduledShortTask = s.schedule(shortTask);
const scheduledLongTask = s.schedule(longTask);
// Even if in practice, shortTask is quicker than longTask
// If the scheduler selected longTask to end first,
// it will wait longTask to end, then once ended it will resolve scheduledLongTask,
// while scheduledShortTask will still be pending until scheduled.
await s.waitOne();

```

### scheduleFunction​

Create a producer of scheduled `Promise`.

Many asynchronous codes utilize functions that can produce `Promise` based on inputs. For example, fetching from a REST API using `fetch("http://domain/")` or accessing data from a database `db.query("SELECT * FROM table")`.

`scheduleFunction` is able to re-order when these `Promise` resolveby waiting the go of the scheduler.

**Signature**

```
scheduleFunction:<TArgs extendsany[],T>(asyncFunction:(...args: TArgs)=>Promise<T>, customAct?: SchedulerAct)=>
(...args: TArgs)=>
Promise<T>;

```

**Usage**

Any algorithm making calls to asynchronous APIs can highly benefit from this wrapper to re-order calls.

Only postpone the resolution

`scheduleFunction` is only postponing the resolution of the function. The call to the function itself is started immediately when the caller calls something on the scheduled function.

**Snippet**

```
// Let suppose:
// - s             : Scheduler
// - getUserDetails: (uid: string) => Promise - API call to get details for a User
const getUserDetailsScheduled = s.scheduleFunction(getUserDetails);
getUserDetailsScheduled('user-001')
// What happened under the hood?
// - A call to getUserDetails('user-001') has been triggered
// - The promise returned by the call to getUserDetails('user-001') has been registered to the scheduler
.then((dataUser001)=>{
// This block will only be executed when the scheduler
// will schedule this Promise
});
// Unlock one of the scheduled Promise registered on s
// Not necessarily the first one that resolves
await s.waitOne();

```

### scheduleSequence​

Create a sequence of asynchrnous calls running in a precise order.

While running, tasks prevent others to complete

One important fact about scheduled sequence is that whenever one task of the sequence gets scheduled, no other scheduled task in the scheduler can be unqueued while this task has not ended.
It means that tasks defined within a scheduled sequence must not require other scheduled task to end to fulfill themselves --- *it does not mean that they should not force the scheduling of other scheduled tasks*.

**Signature**

```
typeSchedulerSequenceItem=
{builder:()=>Promise<any>; label:string}|
(()=>Promise<any>)
;
scheduleSequence(sequenceBuilders: SchedulerSequenceItem[], customAct?: SchedulerAct):{ done:boolean; faulty:boolean, task:Promise<{ done:boolean; faulty:boolean}>}

```

**Usage**

You want to check the status of a database, a webpage after many known operations.

Alternative

Most of the time, model based testing might be a better fit for that purpose.

**Snippet**

```
// Let suppose:
// - s: Scheduler
const initialUserId ='001';
const otherUserId1 ='002';
const otherUserId2 ='003';
// render profile for user {initialUserId}
// Note: api calls to get back details for one user are also scheduled
const{ rerender }=render(<UserProfilePageuserId={initialUserId}/>);
s.scheduleSequence([
async()=>rerender(<UserProfilePageuserId={otherUserId1}/>),
async()=>rerender(<UserProfilePageuserId={otherUserId2}/>),
]);
await s.waitAll();
// expect to see profile for user otherUserId2

```

## Advanced recipes​

---

### Scheduling a function call​

In some tests, we may want to experiment with scenarios where multiple queries are launched concurrently towards our service to observe its behavior in the context of concurrent operations.

```
const scheduleCall =<T>(s: Scheduler,f:()=>Promise<T>)=>{
  s.schedule(Promise.resolve('Start the call')).then(()=>f());
};
// Calling doStuff will be part of the task scheduled in s
scheduleCall(s,()=>doStuff());

```

### Scheduling a call to a mocked server​

Unlike the behavior of `scheduleFunction`, actual calls to servers are not instantaneous, and you may want to schedule when the call reaches your mocked-server.

For instance, suppose you are creating a TODO-list application. In this app, users can only add a new TODO item if there is no other item with the same label. If you utilize the built-in `scheduleFunction` to test this feature, the mocked-server will always receive the calls in the same order as they were made.

```
const scheduleMockedServerFunction =<TArgs extendsunknown[], TOut>(
  s: Scheduler,
f:(...args: TArgs)=>Promise<TOut>,
)=>{
return(...args: TArgs)=>{
return s.schedule(Promise.resolve('Server received the call')).then(()=>f(...args));
};
};
const newAddTodo =scheduleMockedServerFunction(s,(label)=> mockedApi.addTodo(label));
// With newAddTodo = s.scheduleFunction((label) => mockedApi.addTodo(label))
// The mockedApi would have received todo-1 first, followed by todo-2
// When each of those calls resolve would have been the responsibility of s
// In the contrary, with scheduleMockedServerFunction, the mockedApi might receive todo-2 first.
newAddTodo('todo-1');// .then
newAddTodo('todo-2');// .then
// or...
const scheduleMockedServerFunction =<TArgs extendsunknown[], TOut>(
  s: Scheduler,
f:(...args: TArgs)=>Promise<TOut>,
)=>{
const scheduledF = s.scheduleFunction(f);
return(...args: TArgs)=>{
return s.schedule(Promise.resolve('Server received the call')).then(()=>scheduledF(...args));
};
};

```

### Wrapping calls automatically using `act`​

`scheduler` can be given an `act` function that will be called in order to wrap all the scheduled tasks. A code like the following one:

```
fc.assert(
  fc.asyncProperty(fc.scheduler(),asyncs=>(){
// Pushing tasks into the scheduler ...
// ....................................
while(s.count()!==0){
awaitact(async()=>{
// This construct is mostly needed when you want to test stuff in React
// In the context of act from React, using waitAll would not have worked
// as some scheduled tasks are triggered after waitOne resolved
// and because of act (effects...)
await s.waitOne();
});
}
}))

```

Is equivalent to:

```
fc.assert(
  fc.asyncProperty(fc.scheduler({ act }),asyncs=>(){
// Pushing tasks into the scheduler ...
// ....................................
await s.waitAll();
}))

```

This pattern can be helpful whenever you need to make sure that continuations attached to your tasks get called in proper contexts. For instance, when testing React applications, one cannot perform updates of states outside of `act`.

Finer act

The `act` function can be defined on case by case basis instead of being defined globally for all tasks. Check the `act` argument available on the methods of the scheduler.

### Scheduling native timers​

Occasionally, our asynchronous code depends on native timers provided by the JavaScript engine, such as `setTimeout` or `setInterval`. Unlike other asynchronous operations, timers are ordered, meaning that a timer set to wait for 10ms will be executed before a timer set to wait for 100ms. Consequently, they require special handling.

The code snippet below defines a custom `act` function able to schedule timers. It uses Jest, but it can be modified for other testing frameworks if necessary.

```
// You should call: `jest.useFakeTimers()` at the beginning of your test
// The function below automatically schedules tasks for pending timers.
// It detects any timer added when tasks get resolved by the scheduler (via the act pattern).
// Instead of calling `await s.waitFor(p)`, you can call `await s.waitFor(p, buildWrapWithTimersAct(s))`.
// Instead of calling `await s.waitAll()`, you can call `await s.waitAll(buildWrapWithTimersAct(s))`.
functionbuildWrapWithTimersAct(s: fc.Scheduler){
let timersAlreadyScheduled =false;
functionscheduleTimersIfNeeded(){
if(timersAlreadyScheduled || jest.getTimerCount()===0){
return;
}
    timersAlreadyScheduled =true;
    s.schedule(Promise.resolve('advance timers')).then(()=>{
      timersAlreadyScheduled =false;
      jest.advanceTimersToNextTimer();
scheduleTimersIfNeeded();
});
}
returnasyncfunctionwrapWithTimersAct(f:()=>Promise<unknown>){
try{
awaitf();
}finally{
scheduleTimersIfNeeded();
}
};
}
```

## Model based testing and race conditions

Model-based testing features can be combined with race condition detection through the use of `scheduledModelRun`. By utilizing this function, the execution of the model will also be processed through the scheduler.

Do not depend on other scheduled tasks in the model

Neither `check` nor `run` should rely on the completion of other scheduled tasks to fulfill themselves. But they can still trigger new scheduled tasks as long as they don't wait for them to resolve.

## Your first race condition test

### Code under test​

For the next few pages, we will focus on a function called `queue`. Its purpose is to wrap an asynchronous function and queue subsequent calls to it in two ways:

- Promises returned by the function will resolve in order, with the first call resolving before the second one, the second one resolving before the third one, and so on.
- Concurrent calls are not allowed, meaning that a call will always wait for the previously started one to finish before being fired.

In the context of this tutorial you'll never have to edit `queue`. The function will be provided to you.

### Understand current test​

Fortunately, we don't have to start from scratch. The function already has a test in place that ensures queries will consistently resolve in the correct order. The test appears rather simple and currently passes.

```
test('should resolve in call order',async()=>{
// Arrange
const seenAnswers =[];
const call = jest.fn().mockImplementation((v)=>Promise.resolve(v));
// Act
const queued =queue(call);
awaitPromise.all([queued(1).then((v)=> seenAnswers.push(v)),queued(2).then((v)=> seenAnswers.push(v))]);
// Assert
expect(seenAnswers).toEqual([1,2]);
});

```

If we look closer to the test, we can observe that the wrapped function is relatively straightforward in that it merely returns a resolved promise whose value corresponds to the provided input.

```
const call = jest.fn().mockImplementation((v)=>Promise.resolve(v));

```

We can also see that we assess the order of results by confirming that the values pushed into `seenAnswers` are properly ordered. It's worth noting that `seenAnswers` does not represent the same thing as `await Promise.all([queued(1), queued(2)])`. This alternative notation does not evaluate the order in which the resolutions are received, but rather only confirms that each query resolves to its expected value.

### Towards next test​

The test above has some limitations. Namely, the promises and their `.then()` callbacks happen to resolve in the correct order only because they were instantiated in the correct order and they did not `await` to yield control back to the JavaScript event loop (because we use `Promise.resolve()`). In other words, we are just testing that the JavaScript event loop is queueing and processing promises in the correct order, which is hopefully already true!

In order to address this limitation, our updated test should ensure that promises resolve later rather than instantly.

### First glance at schedulers​

When adding fast-check into a race condition test, the recommended initial step is to update the test code as follows:

```
test('should resolve in call order',async()=>{
await fc.assert(fc.asyncProperty(fc.scheduler(),async(s)=>{// <-- added
// ...unchanged code...
}));// <-- added
});

```

This modification runs the test using the fast-check runner. By doing so, any bugs that arise during the predicate will be caught by fast-check.

In the context of race conditions, we want fast-check to provide us with a scheduler instance that is capable of re-ordering asynchronous operations. This is why we added the `fc.scheduler()` argument: it creates an instance of a scheduler that we refer to as `s`. The first important thing to keep in mind for our new test is that we don't want to change the value returned by the API. But we want to change when it gets returned. We want to give the scheduler the responsibility of resolving API calls. To achieve this, the scheduler exposes a method called `scheduleFunction`. This method wraps a function in a scheduled or controlled version of itself.

After pushing scheduled calls into the scheduler, we must execute and release them at some point. This is typically done using `waitAll` or `waitFor`. These APIs simply wait for `waitX` to resolve, indicating that what we were waiting for has been accomplished.

Which wait is the best?

For this first iteration, both of them will be ok, but we will see later that `waitFor` is probably a better fit in that specific example.

## Multiple batches of calls

### Zoom on previous test​

---

#### The choice of integer​

In the previous part, we suggested to run the test against an arbitrary number of calls to `call`. The option we recommend and implemented is based on `integer` arbitrary. We use it to give us the number of calls we should do.

```
const queued =queue(s.scheduleFunction(call));
for(let id =0; id !== numCalls;++id){
  expectedAnswers.push(id);
  pendingQueries.push(queued(id).then((v)=> seenAnswers.push(v)));
}
await s.waitFor(Promise.all(pendingQueries));

```

We based our choice on the fact that the `queue` helper is designed to accept any input, regardless of its value. Thus, there was no particular reason to generate values for the inputs themselves, as they are never consumed by the logic of `queue`. Using integers from 0 onwards allows for simpler debugging, as opposed to arbitrary inputs like 123 or 45.

#### The array version​

Here is how we could have written the array alternative:

```
// ids being the result of fc.array(fc.nat(), {minLength: 1})
const queued =queue(s.scheduleFunction(call));
for(const id of ids){
  expectedAnswers.push(id);
  pendingQueries.push(queued(id).then((v)=> seenAnswers.push(v)));
}
await s.waitFor(Promise.all(pendingQueries));

```

### Towards next test​

---

Our current test doesn't fully capture all possible issues that could arise. In fact, the previous implementation sent all requests at the same time in a synchronous way, without firing some, waiting a bit, and then firing others.

In the next iteration, we aim to declare and run multiple batches of calls: firing them in order will simplify our expectations.

To run things in an ordered way in fast-check, we need to use what we call scheduled sequences. Scheduled sequences can be declared by using the helper `scheduleSequence`. When running scheduled tasks, fast-check interleaves parts coming from sequences in-between and ensures that items in a sequence are run and waited for in order. This means that an item in the sequence will never start before the one before it has stopped. To declare and use a sequence, you can follow the example below:

```
const{ task }= s.scheduleSequence([
async()=>{
// 1st item:
// Runnning something for the 1st item.
},
async()=>{
// 2nd item:
// Runnning something for the 2nd item.
// Will never start before the end of `await firstItem()`.
// Will have to be scheduled by the runner to run, in other words, it may start
// very long after the 1st item.
},
]);
// The sequence also provides a `task` that can be awaited in order to know when all items
// of the sequence have been fully executed. It also provides other values such as done or
// faulty if you want to know bugs that may have occurred during the sechduling of it.

```

Non-batched alternative?

We will discuss about a non-batched alternative in the next page. The batch option we suggest here has the benefit to make you use the `scheduleSequence` helper coming with fast-check.

## The missing part

### Zoom on previous test

As mentioned earlier, the decision to use sequences was largely driven by the desire to cover most of the scheduler's APIs in this tutorial. However, there are alternative ways of achieving our goals.

One of the issues we wanted to address was the need to trigger queries asynchronously. Although this functionality is not yet built into fast-check, we could use the technique outlined in scheduling a function call. If we were to take this approach, we would update:

```
for(let id =0; id !== numCalls;++id){
  expectedAnswers.push(id);
  pendingQueries.push(queued(id).then((v)=> seenAnswers.push(v)));
}

```

into:

```
for(let id =0; id !== numCalls;++id){
  pendingQueries.push(
    s
.schedule(Promise.resolve(`Fire the call for ${id}`))
.then(()=>{
        expectedAnswers.push(id);
returnqueued(id);
})
.then((v)=> seenAnswers.push(v)),
);
}

```

Comparison

Contrary to the batch approach, the ordering of ids will not be ensured. For that reason, we decided to include it in the reports by scheduling a resolved promise with a value featuring this id.

### Towards next test

Our tests may be incomplete because we are not taking into account all aspects of the specification:

> Its purpose is to wrap an asynchronous function and queue subsequent calls to it in two ways:
>
> - Promises returned by the function will resolve in order, with the first call resolving before the second one, the second one resolving before the third one, and so on.
> - Concurrent calls are not allowed, meaning that a call will always wait for the previously started one to finish before being fired.

Although we thoroughly tested the first point, we may have overlooked the second point in the specification. Therefore, in the final section of this tutorial, we will focus on validating the second requirement.

## Wrapping up

### Zoom on previous test​

---

Congratulations! You have learned how to detect race conditions using fast-check library. We explored the concept of race conditions, discussed their potential dangers, and demonstrated various techniques to identify them. By leveraging the powerful features of fast-check, such as property-based testing and shrinking, you now have a robust tool at your disposal to uncover and fix race conditions in your code. Remember to apply these techniques in your projects to ensure the reliability and stability of your software.

Throughout this tutorial, we gradually added race condition detection and expanded its coverage. The final iteration brings us close to fully addressing all possible edge cases of a `queue`.

One important aspect of the last added test is that it covers a specification point we had overlooked in previous iterations. The main change involved ensuring that we never get called twice simultaneously but always get queued. We accomplished this by replacing:

```
//...
const scheduledCall = s.scheduleFunction(call);
const queued =queue(scheduledCall);
//...
expect(concurrentQueriesDetected).toBe(false);
//...

```

with:

```
//...
const scheduledCall = s.scheduleFunction(call);
let concurrentQueriesDetected =false;
let queryPending =false;
constmonitoredScheduledCall=(...args)=>{
  concurrentQueriesDetected ||= queryPending;
  queryPending =true;
returnscheduledCall(...args).finally(()=>(queryPending =false));
};
const queued =queue(monitoredScheduledCall);
//...
expect(concurrentQueriesDetected).toBe(false);
//...

```

The above change ensures that we can detect whenever `scheduledCall` is called before the previous calls to it have resolved.

### Towards next test​

---

Although we have covered the majority of the `queue` algorithm, there are always subtle aspects that we may want to address. In this section, we will provide you with some ideas to ensure that your implementation of `queue` is perfect. All the suggested changes have been implemented in the CodeSandbox playground below, allowing you to see how they can be achieved. The tests associated with this section have been named `*.pnext.v*` and are stacked on top of each other, with the final test incorporating all the suggestions described in this section.

#### Synchronous calls​

While we previously rejected the approach in the first part of the tutorial, we could have considered that calls are expected to be fired synchronously. To achieve this, we can rely on `waitAll` and eliminate any code responsible to wait for the batch to be executed or for promises to resolve.

Here is what we mean by not firing calls synchronously: this snippet does not execute calls in a synchronous manner. Instead, each call is queued and executed after the previous one has resolved:

```
let previous =Promise.resolve();
functionfireCall(call){
  previous = previous.then(()=>call());
}

```

To demonstrate this behavior, you can run the following snippet locally:

```
console.log('before fireCall');
fireCall(async()=>console.log('call'));
console.log('after fireCall');
// Results:
// >  before fireCall
// >  after fireCall
// >  call

```

Let's explore different iterations attempting to enhance this snippet. Here's a naive attempt that addresses the issue for the first call, but it is still incomplete:

```
let previous =undefined;
functionfireCall(call){
if(previous ===undefined){
    previous =call();
}else{
    previous = previous.then(()=>call());
}
}

```

While the above solution improves the situation for the first call, it doesn't handle subsequent calls properly. The issue on second call is highlighted by the following snippet:

```
functionrunOne(){
returnnewPromise((resolve)=>{
console.log('before fireCall');
fireCall(async()=>{
console.log('call');
resolve();
});
console.log('after fireCall');
});
}
awaitrunOne();
awaitrunOne();
// Results:
// >  before fireCall
// >  call
// >  after fireCall
// >  before fireCall
// >  after fireCall
// >  call

```

Here is a more advanced but still not perfect implementation of `fireCall`:

```
let callId =0;
let previous =undefined;
functionfireCall(call){
const currentCallId =++callId;
const next = previous ===undefined?call(): previous.then(()=>call());
  previous = next.then(()=>{
if(callId === currentCallId){
      previous =undefined;
}
});
}

```

This last iteration, implemented in `src/queue.v4.js`, represents the most advanced solution we will show in that section. However, if you examine the CodeSandbox playground\](#have-fun), you'll notice that even this implementation misses some cases and can be fixed.

#### Support exceptions​

When working with asynchronous code, it is common to encounter situations where code can potentially throw errors. As this scenario may occur in production code, it is essential to test our helper against such cases as well.

To enhance our existing tests with this capability, we can modify our mock `call` implementation to simulate both successful executions and error throws. Consequently, our expectations need to be adjusted, but the underlying idea remains the same: both successes and failures should be received in an ordered manner.

## Testing user interfaces​

---

The pattern we have introduced in this tutorial can be extended to address race conditions that may occur in user interfaces. Whether you are working with React components, Vue components, or any other frameworks, you can apply the techniques covered here without any issues.

In fact, the concepts and principles discussed in this tutorial are applicable beyond the scope of the specific examples provided. By leveraging property-based testing and incorporating race condition detection into your UI development workflow, you can enhance the reliability and stability of your applications.
