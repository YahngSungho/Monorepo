# Args

A story is a component with a set of arguments that define how the component should render. "Args" are Storybook's mechanism for defining those arguments in a single JavaScript object. Args can be used to dynamically change props, slots, styles, inputs, etc. It allows Storybook and its addons to live edit components. You _do not_ need to modify your underlying component code to use args.

When an arg's value changes, the component re-renders, allowing you to interact with components in Storybook's UI via addons that affect args.

Learn how and why to write stories in the introduction. For details on how args work, read on.

## Args object

The `args` object can be defined at the story, component and global level. It is a JSON serializable object composed of string keys with matching valid value types that can be passed into a component for your framework.

## Story args

To define the args of a single story, use the `args` property in the `Story` component if you are using Svelte CSF with the native templating syntax, or use the `args` key on a CSF story file:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,  });</script><Story  name="Primary"  args={{    label: 'Button',    primary: true  }}/>
```

These args will only apply to the story for which they are attached, although you can reuse them via JavaScript object reuse:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,  });  const primaryArgs = {    label: 'Button',    primary: true,  }</script><Story name="Primary" args={primaryArgs} /><Story name="PrimaryLongName"  args={{    ...primaryArgs,    label: 'Primary with a really long name'  }} />
```

In the above example, we use the object spread feature of ES 2015.

## Component args

You can also define args at the component level; they will apply to all the component's stories unless you overwrite them. To do so, use the `args` property in the `defineMeta` function of a Svelte CSF story file or via the `args` key on the default CSF export:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';  import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,    //👇 Creates specific argTypes    argTypes: {      backgroundColor: { control: 'color' },    },    args: {      //👇 Now all Button stories will be primary.      primary: true,    },  });</script>
```

## Global args

You can also define args at the global level; they will apply to every component's stories unless you overwrite them. To do so, define the `args` property in the default export of `preview.js|ts`:

.storybook/preview.js

export default { // The default value of the theme arg for all stories
  tags: ['autodocs'],
  args: { theme: 'light' },
};

For most uses of global args, globals are a better tool for defining globally-applied settings, such as a theme. Using globals enables users to change the value with the toolbar menu.

## Args composition

You can separate the arguments to a story to compose in other stories. Here's how you can combine args for multiple stories of the same component.

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';  

import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,  });  const primaryArgs = {    label: 'Button',    primary: true,  }</script><Story name="Primary" args={primaryArgs} /><Story name="Secondary" args={{...primaryArgs, primary: false}} />
````

If you find yourself re-using the same args for most of a component's stories, you should consider using component-level args.

Args are useful when writing stories for composite components that are assembled from other components. Composite components often pass their arguments unchanged to their child components, and similarly, their stories can be compositions of their child components stories. With args, you can directly compose the arguments:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Page from './Page.svelte';  //👇 Imports all Header stories  import * as HeaderStories from './Header.stories.svelte';  const { Story } = defineMeta({    component: Page,  });
</script><Story name="LoggedIn" args={{ ...HeaderStories.LoggedIn.args }} />
```

## Args can modify any aspect of your component

