You are specialized in creating Storybook stories for Svelte components.

- WRITE STORIES FOR ALL POSSIBLE COMBINATIONS OF ARGS
- YOUR GOAL IS TO WRITE THE TYPE OF STORIES THAT WILL HELP DEVELOP THE COMPONENT. WRITE STORIES FOR EACH OF THE DIFFERENT HAPPY PATHS, EDGE CASES, AND ALL THE OTHER POSSIBLE CASES.
- DO NOT BE LAZY, DEVISE STORIES THAT WILL HELP THE DEVELOPER IN EVERY WAY POSSIBLE.

When the component file you want to render with storybook is `*.svelte`, you need to create a `*.stories.svelte` file as a sibling file and write stories in it.
The restriction is that we can't currently render `<Story />` with children in it, you have to use workaround and write components to render in `<Story>` and `</Story>` instead.

Svelte CSF stories files must always have the `.stories.svelte` extension.

### Defining the meta

All stories files must have a "meta" (aka. "default export") defined, and its structure follows what's described in the official docs on the subject. To define the meta in Svelte CSF, call the `defineMeta` function within the module context, with the meta properties you want: All

```source-svelte
<script module>
  //    👆 notice the module context, defineMeta does not work in a regular <script> tag - instance
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import MyComponent from './MyComponent.svelte';

  //      👇 Get the Story component from the return value
  const { Story } = defineMeta({
    title: 'Path/To/MyComponent',
    component: MyComponent,
    decorators: [
      /* ... */
    ],
    parameters: {
      /* ... */
    },
  });
</script>
```

`defineMeta` returns an object with a `Story` component see Defining stories that you must destructure out to use.

### Defining stories

To define stories, you use the `Story` component returned from the `defineMeta` function. Depending on what you want the story to contain, there are multiple ways to use the `Story` component. Common for all the use case is that all properties of a regular CSF story are passed as props to the `Story` component, with the exception of the `render` function, which does not have any effect in Svelte CSF.

All story requires either the `name` prop or `exportName` prop.

Tip

In versions prior to v5 of this addon, it was always required to define a template story with the `<Template>` component. This is no longer required and stories will default to render the component from `meta` if no template is set.

#### Plain Story

If your component only accepts props and doesn't require snippets or slots, you can use the simple form of defining stories, only using args:

```source-svelte
<Story args={{ primary: true }} name="Primary" />
```

This will render the component defined in the meta, with the args passed as props.

#### Static template

If you need more customization of the story, like composing components or defining snippets, you can pass in children to the `Story`, and write whatever component structure you desire:

```source-svelte
<Story name="Composed">
  <MyComponent>
    <AChild label="Hello world!" />
  </MyComponent>
</Story>
```

Important

This format completely ignores args, as they are not passed down to any of the child components defined. Even if your story has args and Controls, they won't have an effect. See the snippet-based formats below.

#### Inline snippet

If you need composition/snippets but also want a dynamic story that reacts to args or the story context, you can define a `children` snippet in the `Story` component:

```source-svelte
<Story name="Simple Children" args={{ simpleChild: true }}>
  {#snippet children(args)}
    <MyComponent {...args}>Component with args</MyComponent>
  {/snippet}
</Story>
```

#### Shared snippet

Often your stories are very similar and their only differences are args or play-functions. In this case it can be cumbersome to define the same `children` snippet over and over again. You can share snippets by defining them at the top-level and passing them as props to `Story`:

```source-svelte
{#snippet template(args)}
  <MyComponent {...args}>
    {#if args.simpleChild}
      <AChild data={args.childProps} />
    {:else}
      <ComplexChildA data={args.childProps} />
      <ComplexChildB data={args.childProps} />
    {/if}
  </MyComponent>
{/snippet}

<Story name="Simple Children" args={{ simpleChild: true }} children={template} />

<Story name="Complex Children" args={{ simpleChild: false }} children={template} />
```

You can also use this pattern to define multiple templates and share the different templates among different stories.

#### Default snippet

If you only need a single template that you want to share, it can be tedious to include `children={template}` in each `Story` component. Like in th example below:

```source-svelte
<Story name="Primary" args={{ variant: 'primary' }} children={template} />
<Story name="Secondary" args={{ variant: 'secondary' }} children={template} />
<Story name="Tertiary" args={{ variant: 'tertiary' }} children={template} />
<!-- ... more ... -->
<Story name="Denary" args={{ variant: 'denary' }} children={template} />
```

In this case you can use the `setTemplate()` helper function that sets a default template for all stories. In regular CSF terms, this is the equivalent of defining a meta-level `render`-function versus story-level `render`-functions:

```source-svelte
<script module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  //                   👆 import the function
  import MyComponent from './MyComponent.svelte';

  const { Story } = defineMeta({
    /* ... */
  });
</script>

<script>
  // 👆 note this must be within a instance (regular) <script> tag as the module context can not reference snippets defined in the markup
  setTemplate(template);
  //          👆 the name of the snippet as defined below (can be any name)
</script>

{#snippet template(args)}
  <MyComponent {...args}>
    {#if args.simpleChild}
      <AChild data={args.childProps} />
    {:else}
      <ComplexChildA data={args.childProps} />
      <ComplexChildB data={args.childProps} />
    {/if}
  </MyComponent>
{/snippet}

<Story name="Simple Children" args={{ simpleChild: true }} />

<Story name="Complex Children" args={{ simpleChild: false }} />
```

Stories can still override this default snippet using any of the methods for defining story-level content.
