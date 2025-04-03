# @fast-check/vitest

## Examples

The library comes with two modes, both powered by fast-check:

- One-time random mode -- A lightweight approach that introduces controlled randomness into your tests while keeping runs reproducible.
- Property-based testing mode -- A full-fledged property-based testing approach leveraging the full capabilities of fast-check.

### One-time random mode

This mode extends Vitest's default `test` and `it` functions, allowing you to introduce controlled randomness into your tests while ensuring failures remain reproducible. This makes it easier to debug flaky tests and avoid irreproducible failures due to randomness.

Unlike property-based testing, this mode does not run tests multiple times or attempt shrinking when failures occur. Instead, it provides a determistic way to introduce randomness when needed.

```
import { test, fc } from '@fast-check/vitest';
import { expect } from 'vitest';

// You can provide a fixed seed to force a replay by adding this line:
// >>  fc.configureGlobal({ seed })
// Eventually you can disable shrinking capabilities with:
// >>  fc.configureGlobal({ endOnFailure: false })
// >>  // or combine it with the one above if you need both

test('test relying on randomness', ({ g }) \=> {
  // Arrange
  const user \= {
    firstName: g(fc.string),
    lastName: g(fc.string),
  };

  // Act
  const displayName \= computeDisplayName(user);

  // Assert
  expect(displayName).toContain(user.firstName);
});

test('test not relying on randomness', () \=> {
  // your test
});
```

### Full property-based mode

For more extensive testing, `@fast-check/vitest` also provides full support for property-based testing. This mode enables exhaustive, randomized testing by generating a variety of inputs and detecting edge cases automatically.

```
import { test, fc } from '@fast-check/vitest';

// for all a, b, c strings
// b is a substring of a + b + c
test.prop(\[fc.string(), fc.string(), fc.string()\])('should detect the substring', (a, b, c) \=> {
  return (a + b + c).includes(b);
});

// same property but using named values
test.prop({ a: fc.string(), b: fc.string(), c: fc.string() })('should detect the substring', ({ a, b, c }) \=> {
  return (a + b + c).includes(b);
});
```

Please note that the properties accepted by `@fast-check/vitest` as input can either be synchronous or asynchronous (even just `PromiseLike` instances).

### Advanced

If you want to forward custom parameters to fast-check, `test.prop` accepts an optional `fc.Parameters`.

`@fast-check/vitest` also comes with `.only`, `.skip`, `.todo` and `.concurrent` from vitest. It also accepts more complex ones such as `.concurrent.skip`.

```
import { it, test, fc } from '@fast-check/vitest';

test.prop(\[fc.nat(), fc.nat()\], { seed: 4242 })('should replay the test for the seed 4242', (a, b) \=> {
  return a + b \=== b + a;
});

test.skip.prop(\[fc.string()\])('should be skipped', (text) \=> {
  return text.length \=== \[...text\].length;
});

describe('with it', () \=> {
  it.prop(\[fc.nat(), fc.nat()\])('should run too', (a, b) \=> {
    return a + b \=== b + a;
  });
});
```