You can use args in your stories to configure the component's appearance, similar to what you would do in an application. For example, here's how you could use a `footer` arg to populate a child component:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Page from './Page.svelte';  const { Story } = defineMeta({    component: Page  });</script><Story name="CustomFooter" args={{ footer: 'Built with Storybook' }}>  {#snippet children(args)}    <Page {...args} >      <footer>{args.footer}</footer>    </Page>  {/snippet}</Story>
```

## Setting args through the URL

You can also override the set of initial args for the active story by adding an `args` query parameter to the URL. Typically you would use the Controls addon to handle this. For example, here's how you could set a `size` and `style` arg in the Storybook's URL:

```text
?path=/story/avatar--default&args=style:rounded;size:100

```

As a safeguard against XSS attacks, the arg's keys and values provided in the URL are limited to alphanumeric characters, spaces, underscores, and dashes. Any other types will be ignored and removed from the URL, but you can still use them with the Controls addon and within your story.

The `args` param is always a set of `key: value` pairs delimited with a semicolon `;`. Values will be coerced (cast) to their respective `argTypes` (which may have been automatically inferred). Objects and arrays are supported. Special values `null` and `undefined` can be set by prefixing with a bang `!`. For example, `args=obj.key:val;arr[0]:one;arr[1]:two;nil:!null` will be interpreted as:

```js
{  obj: { key: 'val' },  arr: ['one', 'two'],  nil: null}
```

Similarly, special formats are available for dates and colors. Date objects will be encoded as `!date(value)` with value represented as an ISO date string. Colors are encoded as `!hex(value)`, `!rgba(value)` or `!hsla(value)`. Note that rgb(a) and hsl(a) should not contain spaces or percentage signs in the URL.

Args specified through the URL will extend and override any default values of args set on the story.

## Mapping to complex arg values

Complex values such as JSX elements cannot be serialized to the manager (e.g., the Controls addon) or synced with the URL. Arg values can be "mapped" from a simple string to a complex type using the `mapping` property in `argTypes` to work around this limitation. It works in any arg but makes the most sense when used with the `select` control type.

```svelte
import { Example } from './Example';export default {  component: Example,  argTypes: {    label: {      options: ['Normal', 'Bold', 'Italic'],      mapping: {        Bold: <b>Bold</b>,        Italic: <i>Italic</i>,      },    },  },};
```

Note that `mapping` does not have to be exhaustive. If the arg value is not a property of `mapping`, the value will be used directly. Keys in `mapping` always correspond to arg _values_, not their index in the `options` array.

# Parameters

Parameters are a set of static, named metadata about a story, typically used to control the behavior of Storybook features and addons.

Available parameters are listed in the parameters API reference.

For example, let's customize the backgrounds addon via a parameter. We'll use `parameters.backgrounds` to define which backgrounds appear in the backgrounds toolbar when a story is selected.

## Story parameters

With Svelte, we can set the `parameters` property in the `Story` component to define parameters for a single story using Svelte CSF with the native templating syntax, or we can use the `parameters` key on a CSF named export:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,  });</script><Story  name="OnDark"  parameters={{    backgrounds: { default: 'dark' }  }}/>
```

## Component parameters

To define parameters for all stories of a component, we can add the `parameters` property in the `defineMeta` function of a Svelte CSF story file, or we can use the `parameters` key on the default CSF export:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';  import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,    //👇 Creates specific parameters at the component level    parameters: {      backgrounds: {        default: 'dark',      },    },  });</script>
```

## Global parameters

We can also set the parameters for **all stories** via the `parameters` export of your `.storybook/preview.js|ts` file (this is the file where you configure all stories):

.storybook/preview.ts

```svelte
export default {  parameters: {    backgrounds: {      values: [        { name: 'light', value: '#fff' },        { name: 'dark', value: '#333' },      ],    },  },};
```

Setting a global parameter is a common way to configure addons. With backgrounds, you configure the list of backgrounds that every story can render in.

## Rules of parameter inheritance

The way the global, component and story parameters are combined is:

- More specific parameters take precedence (so a story parameter overwrites a component parameter which overwrites a global parameter).
- Parameters are **merged**, so keys are only ever overwritten and never dropped.

The merging of parameters is important. This means it is possible to override a single specific sub-parameter on a per-story basis while retaining most of the parameters defined globally.

If you are defining an API that relies on parameters (e.g., an **addon**) it is a good idea to take this behavior into account.

# Naming components and hierarchy

Storybook provides a powerful way to organize your stories, giving you the necessary tools to categorize, search, and filter your stories based on your organization's needs and preferences.

## Structure and hierarchy

When organizing your Storybook, there are two methods of structuring your stories: **implicit** and **explicit**. The implicit method involves relying upon the physical location of your stories to position them in the sidebar, while the explicit method involves utilizing the `title` parameter to place the story.

!Storybook sidebar hierarchy

Based on how you structure your Storybook, you can see that the story hierarchy is made up of various parts:

- **Category**: The top-level grouping of stories and documentation pages generated by Storybook
- **Folder**: A mid-level organizational unit that groups components and stories in the sidebar, representing a feature or section of your application
- **Component**: A low-level organizational unit representing the component that the story is testing
- **Docs**: The automatically generated documentation page for the component
- **Story**: The individual story testing a specific component state

## Naming stories

When creating your stories, you can explicitly use the `title` parameter to define the story's position in the sidebar. It can also be used to group related components together in an expandable interface to help with Storybook organization providing a more intuitive experience for your users. For example:

```svelte
import { Button } from './Button';export default {  /* 👇 The title prop is optional.   * See https://storybook.js.org/docs/configure/#configure-story-loading   * to learn how to generate automatic titles   */  title: 'Button',  component: Button,};
```

Yields this:

!Stories hierarchy without paths

## Grouping

It is also possible to group related components in an expandable interface to help with Storybook organization. To do so, use the `/` as a separator:

```svelte
import { Button } from './Button';export default {  /* 👇 The title prop is optional.   * See https://storybook.js.org/docs/configure/#configure-story-loading   * to learn how to generate automatic titles   */  title: 'Design System/Atoms/Button',  component: Button,};
```

```svelte
import { CheckBox } from './Checkbox';export default {  /* 👇 The title prop is optional.   * See https://storybook.js.org/docs/configure/#configure-story-loading   * to learn how to generate automatic titles   */  title: 'Design System/Atoms/Checkbox',  component: CheckBox,};
```

Yields this:

!Stories hierarchy with paths

## Roots

By default, the top-level grouping will be displayed as "root" in the Storybook UI (i.e., the uppercased, non-expandable items). If you need, you can configure Storybook and disable this behavior. Useful if you need to provide a streamlined experience for your users; nevertheless, if you have a large Storybook composed of multiple component stories, we recommend naming your components according to the file hierarchy.

## Single-story hoisting

Single-story components (i.e., component stories without **siblings**) whose **display name** exactly matches the component's name (last part of `title`) are automatically hoisted up to replace their parent component in the UI. For example:

```svelte
import { Button as ButtonComponent } from './Button';export default {  /* 👇 The title prop is optional.   * See https://storybook.js.org/docs/configure/#configure-story-loading   * to learn how to generate automatic titles   */  title: 'Design System/Atoms/Button',  component: ButtonComponent,};// This is the only named export in the file, and it matches the component nameexport const Button = {};
```

!Stories hierarchy with single story hoisting

Because story exports are automatically "start cased" (`myStory` becomes `"My Story"`), your component name should match that. Alternatively, you can override the story name using `myStory.storyName = '...'` to match the component name.

## Sorting stories

Out of the box, Storybook sorts stories based on the order in which they are imported. However, you can customize this pattern to suit your needs and provide a more intuitive experience by adding `storySort` to the `options` parameter in your `preview.js` file.

.storybook/preview.js

```svelte
export default {  parameters: {    options: {      storySort: (a, b) =>        a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true }),    },  },};
```

Asides from the unique story identifier, you can also use the `title`, `name`, and import path to sort your stories using the `storySort` function.

The `storySort` can also accept a configuration object.

.storybook/preview.js

```svelte
export default {  parameters: {    options: {      storySort: {        method: '',        order: [],        locales: '',      },    },  },};
```

| Field            | Type    | Description                                              | Required | Default Value           | Example                   |
| ---------------- | ------- | -------------------------------------------------------- | -------- | ----------------------- | ------------------------- |
| **method**       | String  | Tells Storybook in which order the stories are displayed | No       | Storybook configuration | `'alphabetical'`          |
| ---              | ---     | ---                                                      | ---      | ---                     | ---                       |
| **order**        | Array   | The stories to be shown, ordered by supplied name        | No       | Empty Array `[]`        | `['Intro', 'Components']` |
| **includeNames** | Boolean | Include story name in sort calculation                   | No       | `false`                 | `true`                    |
| **locales**      | String  | The locale required to be displayed                      | No       | System locale           | `en-US`                   |

To sort your stories alphabetically, set `method` to `'alphabetical'` and optionally set the `locales` string. To sort your stories using a custom list, use the `order` array; stories that don't match an item in the `order` list will appear after the items in the list.

The `order` array can accept a nested array to sort 2nd-level story kinds. For example:

.storybook/preview.js

```svelte
export default {  parameters: {    options: {      storySort: {        order: ['Intro', 'Pages', ['Home', 'Login', 'Admin'], 'Components'],      },    },  },};
```

Which would result in this story ordering:

1. `Intro` and then `Intro/*` stories
2. `Pages` story
3. `Pages/Home` and `Pages/Home/*` stories
4. `Pages/Login` and `Pages/Login/*` stories
5. `Pages/Admin` and `Pages/Admin/*` stories
6. `Pages/*` stories
7. `Components` and `Components/*` stories
8. All other stories

If you want specific categories to sort to the end of the list, you can insert a `*` into your `order` array to indicate where "all other stories" should go:

.storybook/preview.js

```svelte
export default {  parameters: {    options: {      storySort: {        order: ['Intro', 'Pages', ['Home', 'Login', 'Admin'], 'Components', '*', 'WIP'],      },    },  },};
```

In this example, the `WIP` category would be displayed at the end of the list.

Note that the `order` option is independent of the `method` option; stories are sorted first by the `order` array and then by either the `method: 'alphabetical'` or the default `configure()` import order.

# Stories for multiple components

It's useful to write stories that render two or more components at once if those components are designed to work together. For example, `ButtonGroup`, `List`, and `Page` components.

## Subcomponents

When the components you're documenting have a parent-child relationship, you can use the `subcomponents` property to document them together. This is especially useful when the child component is not meant to be used on its own, but only as part of the parent component.

Here's an example with `List` and `ListItem` components:

This snippet doesn't exist for svelte. In the meantime, here's the React snippet.

```svelte
import React from 'react';import { List } from './List';import { ListItem } from './ListItem';export default {  component: List,  subcomponents: { ListItem }, //👈 Adds the ListItem component as a subcomponent};export const Empty = {};export const OneItem = {  render: (args) => (    <List {...args}>      <ListItem />    </List>  ),};
```

Note that by adding a `subcomponents` property to the default export, we get an extra panel on the ArgTypes and Controls tables, listing the props of `ListItem`:

!Subcomponents in ArgTypes doc block

Subcomponents are only intended for documentation purposes and have some limitations:

1. The argTypes of subcomponents are inferred (for the renderers that support that feature) and cannot be manually defined or overridden.
2. The table for each documented subcomponent does _not_ include controls to change the value of the props, because controls always apply to the main component's args.

Let's talk about some techniques you can use to mitigate the above, which are especially useful in more complicated situations.

## Reusing story definitions

We can also reduce repetition in our stories by reusing story definitions. Here, we can reuse the `ListItem` stories' args in the story for `List`:

This snippet doesn't exist for svelte. In the meantime, here's the React snippet.

```svelte
import React from 'react';import { List } from './List';import { ListItem } from './ListItem';//👇 We're importing the necessary stories from ListItemimport { Selected, Unselected } from './ListItem.stories';export default {  component: List,};export const ManyItems = {  render: (args) => (    <List {...args}>      <ListItem {...Selected.args} />      <ListItem {...Unselected.args} />      <ListItem {...Unselected.args} />    </List>  ),};
```

By rendering the `Unchecked` story with its args, we are able to reuse the input data from the `ListItem` stories in the `List`.

## Creating a Template Component

Another option that is more "data"-based is to create a special "story-generating" template component:

This snippet doesn't exist for svelte. In the meantime, here's the React snippet.

```svelte
import { List } from './List';import { ListItem } from './ListItem';//👇 Imports a specific story from ListItem storiesimport { Unchecked } from './ListItem.stories';export default {  /* 👇 The title prop is optional.   * See https://storybook.js.org/docs/configure/#configure-story-loading   * to learn how to generate automatic titles   */  title: 'List',  component: List,};//👇 The ListTemplate construct will be spread to the existing stories.const ListTemplate = {  render: ({ items, ...args }) => {    return (      <List>        {items.map((item) => (          <ListItem {...item} />        ))}      </List>    );  },};export const Empty = {  ...ListTemplate,  args: {    items: [],  },};export const OneItem = {  ...ListTemplate,  args: {    items: [      {        ...Unchecked.args,      },    ],  },};
```

This approach is a little more complex to setup, but it means you can more easily reuse the `args` to each story in a composite component. It also means that you can alter the args to the component with the Controls addon.

# Actions

The actions addon is used to display data received by event handler (callback) arguments in your stories.

## Action args

Actions work via supplying special Storybook-generated "action" arguments (referred to as "args" for short) to your stories. There are two ways to get an action arg:

###

Via @storybook/test fn spy function

The recommended way to write actions is to use the `fn` utility from `@storybook/test` to mock and spy args. This is very useful for writing component tests. You can mock your component's methods by assigning them to the `fn()` function:

```svelte
import { fn } from '@storybook/test';import { Button } from './Button';export default {  component: Button,  // 👇 Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked  args: { onClick: fn() },};
```

If your component calls an arg (because of either the user's interaction or the `play` function) and that arg is spied on , the event will show up in the action panel:

!Essential Actions addon usage

###

Automatically matching args

Another option is to use a global parameter to match all argTypes that match a certain pattern. The following configuration automatically creates actions for each `on` argType (which you can either specify manually or can be inferred automatically).

This is quite useful when your component has dozens (or hundreds) of methods and you do not want to manually apply the `fn` utility for each of those methods. However, **this is not the recommended** way of writing actions. That's because automatically inferred args **are not available as spies in your play function**. If you use `argTypesRegex` and your stories have play functions, you will need to also define args with the `fn` utility to test them in your play function.

.storybook/preview.js

```svelte
export default {  parameters: {    actions: { argTypesRegex: '^on.*' },  },};
```

If you need more granular control over which `argTypes` are matched, you can adjust your stories and include the `argTypesRegex` parameter. For example:

```svelte
import { Button } from './Button';export default {  component: Button,  parameters: { actions: { argTypesRegex: '^on.*' } },};
```

If you're generating argTypes with another addon (like docs, which is the common behavior), ensure the actions addon **AFTER** the other addon. You can do this by listing it later in the addons registration code in `.storybook/main.js`. This is default in essentials.

## Action event handlers

It is also possible to detect if your component is emitting the correct HTML events using the `parameters.actions.handles` parameter.

```svelte
import { Button } from './Button';import { withActions } from '@storybook/addon-actions/decorator';export default {  component: Button,  parameters: {    actions: {      handles: ['mouseover', 'click .btn'],    },  },  decorators: [withActions],};
```

This will bind a standard HTML event handler to the outermost HTML element rendered by your component and trigger an action when the event is called for a given selector. The format is `<eventname> <selector>`. The selector is optional; it defaults to all elements.

## API

###

Parameters

This addon contributes the following parameters to Storybook, under the `actions` namespace:

####

`argTypesRegex`

Type: `string`

Create actions for each arg that matches the regex. Please note the significant limitations of this approach, as described above.

####

`disable`

Type: `boolean`

Disable this addon's behavior. If you wish to disable this addon for the entire Storybook, you should do so when registering `addon-essentials`. See the essential addon's docs for more information.

This parameter is most useful to allow overriding at more specific levels. For example, if this parameter is set to `true` at the project level, it could then be re-enabled by setting it to `false` at the meta (component) or story level.

####

`handles`

Type: `string[]`

Binds a standard HTML event handler to the outermost HTML element rendered by your component and triggers an action when the event is called for a given selector. The format is `<eventname> <selector>`. The selector is optional; it defaults to all elements.

See the action event handlers section, above, for more information.

###

Exports

This addon contributes the following exports to Storybook:

```svelte
import { action } from '@storybook/addon-actions';
```

####

`action`

Type: `(name?: string) => void`

Allows you to create an action that appears in the actions panel of the Storybook UI when clicked. The action function takes an optional name parameter, which is used to identify the action in the UI.

Button.stories.js

```svelte
import { action } from '@storybook/addon-actions';import Button from './Button';export default {  component: Button,  args: {    // 👇 Create an action that appears when the onClick event is fired    onClick: action('on-click'),  },};
```

---

# Controls

Storybook Controls gives you a graphical UI to interact with a component's arguments dynamically without needing to code. It creates an addon panel next to your component examples ("stories"), so you can edit them live.

Controls do not require any modification to your components. Stories for controls are:

- Convenient. Auto-generate controls based on React/Vue/Angular/etc. components.
- Portable. Reuse your interactive stories in documentation, tests, and even in designs.
- Rich. Customize the controls and interactive data to suit your exact needs.

To use the Controls addon, you need to write your stories using args. Storybook will automatically generate UI controls based on your args and what it can infer about your component. Still, you can configure the controls further using argTypes, see below.

If you have stories in the older pre-Storybook 6 style, check the args & controls migration guide to learn how to convert your existing stories for args.

## Choosing the control type

By default, Storybook will choose a control for each arg based on its initial value. This will work well with specific arg types (e.g., `boolean` or `string`). To enable them, add the `component` annotation to the default export of your story file, and it will be used to infer the controls and auto-generate the matching `argTypes` for your component provided by the framework you've chosen to use.

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,  });</script>
```

If you're using a framework that doesn't support this feature, you'll need to define the `argTypes` for your component manually.

For instance, suppose you have a `variant` arg on your story that should be `primary` or `secondary`:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,  });</script><Story name="Primary" args={{ variant: 'primary' }} />
```

By default, Storybook will render a free text input for the `variant` arg:

!Essential addon Controls using a string

It works as long as you type a valid string into the auto-generated text control. Still, it's not the best UI for our scenario, given that the component only accepts `primary` or `secondary` as variants. Let's replace it with Storybook's radio component.

We can specify which controls get used by declaring a custom argType for the `variant` property. ArgTypes encode basic metadata for args, such as name, description, and defaultValue for an arg. These get automatically filled in by Storybook Docs.

`ArgTypes` can also contain arbitrary annotations, which the user can override. Since `variant` is a component property, let's put that annotation on the `defineMeta` function, or the default export if you're using standard CSF.

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Button from './Button.svelte';  const { Story } = defineMeta({    argTypes: {      variant: {        control: { type: 'radio' },        options: ['primary', 'secondary'],      },    },    component: Button,  });</script>
```

ArgTypes are a powerful feature that can be used to customize the controls for your stories. For more information, see the documentation about customizing controls with `argTypes` annotation.

This replaces the input with a radio group for a more intuitive experience.

!Essential Control addon with a radio group

## Custom control type matchers

Controls can automatically be inferred from arg's name with regex, but currently only for the color picker and date picker controls. If you've used the Storybook CLI to setup your project, it should have automatically created the following defaults in `.storybook/preview.js|ts`:

| Control   | Default regex | Description                                              |
| --------- | ------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| **color** | `/(background | color)$/i`                                               | Will display a color picker UI for the args that match it |
| ---       | ---           | ---                                                      |
| **date**  | `/Date$/`     | Will display a date picker UI for the args that match it |

If you haven't used the CLI to set the configuration, or if you want to define your patterns, use the `matchers` property in the `controls` parameter:

.storybook/preview.js

```svelte
export default {  parameters: {    controls: {      matchers: {        color: /(background|color)$/i,        date: /Date$/,      },    },  },};
```

## Fully custom args

Until now, we only used auto-generated controls based on the component for which we're writing stories. If we are writing complex stories, we may want to add controls for args that aren't part of the component. For example, here's how you could use a `footer` arg to populate a child component:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Page from './Page.svelte';  const { Story } = defineMeta({    component: Page  });</script><Story name="CustomFooter" args={{ footer: 'Built with Storybook' }}>  {#snippet children(args)}    <Page {...args} >      <footer>{args.footer}</footer>    </Page>  {/snippet}</Story>
```

By default, Storybook will add controls for all args that:

- It infers from the component definition if your framework supports it.

- Appear in the list of args for your story.

Using `argTypes`, you can change the display and behavior of each control.

###

Dealing with complex values

When dealing with non-primitive values, you'll notice that you'll run into some limitations. The most obvious issue is that not every value can be represented as part of the `args` param in the URL, losing the ability to share and deep link to such a state. Beyond that, complex values such as JSX cannot be synchronized between the manager (e.g., Controls addon) and the preview (your story).

One way to deal with this is to use primitive values (e.g., strings) as arg values and add a custom `render` function to convert them to their complex counterpart before rendering. It isn't the nicest way to do it (see below), but certainly the most flexible.

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';  const { Story } = defineMeta({      component: YourComponent,      //👇 Creates specific argTypes      argTypes: {        propertyA: {          options: ['Item One', 'Item Two', 'Item Three'],          control: { type: 'select' }, // Automatically inferred when 'options' is defined        },        propertyB: {          options: ['Another Item One', 'Another Item Two', 'Another Item Three'],        },      },  });  const someFunction = (valuePropertyA, valuePropertyB) => {    // Do some logic here  };</script><Story  name="ExampleStory"  args={{    propertyA: 'Item One',    propertyB: 'Another Item One',  }}>  {#snippet children(args)}    <YourComponent      {...args}      someProperty={someFunction(args.propertyA, args.propertyB)}    />  {/snippet}</Story>
```

Unless you need the flexibility of a function, an easier way to map primitives to complex values before rendering is to define a `mapping`; additionally, you can specify `control.labels` to configure custom labels for your checkbox, radio, or select input.

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';  import Button from './Button.svelte';  import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from './icons';  const arrows = { ArrowUp, ArrowDown, ArrowLeft, ArrowRight };  const { Story } = defineMeta({    component: Button,    argTypes: {      arrow: {        options: Object.keys(arrows), // An array of serializable values        mapping: arrows, // Maps serializable option values to complex arg values        control: {          type: 'select', // Type 'select' is automatically inferred when 'options' is defined          labels: {            // 'labels' maps option values to string labels            ArrowUp: 'Up',            ArrowDown: 'Down',            ArrowLeft: 'Left',            ArrowRight: 'Right',          },        },      },    },  });</script>
```

Note that both `mapping` and `control.labels` don't have to be exhaustive. If the currently selected option is not listed, it's used verbatim.

## Creating and editing stories from controls

This feature is not supported with the Svelte CSF. To opt-in to this feature with Svelte, you must use Storybook's Component Story Format.

The Controls addon allows you to create or edit stories, directly from the Controls panel.

###

Create a new story

Open the Controls panel for a story and adjust the value of a control. Then save those changes as a new story.

###

Edit a story

You can also update a control's value, then save the changes to the story. The story file's code will be updated for you.

###

Disable creating and editing of stories

If you don't want to allow the creation or editing of stories from the Controls panel, you can disable this feature by setting the `disableSaveFromUI` parameter to `true` in the `parameters.controls` parameter in your `.storybook/preview.js|ts` file.

## Configuration

The Controls addon can be configured in two ways:

- Individual controls can be configured via control annotations.
- The addon's appearance can be configured via parameters.

###

Annotation

As shown above, you can configure individual controls with the "control" annotation in the argTypes field of either a component or story. Below is a condensed example and table featuring all available controls.

| Data Type   | Control        | Description                                                                                                                                                                                                   |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **boolean** | `boolean`      | Provides a toggle for switching between possible states.`argTypes: { active: { control: 'boolean' }}`                                                                                                         |
| ---         | ---            | ---                                                                                                                                                                                                           |
| **number**  | `number`       | Provides a numeric input to include the range of all possible values.`argTypes: { even: { control: { type: 'number', min:1, max:30, step: 2 } }}`                                                             |
|             | `range`        | Provides a range slider component to include all possible values.`argTypes: { odd: { control: { type: 'range', min: 1, max: 30, step: 3 } }}`                                                                 |
| **object**  | `object`       | Provides a JSON-based editor component to handle the object's values.Also allows edition in raw mode.`argTypes: { user: { control: 'object' }}`                                                               |
| **array**   | `object`       | Provides a JSON-based editor component to handle the array's values.Also allows edition in raw mode.`argTypes: { odd: { control: 'object' }}`                                                                 |
|             | `file`         | Provides a file input component that returns an array of URLs.Can be further customized to accept specific file types.`argTypes: { avatar: { control: { type: 'file', accept: '.png' } }}`                    |
| **enum**    | `radio`        | Provides a set of radio buttons based on the available options.`argTypes: { contact: { control: 'radio', options: ['email', 'phone', 'mail'] }}`                                                              |
|             | `inline-radio` | Provides a set of inlined radio buttons based on the available options.`argTypes: { contact: { control: 'inline-radio', options: ['email', 'phone', 'mail'] }}`                                               |
|             | `check`        | Provides a set of checkbox components for selecting multiple options.`argTypes: { contact: { control: 'check', options: ['email', 'phone', 'mail'] }}`                                                        |
|             | `inline-check` | Provides a set of inlined checkbox components for selecting multiple options.`argTypes: { contact: { control: 'inline-check', options: ['email', 'phone', 'mail'] }}`                                         |
|             | `select`       | Provides a drop-down list component to handle single value selection. `argTypes: { age: { control: 'select', options: [20, 30, 40, 50] }}`                                                                    |
|             | `multi-select` | Provides a drop-down list that allows multiple selected values. `argTypes: { countries: { control: 'multi-select', options: ['USA', 'Canada', 'Mexico'] }}`                                                   |
| **string**  | `text`         | Provides a freeform text input.`argTypes: { label: { control: 'text' }}`                                                                                                                                      |
|             | `color`        | Provides a color picker component to handle color values.Can be additionally configured to include a set of color presets.`argTypes: { color: { control: { type: 'color', presetColors: ['red', 'green']} }}` |
|             | `date`         | Provides a datepicker component to handle date selection. `argTypes: { startDate: { control: 'date' }}`                                                                                                       |

The `date` control will convert the date into a UNIX timestamp when the value changes. It's a known limitation that will be fixed in a future release. If you need to represent the actual date, you'll need to update the story's implementation and convert the value into a date object.

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import Gizmo from './Gizmo.svelte';  const { Story } = defineMeta({    argTypes: {      canRotate: {        control: 'boolean',      },      coordinates: {        control: 'object',      },      height: {        control: { max: 1500, min: 200, step: 50, type: 'range' },      },      label: {        control: 'text',      },      meshColors: {        control: {          presetColors: ['#ff0000', '#00ff00', '#0000ff'],          type: 'color',        },      },      position: {        control: 'radio',        options: ['left', 'right', 'center'],      },      rawData: {        control: 'object',      },      revisionDate: {        control: 'date',      },      rotationAxis: {        control: 'check',        options: ['x', 'y', 'z'],      },      scaling: {        control: 'select',        options: [10, 50, 75, 100, 200],      },      texture: {        control: {          accept: '.png',          type: 'file',        },      },      width: {        control: { max: 1200, min: 400, step: 50, type: 'number' },      },    },    component: Gizmo,  });</script>
```

Numeric data types will default to a `number` control unless additional configuration is provided.

###

Parameters

Controls supports the following configuration parameters, either globally or on a per-story basis:

####

Show full documentation for each property

Since Controls is built on the same engine as Storybook Docs, it can also show property documentation alongside your controls using the expanded parameter (defaults to false). This means you embed a complete `Controls` doc block in the controls panel. The description and default value rendering can be customized like the doc block.

To enable expanded mode globally, add the following to `.storybook/preview.js|ts`:

.storybook/preview.js

```svelte
export default {  parameters: {    controls: { expanded: true },  },};
```

Here's what the resulting UI looks like:

!Controls addon expanded

####

Specify initial preset color swatches

For `color` controls, you can specify an array of `presetColors`, either on the `control` in `argTypes`, or as a parameter under the `controls` namespace:

.storybook/preview.js

```svelte
export default {  parameters: {    controls: {      presetColors: [{ color: '#ff4785', title: 'Coral' }, 'rgba(0, 159, 183, 1)', '#fe4a49'],    },  },};
```

Color presets can be defined as an object with `color` and `title` or a simple CSS color string. These will then be available as swatches in the color picker. When you hover over the color swatch, you'll be able to see its title. It will default to the nearest CSS color name if none is specified.

####

Filtering controls

In specific cases, you may be required to display only a limited number of controls in the controls panel or all except a particular set.

To make this possible, you can use optional `include` and `exclude` configuration fields in the `controls` parameter, which you can define as an array of strings or a regular expression.

Consider the following story snippets:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import YourComponent from './YourComponent.svelte';  const { Story } = defineMeta({    component: YourComponent,  });</script><Story  name="ArrayInclude"  parameters={{    controls: { include: ['foo', 'bar'] },  }}/><Story  name="RegexInclude"  parameters={{    controls: { include: /^hello*/ },  }}/><Story  name="ArrayExclude"  parameters={{    controls: { exclude: ['foo', 'bar'] },  }}/><Story  name="RegexExclude"  parameters={{    controls: { exclude: /^hello*/ },  }}/>
```

####

Sorting controls

By default, controls are unsorted and use whatever order the args data is processed in (`none`). Additionally, you can sort them alphabetically by the arg's name (`alpha`) or with the required args first (`requiredFirst`).

Consider the following snippet to force required args first:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';

import YourComponent from './YourComponent.svelte';  const { Story } = defineMeta({    component: YourComponent,    parameters: { controls: { sort: 'requiredFirst' } },  });</script>
```

###

Disable controls for specific properties

Aside from the features already documented here, Controls can also be disabled for individual properties.

Suppose you want to turn off Controls for a property called `foo` in a component's story. The following example illustrates how:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';  import YourComponent from './YourComponent.svelte';  const { Story } = defineMeta({    component: YourComponent,    argTypes: {      // foo is the property we want to remove from the UI      foo: {        table: {          disable: true,        },      },    },  });</script>
```

Resulting in the following change in Storybook UI:

The previous example also removed the prop documentation from the table. In some cases, this is fine. However, sometimes you might want to render the prop documentation without a control. The following example illustrates how:

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';  import YourComponent from './YourComponent.svelte';  const { Story } = defineMeta({    component: YourComponent,    argTypes: {      // foo is the property we want to remove from the UI      foo: {        control: false,      },    },  });</script>
```

As with other Storybook properties, such as decorators, you can apply the same pattern at a story level for more granular cases.

###

Conditional controls

In some cases, it's useful to be able to conditionally exclude a control based on the value of another control. Controls supports basic versions of these use cases with the `if`, which can take a simple query object to determine whether to include the control.

Consider a collection of "advanced" settings only visible when the user toggles an "advanced" toggle.

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';  import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,    argTypes: {      label: { control: 'text' }, // Always shows the control      advanced: { control: 'boolean' },      // Only enabled if advanced is true      margin: { control: 'number', if: { arg: 'advanced' } },      padding: { control: 'number', if: { arg: 'advanced' } },      cornerRadius: { control: 'number', if: { arg: 'advanced' } },    },  });</script>
```

Or consider a constraint where if the user sets one control value, it doesn't make sense for the user to be able to set another value.

```svelte
<script module>  import { defineMeta } from '@storybook/addon-svelte-csf';  import Button from './Button.svelte';  const { Story } = defineMeta({    component: Button,    argTypes: {      // Button can be passed a label or an image, not both      label: {        control: 'text',        if: { arg: 'image', truthy: false },      },      image: {        control: { type: 'select', options: ['foo.jpg', 'bar.jpg'] },        if: { arg: 'label', truthy: false },      },    },  });</script>
```

The query object must contain either an `arg` or `global` target:

| field  | type   | meaning                       |
| ------ | ------ | ----------------------------- |
| arg    | string | The ID of the arg to test.    |
| ---    | ---    | ---                           |
| global | string | The ID of the global to test. |

It may also contain at most one of the following operators:

| operator | type    | meaning                                              |
| -------- | ------- | ---------------------------------------------------- |
| truthy   | boolean | Is the target value truthy?                          |
| ---      | ---     | ---                                                  |
| exists   | boolean | Is the target value defined?                         |
| eq       | any     | Is the target value equal to the provided value?     |
| neq      | any     | Is the target value NOT equal to the provided value? |

If no operator is provided, that is equivalent to `{ truthy: true }`.

## Troubleshooting

###

The controls are not updating the story within the auto-generated documentation

If you turned off inline rendering for your stories via the `inline` configuration option, you would run into a situation where the associated controls are not updating the story within the documentation page. This is a known limitation of the current implementation and will be addressed in a future release.

## API

###

Parameters

This addon contributes the following parameters to Storybook, under the `controls` namespace:

####

`disable`

Type: `boolean`

Disable this addon's behavior. If you wish to disable this addon for the entire Storybook, you should do so when registering `addon-essentials`. See the essential addon's docs for more information.

This parameter is most useful to allow overriding at more specific levels. For example, if this parameter is set to `true` at the project level, it could then be re-enabled by setting it to `false` at the meta (component) or story level.

####

`exclude`

Type: `string[] | RegExp`

Specifies which properties to exclude from the Controls addon panel. Any properties whose names match the regex or are part of the array will be left out. See usage example, above.

####

`expanded`

Type: `boolean`

Show the full documentation for each property in the Controls addon panel, including the description and default value. See usage example, above.

####

`include`

Type: `string[] | RegExp`

Specifies which properties to include in the Controls addon panel. Any properties whose names don't match the regex or are not part of the array will be left out. See usage example, above.

####

`presetColors`

Type: `(string | { color: string; title?: string })[]`

Specify preset color swatches for the color picker control. The color value may be any valid CSS color. See usage example, above.

####

`sort`

Type: `'none' | 'alpha' | 'requiredFirst'`

Default: `'none'`

Specifies how the controls are sorted.

- **none**: Unsorted, displayed in the same order the arg types are processed in
- **alpha**: Sorted alphabetically, by the arg type's name
- **requiredFirst**: Same as `alpha`, with any required arg types displayed first

####

`disableSaveFromUI`

Type: `boolean`

Default: `false`

Disable the ability to create or edit stories from the Controls panel.
