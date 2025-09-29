# Defining the meta

All stories files must have a "meta" (aka. "default export") defined, and its structure follows what's described in [the official docs on the subject](https://storybook.js.org/docs/api/csf#default-export). To define the meta in Svelte CSF, call the `defineMeta` function **within the module context**, with the meta properties you want:

```svelte
<script module>
//    👆 notice the module context, defineMeta does not work in a regular <script> tag - instance
import { defineMeta } from '@storybook/addon-svelte-csf';

import MyComponent from './MyComponent.svelte';
//      👇 Get the Story component from the return value
const { Story } = defineMeta({
	component: MyComponent,
	decorators: [
	/* ... */
	],
	parameters: {
	/* ... */
	},
	title: 'Path/To/MyComponent',
});
</script>
```

`defineMeta` returns an object with a `Story` component (see [Defining stories](https://github.com/storybookjs/addon-svelte-csf#defining-stories) below) that you must destructure out to use.

# Defining stories

To define stories, you use the `Story` component returned from the `defineMeta` function. Depending on what you want the story to contain, [there are multiple ways to use the `Story` component](https://github.com/storybookjs/addon-svelte-csf/blob/main/examples/Templating.stories.svelte). Common for all the use case is that all properties of [a regular CSF story](https://storybook.js.org/docs/api/csf#named-story-exports) are passed as props to the `Story` component, with the exception of the `render` function, which does not have any effect in Svelte CSF.

All story requires either the `name` prop or [`exportName` prop](https://github.com/storybookjs/addon-svelte-csf#custom-export-name).

Tip:
In versions prior to v5 of this addon, it was always required to define a template story with the `<Template>` component. This is no longer required and stories will default to render the component from `meta` if no template is set.

## Plain Story

If your component only accepts props and doesn't require snippets or slots, you can use the simple form of defining stories, only using args:

```svelte
<Story name="Primary" args={{ primary: true }} />
```

This will render the component defined in the meta, with the args passed as props.

## With children

If your component needs children, you can pass them in directly to the story, and they will be forwarded to your component:

```svelte
<Story name="With Children">I will be the child of the component from defineMeta</Story>
```

## Static template

If you need more customization of the story, like composing components or defining snippets, you can set the `asChild` prop on the Story. Instead of forwarding the children to your component, it will instead use the children directly as the story output. This allows you to write whatever component structure you desire:

```svelte
<Story name="Composed" asChild>
	<MyComponent>
		<AChild label="Hello world!" />
	</MyComponent>
</Story>
```

Important:
This format completely ignores args, as they are not passed down to any of the child components defined. Even if your story has args and Controls, they won't have an effect. See the snippet-based formats below.

## Inline snippet

If you need composition/snippets but also want a dynamic story that reacts to args or the story context, you can define a `template` snippet in the `Story` component:

```svelte
<Story name="Simple Template" args={{ simpleChild: true }}>
	{#snippet template(arguments_)}
		<MyComponent {...arguments_}>Component with args</MyComponent>
	{/snippet}
</Story>
```

## Shared snippet

Often your stories are very similar and their only differences are args or play-functions. In this case it can be cumbersome to define the same `template` snippet over and over again. You can share snippets by defining them at the top-level and passing them as props to `Story`:

```svelte
{#snippet template(arguments_)}
	<MyComponent {...arguments_}>
		{#if arguments_.simpleChild}
			<AChild data={arguments_.childProps} />
		{:else}
			<ComplexChildA data={arguments_.childProps} />
			<ComplexChildB data={arguments_.childProps} />
		{/if}
	</MyComponent>
{/snippet}

<Story name="Simple Template" args={{ simpleChild: true }} template={template} />

<Story name="Complex Template" args={{ simpleChild: false }} template={template} />
```

You can also use this pattern to define multiple templates and share the different templates among different stories.

## Default snippet

If you only need a single template that you want to share, it can be tedious to include `{template}` in each `Story` component. Like in th example below:

```svelte
<Story name="Primary" args={{ variant: 'primary' }} template={template} />
<Story name="Secondary" args={{ variant: 'secondary' }} template={template} />
<Story name="Tertiary" args={{ variant: 'tertiary' }} template={template} />

<Story name="Denary" args={{ variant: 'denary' }} template={template} />
```

Similar to regular CSF, you can define a meta-level `render`-function, by referencing your default snippet in the `render` property of your `defineMeta` call:

```svelte
<script module>
import { defineMeta } from '@storybook/addon-svelte-csf';

import MyComponent from './MyComponent.svelte';
const { Story } = defineMeta({
	render: template,
//      👆 the name of the snippet as defined below (can be any name)
});
</script>

{#snippet template(arguments_)}
	<MyComponent {...arguments_}>
		{#if arguments_.simpleChild}
			<AChild data={arguments_.childProps} />
		{:else}
			<ComplexChildA data={arguments_.childProps} />
			<ComplexChildB data={arguments_.childProps} />
		{/if}
	</MyComponent>
{/snippet}

<Story name="Simple Children" args={{ simpleChild: true }} />

<Story name="Complex Children" args={{ simpleChild: false }} />
```

Stories can still override this default snippet using any of the methods for defining story-level content.

Note:
Svelte has the limitation, that you can't reference a snippet from a `<script module>` if it reference any declarations in a non-module `<script>` (whether directly or indirectly, via other snippets). See [svelte.dev/docs/svelte/snippet#Exporting-snippets](https://svelte.dev/docs/svelte/snippet#Exporting-snippets)

## Custom export name

Behind-the-scenes, each `<Story />` definition is compiled to a variable export like `export const MyStory = ...;`. In most cases you don't have to care about this detail, however sometimes naming conflicts can arise from this. The variable names are simplifications of the story names - to make them valid JavaScript variables.

This can cause conflicts, eg. two stories with the names _"my story!"_ and _"My Story"_ will both be simplified to `MyStory`.

You can explicitly define the variable name of any story by passing the `exportName` prop:

```svelte
<Story name="my story!" exportName="MyStory1" />
<Story name="My Story" exportName="MyStory2" />
```

At least one of the `name` or `exportName` props must be passed to the `Story` component - passing both is also valid.

## Accessing Story context

If for some reason you need to access the [Story context](https://storybook.js.org/docs/writing-stories/decorators#context-for-mocking) _(e.g. for mocking)_ while rendering the story, then `<Story />`'s attribute `template` snippet provides an optional second argument.

```svelte
<Story name="Default">
  {#snippet template(args, context)}

     <MyComponent {...args}>
  {/snippet}
</Story>
```

# TypeScript

Story template snippets can be type-safe when necessary. The type of the args are inferred from the `component` or `render` property passed to `defineMeta`.

If you're just rendering the component directly without a custom template, you can use Svelte's `ComponentProps` type and `StoryContext` from the addon to make your template snippet type-safe:

```svelte
<script lang="ts" module>
import { defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';
import { type ComponentProps } from 'svelte';

import MyComponent from './MyComponent.svelte';
const { Story } = defineMeta({
	component: MyComponent,
});
type Arguments = ComponentProps<MyComponent>;
</script>

{#snippet template(arguments_: Arguments, context: StoryContext<typeof Layout>)}
	<MyComponent {...arguments_} />
{/snippet}
```

If you use the `render`-property to define a custom template that might use custom args, the args will be inferred from the types of the snippet passed to `render`. This is especially useful when you're converting primitive args to snippets:

```svelte
<script lang="ts" module>
import { defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';
import { type ComponentProps } from 'svelte';

import MyComponent from './MyComponent.svelte';
const { Story } = defineMeta({
	argTypes: {
		children: {
			control: 'text',
		},
		footer: {
			control: 'text',
		},
	},
	component: MyComponent,
	render: template, // 👈 args will be inferred from this, which is the Args type below
});
type Arguments = Omit<ComponentProps<MyComponent>, 'children' | 'footer'> & {
	children: string;
	footer?: string;
};
// OR use the Merge helper from the 'type-fest' package:
type Arguments = Merge<
	ComponentProps<MyComponent>,
	{
		children: string;
		footer?: string;
	}
>;
</script>


{#snippet template({ children, ...arguments_ }: Arguments, context: StoryContext<typeof MyComponent>)}
	<MyComponent {...arguments_}>
		{children}
		{#snippet footer()}
			{arguments_.footer}
		{/snippet}
	</MyComponent>
{/snippet}
```

See [the `Types.stories.svelte` examples](https://github.com/storybookjs/addon-svelte-csf/blob/main/examples/Types.stories.svelte) on how to use complex types properly.
