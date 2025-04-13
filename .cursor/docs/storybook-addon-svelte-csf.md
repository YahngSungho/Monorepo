# Svelte CSF

The  directory contains examples describing each feature of the addon. The  is a good one to get started with.

Svelte CSF stories files must always have the `.stories.svelte` extension.## Defining the meta

All stories files must have a "meta" (aka. "default export") defined, and its structure follows what's described in . To define the meta in Svelte CSF, call the `defineMeta` function **within the module context**, with the meta properties you want:

```svelte
<script module\>
  //    👆 notice the module context, defineMeta does not work in a regular <script> tag - instance
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MyComponent from './MyComponent.svelte';
  //      👇 Get the Story component from the return value
  const { Story } \= defineMeta({
    title: 'Path/To/MyComponent',
    component: MyComponent,
    decorators: \[
      /\* ... \*/
    \],
    parameters: {
      /\* ... \*/
    },
  });
</script\>
```

`defineMeta` returns an object with a `Story` component (see  below) that you must destructure out to use.

## Defining stories

To define stories, you use the `Story` component returned from the `defineMeta` function. Depending on what you want the story to contain, . Common for all the use case is that all properties of  are passed as props to the `Story` component, with the exception of the `render` function, which does not have any effect in Svelte CSF.

All story requires either the `name` prop or .

Tip

In versions prior to v5 of this addon, it was always required to define a template story with the `<Template>` component. This is no longer required and stories will default to render the component from `meta` if no template is set.

### Plain Story

If your component only accepts props and doesn't require snippets or slots, you can use the simple form of defining stories, only using args:

```svelte
<Story args\={{ primary: true }} name\="Primary" />
```

This will render the component defined in the meta, with the args passed as props.

### Static template

If you need more customization of the story, like composing components or defining snippets, you can pass in children to the `Story`, and write whatever component structure you desire:

```svelte
<Story name\="Composed"\>
  <MyComponent\>
    <AChild label\="Hello world!" />
  </MyComponent\>
</Story\>
```

Important

This format completely ignores args, as they are not passed down to any of the child components defined. Even if your story has args and Controls, they won't have an effect. See the snippet-based formats below.

### Inline snippet

If you need composition/snippets but also want a dynamic story that reacts to args or the story context, you can define a `children` snippet in the `Story` component:

```svelte
<Story name\="Simple Children" args\={{ simpleChild: true }}>
  {#snippet children(args)}
    <MyComponent {...args}>Component with args</MyComponent\>
  {/snippet}
</Story\>
```

### Shared snippet

Often your stories are very similar and their only differences are args or play-functions. In this case it can be cumbersome to define the same `children` snippet over and over again. You can share snippets by defining them at the top-level and passing them as props to `Story`:

```svelte
{#snippet template(args)}
  <MyComponent {...args}>
    {#if args.simpleChild}
      <AChild data\={args.childProps} />
    {:else}
      <ComplexChildA data\={args.childProps} />
      <ComplexChildB data\={args.childProps} />
    {/if}
  </MyComponent\>
{/snippet}

<Story name\="Simple Children" args\={{ simpleChild: true }} children\={template} />

<Story name\="Complex Children" args\={{ simpleChild: false }} children\={template} />
```

You can also use this pattern to define multiple templates and share the different templates among different stories.

### Default snippet

If you only need a single template that you want to share, it can be tedious to include `children={template}` in each `Story` component. Like in th example below:

```svelte
<Story args\={{ variant: 'primary' }} children\={template} name\="Primary" />
<Story args\={{ variant: 'secondary' }} children\={template} name\="Secondary" />
<Story args\={{ variant: 'tertiary' }} children\={template} name\="Tertiary" />

<Story args\={{ variant: 'denary' }} children\={template} name\="Denary" />
```

In this case you can use the `setTemplate()` helper function that sets a default template for all stories. In regular CSF terms, this is the equivalent of defining a meta-level `render`\-function versus story-level `render`\-functions:

```svelte
<script module\>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  //                   👆 import the function
  import MyComponent from './MyComponent.svelte';
  const { Story } \= defineMeta({
    /\* ... \*/
  });
</script\>

<script\>
  // 👆 note this must be within a instance (regular) <script> tag as the module context can not reference snippets defined in the markup
  setTemplate(template);
  //          👆 the name of the snippet as defined below (can be any name)
</script\>

{#snippet template(args)}
  <MyComponent {...args}>
    {#if args.simpleChild}
      <AChild data\={args.childProps} />
    {:else}
      <ComplexChildA data\={args.childProps} />
      <ComplexChildB data\={args.childProps} />
    {/if}
  </MyComponent\>
{/snippet}

<Story name\="Simple Children" args\={{ simpleChild: true }} />

<Story name\="Complex Children" args\={{ simpleChild: false }} />
```

Stories can still override this default snippet using any of the methods for defining story-level content.

### Custom export name

Behind-the-scenes, each `<Story />` definition is compiled to a variable export like `export const MyStory = ...;`. In most cases you don't have to care about this detail, however sometimes naming conflicts can arise from this. The variable names are simplifications of the story names - to make them valid JavaScript variables.

This can cause conflicts, eg. two stories with the names *"my story!"* and *"My Story"* will both be simplified to `MyStory`.

You can explicitly define the variable name of any story by passing the `exportName` prop:

```svelte
<Story exportName\="MyStory1" name\="my story!" />
<Story exportName\="MyStory2" name\="My Story" />
```

At least one of the `name` or `exportName` props must be passed to the `Story` component - passing both is also valid.

### Accessing Story context

If for some reason you need to access the  *(e.g. for mocking)* while rendering the story, then `<Story />`'s attribute `children` snippet provides an optional second argument.

```svelte
<Story name\="Default"\>
  {#snippet children(args, context)}

     <MyComponent {...args}>
  {/snippet}
</Story\>
```

## TypeScript

Story snippets and args can be type-safe when necessary. The type of the args are inferred from the component props passed to `defineMeta`.

You can make your snippets type-safe with the `Args` and `StoryContext` helper types:

```svelte
<script module lang\="ts"\>
  import { defineMeta, type Args, type StoryContext } from '@storybook/addon-svelte-csf';
  //                   👆         👆 import those type helpers from this addon -->
  import MyComponent from './MyComponent.svelte';
  const { Story } \= defineMeta({
    component: MyComponent,
  });
</script\>


{#snippet template(args: Args<typeof Story\>, context: StoryContext<typeof Story\>)}

  <MyComponent {...args} />
{/snippet}
```

If you need to customize the type of the `args`, you can pass in a generic type parameter to `defineMeta` that will override the types inferred from the component:

```svelte
const { Story } = defineMeta<{ anotherProp: boolean }>( ... );
```
