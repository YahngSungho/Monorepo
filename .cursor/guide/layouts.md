# The Stack

## Problem

Flow elements require space (sometimes referred to as _white space_) to physically and conceptually separate them from the elements that come before and after them. This is the purpose of the `margin` property.

However, design systems conceive elements and components in isolation. At the time of conception, it is not settled whether there will be surrounding content or what the nature of that content will be.
One element or component is likely to appear in different contexts, and the requirement for spacing will differ.

We are in the habit of styling elements, or classes of elements, directly: we make style declarations _belong_ to elements. Typically, this does not produce any issues, but `margin` is really a property of the _relationship_ between two proximate elements. The following code is therefore problematic:

```css
p {
	margin-block-end: 1.5rem;
}
```

Since the declaration is not context sensitive, any correct application of the margin is a matter of luck. If the paragraph is proceeded by another element, the effect is desirable. But a `:last-child` paragraph produces a redundant margin. Inside a padded parent element, this redundant margin combines with the parent's padding to produce double the intended space. This is just one problem this approach produces.

## Solution

The trick is to style the context, not the individual element(s). The **Stack** layout primitive injects margin between elements via their common parent:

```css
.stack > * + * {
	margin-block-start: 1.5rem;
}
```

Using the adjacent sibling combinator (`+`), `margin-block-start` is only applied where the element is preceded by another element: no "left over" margin. The universal (or _wildcard_) selector (`*`) ensures any and all elements are affected. The key `* + *` construct is known as the owl.

### Line Height and Modular Scale

In the previous example, we used a `margin-block-start` value of `1.5rem`. We're in the habit of using this value because it reflects our (usually preferred) body text `line-height` of `1.5`.

The vertical spacing of your design should be based on your standard `line-height` because text dominates most pages' layout, making one line of text a natural denominator.

If the body text `line-height` is `1.5` (i.e. `1.5` ⨉ the `font-size`), it makes sense to use `1.5` as the ratio for your modular scale. Read the introduction to modular scale, and how it can be expressed with CSS custom properties.

_(Example Description: Imagine vertically stacked boxes where the spacing between shorter boxes corresponds to the base line-height (e.g., 1.5rem), and the spacing adjacent to taller boxes are multiples or exponents of this base value, maintaining a consistent vertical rhythm based on the modular scale.)_

### Recursion

In the previous example, the child combinator (`>`) ensures the margins only apply to children of the `.stack` element. However, it's possible to inject margins recursively by removing this combinator from the selector.

```css
.stack * + * {
	margin-block-start: 1.5rem;
}
```

This can be useful where you want to affect elements at any nesting level, while retaining white space regularity.

_(Example Description: Consider two nested boxes with borders within a recursive stack. The spacing between the outer box and the first inner box, and between the two inner boxes, is equal, demonstrating that recursion prevents doubled spacing.)_

In the following demonstration (using the Stack component to follow) there are a set of box-shaped elements. Two of these are nested within another. Because recursion is applied, each box is evenly spaced using just one parent **Stack**.

You're likely to find the recursive mode affects unwanted elements. For example, generic list items that are typically not separated by margins will become unexpectedly _spread out_.

### Nested Variants

Recursion applies the same margin no matter the nesting depth. A more deliberate approach would be to set up alternative non-recursive **Stacks** with different margin values, and nest them where suitable. Consider the following.

```css
[class^='stack'] > * {
	/* top and bottom margins in horizontal-tb writing mode */
	margin-block: 0;
}

.stack-large > * + * {
	margin-block-start: 3rem;
}

.stack-small > * + * {
	margin-block-start: 0.5rem;
}
```

The first declaration block's selector resets the vertical margin for all **Stack**-like elements (by matching class values that _begin_ with `stack`). Importantly, only the vertical margins are reset, because the stack only _affects_ vertical margin, and we don't want it to reach outside its remit. You may not need this reset if a universal reset for `margin` is already in place (see **Global and local styling**).

The following two blocks set up alternative **Stacks**, with different margin values. These can be nested to produce---for example---the illustrated form layout. Be aware that the `<label>` elements would need to have `display: block` applied to appear above the inputs, and for their margins to actually produce spaces (the vertical margin of inline elements has no effect; see **The display property**).

_(Example Description: A form layout demonstrates nested stacks. A `.stack-large` separates distinct form fields (e.g., label-input groups), while a nested `.stack-small` inside each field separates the label from its corresponding input element and potential error message.)_

In **Every Layout**, custom elements are used to implement layout components/primitives like the **Stack**. In the **Stack** component, the `space` prop (property; attribute) is used to define the spacing value. The modified classes example above is just for illustration. See the nested example.

### Exceptions

CSS works best as an exception-based language. You write far-reaching rules, then use the cascade to override these rules in special cases. As written in Managing Flow and Rhythm with CSS Custom Properties, you can create per-element exceptions within a single **Stack** context (i.e. at the same nesting level).

```css
.stack > * + * {
	margin-block-start: var(--space, 1.5em);
}

.stack-exception,
.stack-exception + * {
	--space: 3rem;
}
```

Note that we are applying the increased spacing above _and_ below the `.exception` element, where applicable. If you only wanted to increase the space above, you would remove `.exception + *`.

This works because `*` has _zero_ specificity, so `.stack > * + *` and `.stack-exception` are the same specificity and `.stack-exception` overrides `.stack > * + *` in the cascade (by appearing further down in the stylesheet).

### Splitting the Stack

By making the **Stack** a Flexbox context, we can give it one final power: the ability to add an `auto` margin to a chosen element. This way, we can group elements to the top and bottom of the vertical space. Useful for card-like components.

In the following example, we've chosen to group elements _after_ the second element towards the bottom of the space.

```css
.stack {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;

	& > * + * {
		margin-block-start: var(--space, 1.5rem);
	}

	& > :nth-child(2) {
		margin-block-end: auto;
	}
}
```

### Custom Property Placement

Importantly, despite now setting some properties on the parent `.stack` element, we're still setting the `--space` value on the children, not "hoisting" it up. If the parent is where the property is set, it will get overridden if the parent becomes a child in nesting (see **Nested variants**, above).

This can be seen working in context in the following demo depicting a presentation/slides editor. The **Cover** element on the right has a minimum height of `66.666vh`, forcing the left sidebar's height to be taller than its content. This is what produces the gap between the slide images and the _"Add slide"_ button.

Where the **Stack** is the only child of its parent, nothing forces it to _stretch_ as in the last example/demo. A height of `100%` ensures the **Stack's** height _matches_ the parent's and the split can occur.

```css
.stack:only-child {
	/* ↓ `height` in horizontal-tb writing mode */
	block-size: 100%;
}
```

## Use Cases

The potential remit of the **Stack** layout can hardly be overestimated. Anywhere elements are stacked one atop another, it is likely a **Stack** should be in effect. Only adjacent elements (such as grid cells) should not be subject to a **Stack**. The grid cells _are_ likely to be **Stacks**, however, and the grid itself a member of a **Stack**.

---

# The Box

## Problem

As I established in **Boxes**, every rendered element creates a box shape. So what is the use of a **Box** layout, encapsulated as a dedicated **Box** component?

All the ensuing layouts deal in arranging boxes _together_; distributing them in some way such that they form a composite visual structure. For example, the simple **Stack** layout takes a number of boxes and inserts vertical margin between them.

It is important the **Stack** is given no other purpose than to insert vertical margins. If it started to take on other responsibilities, its job description would become a nonsense, and the other layout primitives within the system wouldn't know how to behave around the **Stack**.

In other words, it's a question of separating concerns. Just as in computer science, in visual design it benefits your system to give each working part a dedicated and unique responsibility. The design emerges through composition.

_(Example Description: A single fundamental 'Box' concept can be composed to create various complex visual structures.)_

The **Box**'s role within this layout system is to take care of any styles that can be considered intrinsic to individual elements; styles which are not dictated, inherited, or inferred from the meta-layouts to which an individual element may be subjected. But which styles are these? It feels like they could be innumerable.

Not necessarily. While some approaches to CSS give you the power (or the _pain_, depending on your perspective) to apply any and every style to an individual element, there are plenty of styles that do not need to be written in this piecemeal way. Styles like `font-family`, `color`, and `line-height` can all be _inherited_ or otherwise applied globally, as set out in **Global and local styling**. And they should, because setting these styles on a case-by-case basis is redundant.

```css
:root {
	font-family: sans-serif;
}

.box {
	/* ↓ Not needed because the style is inherited */
	/* font-family: sans-serif; */
}
```

Of course, you are likely to employ more than one `font-family` in your design. But it is more efficient to apply default (or 'base') styles and later make _exceptions_ than to style everything like it is a special case.

Conveniently, global styles tend to be _branding_ related styles --- styles that affect the aesthetics but not the _proportions_ of the subject element(s). The purpose of this project is to explore the creation of a _layout system_ specifically, and we are not interested in branding (or aesthetics) as such. We are building dynamic, responsive wireframes. Aesthetics can be applied on top.

_(Example Description: Two boxes are shown side-by-side. They have identical dimensions (layout), but differ in their font styles and background colors (aesthetics).)_
Image caption: Same layouts; different aesthetics

This limits the number of properties we have to choose from. To reduce this set of potential properties further, we have to ask ourselves which layout-specific properties are better handled by parent or ancestor elements of the simple **Box**.

## Solution

Margin is applicable to the **Box**, but only as induced by context --- as I've already established. Width and height should also be inferred, either by an _extrinsic_ value (such as the width calculated by `flex-basis`, `flex-grow`, and `flex-shrink` working together) or by the nature of the content held _inside_ the **Box**.

Think of it like this: If you don't have anything to put in a box, you don't need a box. If you _do_ have something to put in a box, the best box is one with just enough room and no more.

### Padding

Padding is different. Padding reaches _into_ an element; it is introspective. Padding should be a **Box** styling option. The question is, how much control over `padding` for our **Box** is necessary? After all, CSS affords us `padding-top`, `padding-right`, `padding-bottom`, and `padding-left`, as well as the `padding` shorthand.

Remember we are building a layout system, and not an API for creating a layout system. CSS itself is already the API. The **Box** element should have padding on _all_ sides, or _no sides at all_. Why? Because an element with specific (and asymmetrical) padding is not a **Box**; it's something else trying to solve a more specific problem. More often than not, this problem relates to adding spacing between elements, which is what `margin` is for. Margin extends outside the element's border.

_(Example Description: A comparison shows two scenarios. Left: Using padding to create space between elements causes their borders to touch directly. Right: Using margin correctly separates the elements, including their borders.)_

In the below example, I'm using a `padding` value corresponding to the first point on my modular scale. It is applied to all sides, and has the singular purpose of moving the **Box**'s content away from its edges.

```css
.box {
	padding: var(--s1);
}
```

### The Box Model

As set out in **Boxes** you will avoid some sizing issues by applying `box-sizing: border-box`. However, this should already be applied to _all_ elements, not just the named **Box**.

```css
* {
	box-sizing: border-box;
}
```

### The Visible Box

A **Box** is only really a **Box** if it has a box-like shape. Yes, all elements are box-shaped, but a **Box** should typically _show_ you this. The most common methods use either `border` or a `background`.

Like `padding`, `border` should be applied on all sides or none at all. In cases where borders are used to _separate_ elements, they should be applied contextually, via a parent, like `margin` is in the **Stack**. Otherwise, borders will come into contact and 'double up'.

_(Example Description: Left: A simple box with a border around its perimeter. Right: The same box contains child elements. Borders are applied **only between** the child elements (e.g., using `_ + _ { border-top: ... }`), preventing borders from touching the parent's outer border or doubling up between children.)_
Image caption: By applying a `border-top` value via the `* + *` selector, only borders _between_ child elements appear. None come into contact with the parent **Box's** bordered perimeter.

If you've written CSS before, you've no doubt used `background-color` to create a visual box shape. Changing the `background-color` often requires you to change the `color` to ensure the content is still legible. This can be made easier by applying `color: inherit` to any elements inside that **Box**.

```css
.box {
	padding: var(--s1);

	& * {
		color: inherit;
	}
}
```

By forcing inheritance, you can change the `color`---along with the `background-color`---in one place: on the **Box** itself. In the following example, I am using an `.invert` class to swap the `color` and `background-color` properties. Custom properties make it possible to adjust the specific light and dark values in one place.

```css
.box {
	--color-light: rgb(238 238 238);
	--color-dark: rgb(34 34 34);

	padding: var(--s1);
	color: var(--color-dark);
	background-color: var(--color-light);

	& * {
		color: inherit;
	}

	&.invert {
		/* ↓ Dark becomes light, and light becomes dark */
		color: var(--color-light);
		background-color: var(--color-dark);
	}
}
```

### Filter Inversion

In a greyscale design, it is possible to switch between dark-on-light and light-on-dark with a simple `filter` declaration. Consider the following code:

```css
.box {
	--color-light: hsl(0deg 0% 80%);
	--color-dark: hsl(0deg 0% 20%);

	color: var(--color-dark);
	background-color: var(--color-light);

	&.invert {
		filter: invert(100%);
	}
}
```

Because `--color-light` is as light at `20%` as `--color-dark` is dark at `80%`, they are effectively opposites. When `filter: invert(100%)` is applied, they take each other's places. You can create a light/dark theme switcher with a similar technique.

_(Example Description: Two boxes are shown. The first has standard light background and dark text. The second has the `.invert` class with `filter: invert(100%)`, resulting in a dark background and light text.)_

When hue becomes involved it is inverted as well, and the effect is likely to be less desirable.

In the absence of a border, a `background-color` is insufficient for describing a box shape. This is because high contrast themes tend to eliminate backgrounds. However, by employing a transparent `outline` the box shape can be restored.

```css
.box {
	--color-light: rgb(238 238 238);
	--color-dark: rgb(34 34 34);

	padding: var(--s1);

	color: var(--color-dark);

	background-color: var(--color-light);
	outline: 0.125rem solid transparent;
	outline-offset: -0.125rem;
}
```

How does this work? When a high contrast theme is not running, the outline is invisible. The `outline` property also has no impact on layout (it grows out from the element to cover other elements if present). When Windows High Contrast Mode is switched on, it gives the outline a color and the box is drawn.

The negative `outline-offset` moves the outline _inside_ the **Box**'s perimeter so it behaves like a border and no longer increases the box's overall size.

## Use Cases

The basic, and highly prolific, use case for a **Box** is to group and demarcate some content. This content may appear as a message or 'note' among other, textual flow content, as one card in a grid of many, or as the inner wrapper of a positioned dialog element.

_(Example Description: Illustrates various uses of Box: as an inset note within a paragraph of text, as individual cells within a grid layout, and as nested containers (e.g., a Box containing a header Box and a content Box).)_

You can also combine just boxes to make some useful compositions. A **Box** with a 'header' element can be made from two sibling boxes, nested inside another, parent **Box**.

---

# The Center

## Problem

In the early days of HTML, there were a number of presentational elements; elements devised purely to affect the appearance of their content. The `<center>` was one such element, but has long since been considered obsolete. Curiously, it _is_ still supported in some browsers, including Google's Chrome. Presumably this is because Google's search homepage still uses a `<center>` to center-justify its famous search input.

Tech' giants' whimsical usage of defunct elements aside, we mostly moved away from using presentational markup in the 2000s. By making styling the responsibility of a separate technology---CSS---we were able to manage style and structure separately. Consequently, a change in art direction would no longer mean reconstituting our content.

We later discovered that styling HTML purely in terms of semantics and context was rather ambitious, and led to some unwieldy selectors like

```css
body > div > div > a {
	/*
  Link styles specifically for links
  nested two <div>s inside the body element
  */
}
```

For the sake of easier CSS maintenance and style modularity many of us adopted a compromise position using classes. Because classes can be placed on any element, we are free to style, say, a non-semantic `<div>` or a screen reader recognized `<nav>` in exactly the same way, using the same token, but without compromising on accessibility.

```html
<div class="text-align:center"></div>
<nav class="text-align:center"></nav>
```

### Naming Conventions

You'll notice my very _on the nose_ naming convention in the preceding example. My choice of naming for **utility classes** is covered in the **Measure** section. In short, the `property-name:value` structure is designed to help with recollection.

All `<center>` did, and all `text-align: center` does, is center-justify text. And for most content---especially content that includes paragraph text---you'll want to avoid it. It's terrible for readability.

But what _would_ be useful is a component that can create a horizontally centered column. With such a component, we could create a centered 'stripe' of content within any container, capping its width to preserve a reasonable measure.

## Solution

One of the easiest ways to solve for a centered column is to use `auto` margins. The `auto` keyword, as its name suggests, instructs the browser to calculate the margin for you. It's perhaps one of the most rudimentary examples of an _algorithmic_ CSS technique: one that defers to the browser's logic to determine the layout rather than 'hard coding' a specific value.

_(Example Description: Three diagrams illustrate `margin: auto`. 1) `margin-left: auto` pushes an element to the right. 2) `margin-right: auto` pushes an element to the left. 3) `margin-left: auto; margin-right: auto;` centers the element horizontally.)_

My first centered columns would use the `margin` shorthand, often on the `<body>` element.

```css
.center {
	max-inline-size: 60ch;
	margin: 0 auto;
}
```

The trouble with the shorthand property---though it saves a few bytes---is that you have to declare certain values, even when they are not applicable. It's important to only set the CSS values needed to achieve the specific layout you are attempting. You never know what inferred or inherited values you might be undoing.

For example, I might want to place my `<center-l>` custom element within a **Stack** context. **Stack** sets `margin-top` on its children, and any `<center-l>` with `margin: 0 auto` would undo that.

_(Example Description: Shows a `Center` element placed within a `Stack`. Because `margin: 0 auto` resets the top margin, the `Center` element sits flush against the element above it, ignoring the spacing intended by the `Stack`.)_

Instead, I could use the explicit `margin-left` and `margin-right` properties. Then, any vertical margins contextually applied would be preserved, and the `<center-l>` component would be primed for composition/nesting among other layout components.

```css
.center {
	max-inline-size: 60ch;
	margin-inline: auto;
}
```

Even better, I could use a single `margin-inline` logical property. As described in **Boxes**, logical properties pertain to direction and dimension mappings and are---as such---compatible with a wider range of languages. We are also using `max-inline-size` in place of `max-width`.

```css
.center {
	max-inline-size: 60ch;
	margin-inline: auto;
}
```

### Measure

The `max-inline-size` should typically---as in the preceding code example---be set in `ch`, since achieving a reasonable measure is paramount. The **Axioms** section details how to set a reasonable measure.

### Minimum `margin`

In a context narrower than `60ch`, the contents will currently be flush with either side of the parent element or viewport. Rather than letting this happen, we should ensure a _minimum_ space on either side.

I need to go about this in such a way that preserves centering, and the `60ch` maximum width. Since we can't enter `auto` into a calculation (like `calc(auto + 1rem)`), we should probably defer to padding.

_(Example Description: Two scenarios are compared. Left (Wide Viewport): The centered element has `auto` margins on both sides, plus some padding inside. Right (Narrow Viewport): The `auto` margins shrink to zero, but the internal padding remains, ensuring content doesn't touch the edges.)_

But I have to be wary of the box model. If, as suggested in **Boxes**, I have set all elements to adopt `box-sizing: border-box`, any padding added to my `<center-l>` will contribute to the `60ch` total. In other words, adding `padding` will make the _content_ of my element narrower. However, as covered in **Axioms** CSS is designed for _exceptions_. I just need to override `border-box` with `content-box`, and allow the padding to 'grow out' from the `60ch` content threshold.

_(Example Description: Compares `border-box` vs. `content-box` for a centered element with padding. Left (`border-box`): The `max-width: 60ch` includes the padding, resulting in a content area narrower than 60ch. Right (`content-box`): The `max-width: 60ch` applies only to the content area, and the padding is added \_outside_ this, preserving the 60ch measure for the text.)\_

Here's a version that preserves the `60ch` `max-width`, but ensures there are, at least, `var(--s1)` "margins" on either side (`--s1` is the first point on the custom property-based modular scale).

```css
.center {
	box-sizing: content-box;
	max-inline-size: 60ch;
	margin-inline: auto;
	padding-inline: var(--s1) var(--s1);
}
```

### Intrinsic Centering

The `auto` margin solution is time-honoured and perfectly serviceable. But there is an opportunity using the Flexbox layout module to support _intrinsic_ centering. That is, centering elements based on their natural, content-based widths. Consider the following code.

```css
.center {
	display: flex;
	flex-direction: column;
	align-items: center;

	box-sizing: content-box;
	max-inline-size: 60ch;
	margin-inline: auto;
}
```

Inside a `<center-l>` component, I would expect the contents to be arranged vertically, as a column, hence `flex-direction: column`. This allows me to set `align-items: center`, which will center any children _regardless_ of their width.

The upshot is any elements that are narrower than `60ch` will be automatically centered within the `60ch`-wide area. These elements can include naturally small elements like buttons, or elements with their own `max-width` set under `60ch`.

_(Example Description: Compares centering behavior within the `60ch` max-width area. Left (No intrinsic centering): A button element aligns to the start (left) edge of the `60ch` container. Right (Intrinsic centering with `align-items: center`): The button, being narrower than `60ch`, is horizontally centered within the container.)_
Image caption: The illustrated paragraphs are subject to `align-items: center`, but naturally take up all the available space (they are block elements with no set width).

### Accessibility

Be aware that, whenever you move content away from the left-hand edge (in a left-to-right writing direction), there's a potential accessibility issue. Where a user has zoomed the interface, it's possible the centered content will have moved out of the viewport. They may never realise it's there.

So long as your interface is flexible and responsive, and no fixed width is set on the container, the centered content should be visible in most circumstances.

## Use Cases

Whenever you wish something to be horizontally centered, the **Center** is your friend. In the following example, I am emulating the basic layout for the **Every Layout** documentation site (which you may be looking at now, unless you're reading the EPUB). It comprises a **Sidebar**, with a **Center** to the right-hand side. Elements are vertically separated in both the sidebar and the **Center** using **Stacks**.

---

# The Cluster

## Problem

Sometimes grids are an appropriate framework for laying out content, because you want that content to align strictly to the horizontal and vertical lines that are those row and column boundaries.

But not everything benefits from this prescribed rigidity --- at least not in all circumstances. Text itself cannot adhere to the strictures of a grid, because words come in different shapes and lengths. Instead, the browser's text wrapping algorithm distributes the text to fill the available space as best it can. Left-aligned text has a 'ragged' right edge, because each line will inevitably be of a different length.

Thanks to leading (`line-height`) and word spaces (the `U+0020` character, or a `SPACE` keypress to you), words can be reasonably evenly spaced, despite their diversity of form. Where we am dealing with groups of _elements_ of an indeterminate size/shape, we should often like them to distribute in a similarly fluid way.

One approach is to set these elements' `display` value to `inline-block`. This gives you some control over `padding` and `margin` while retaining intrinsic sizing. That is, `inline-block` elements are still sized according to the dimensions of their content.

However, like words, `inline-block` elements are still separated by space characters (where present in the source). The width of this space will be added to any `margin` you apply. This space can be removed, but only by setting `font-size: 0` on the parent, and resetting the value on the children.

```css
.parent {
	font-size: 0;

	& > * {
		font-size: 1rem;
	}
}
```

This has the disadvantage that we can't use `em` on my child elements because it would be equal to `0`. Instead, we need to set the `font-size` relative to the `:root` element with the `rem` unit. Font size having to be reset in this fashion is somewhat restrictive.

Even with the space eliminated, there are still wrapping-related margin issues. If margin is applied to successive elements, the appearance is acceptable where _no_ wrapping occurs. But where wrapping does occur, there are unexpected indents against the aligned side, and vertical spacing is missing entirely.

_(Example Description: Shows `inline-block` elements with margins wrapping onto multiple lines. The second line starts indented due to the left margin of the first element on that line, and there's no vertical space between the lines.)_

A partial fix is possible by placing right and bottom margins on each element.

_(Example Description: Shows the same wrapping scenario, but with right and bottom margins applied. The indent on the left is gone, but vertical spacing issues might remain, and extra space appears on the right/bottom.)_

However, this only solves the left-aligned case --- plus doubled-up space occurs where excess margin interacts with the padding of a parent element:

_(Example Description: A container Box with padding holds the wrapping `inline-block` elements (with right/bottom margins). The right and bottom margins of the elements add to the container's padding, creating visibly larger gaps on those sides.)_

## Solution

To create an efficient and manageable design system, we need to devise robust, _general_ solutions to our layout problems.

First, we make the parent a Flexbox context. This allows us to configure the elements into clusters, without having to deal with undesirable word spaces. It also has several advantages over using floats: we do not need to provide a clear fix for one, and vertical alignment (using `align-items`) is possible.

```css
.cluster {
	display: flex;
	flex-wrap: wrap;
}
```

### Adding and Obscuring Margin

The only way we can currently add margins that respect wrapping behaviour, irrespective of the alignment chosen, is to add them _symmetrically_; to all sides. Unfortunately, this separates the elements from any edge with which they come into contact.

_(Example Description: Shows elements within a flex container (`flex-wrap: wrap`) where each element has margin on all four sides. When elements align to the start/end or top/bottom edges of the container, the margin creates unwanted space between the element and the container edge.)_

Note the value of the space between a child element and a parent element's edge is always _half_ that of the space between two child elements (since their margins combine together). The solution is to use a negative margin on the parent to _pull_ the children to its own edges:

_(Example Description: Illustrates the negative margin technique. Arrows indicate that a negative margin applied to the flex container effectively pulls the child elements outwards, cancelling the unwanted space caused by their symmetrical margins along the container edges.)_

We can make authoring space in the **Cluster** component easier by using custom properties. The `--space` variable defines the desired spacing between elements, and `calc()` adapts this value accordingly. Note that a further wrapper element is included to _insulate_ adjacent content from the negative margin. We still want the component to respect white space applied by a parent **Stack** component.

```css
/* Old technique using negative margins */
.cluster-wrapper {
	/* Added wrapper */
	--space: 1rem;

	overflow: hidden; /* Contain negative margin */
}

.cluster {
	display: flex;
	flex-wrap: wrap;
	/* ↓ multiply by -1 to negate the halved value */
	margin: calc(var(--space) / 2 * -1);

	& > * {
		/* ↓ half the value, because of the 'doubling up' */
		margin: calc(var(--space) / 2);
	}
}
```

### The `gap` Property

I think you'll agree the above technique is a bit unwieldy. It can also cause the horizontal scrollbar to appear, under some circumstances. Fortunately, as of mid-2021, all major browsers now support the `gap` property with Flexbox. The `gap` property injects spacing _between_ the child elements, doing away with the need for both negative margins and the additional wrapper element. Even the `calc()` can be retired, since the `gap` value is just that!

```css
/* Modern technique using gap */
.cluster {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space, 1rem);
}
```

### Fallback Values

See how we're defining and declaring the `gap` value all in one line. The second argument to the `var()` function is the fallback value for when the variable is otherwise undefined.

### Graceful Degradation

Despite the reassuring support picture for `gap`, we should be mindful of the layout in browsers where it isn't supported. Problematically, `gap` may be supported for the Grid layout module (see **Grid**) but not for Flexbox, so using `gap` in a `@supports` block can give a false positive.

In browsers where `gap` is only supported for the Grid module, the following would lead to no margin _or_ `gap` being applied.

```css
/* This won't work reliably for flex gap fallback */
.cluster {
	display: flex;
	flex-wrap: wrap;

	& > * {
		margin: 0.5rem; /* Attempt fallback */
	}
}

@supports (gap: 1rem) {
	.cluster {
		gap: var(--space, 1rem); /* Apply gap */
		& > * {
			margin: 0; /* Remove margin if gap supported */
		}
	}
}
```

As of today, we recommend using `gap` without feature detection, accepting that layouts will become _flush_ in older browsers. We include the negative margin technique above if that's your preference instead.

### Justification

Groups or _clusters_ of elements can take any `justify-content` value, and the space/gap will be honored regardless of wrapping. Aligning the **Cluster** to the right would be a case for `justify-content: flex-end`.

In the demo to follow, a **Cluster** contains a list of linked keywords. This is placed inside a box with a `padding` value equal to that of the **Cluster's** space.

```html
<!-- Example: Cluster for tags -->
<div class="box" style="padding: 1rem;">
  <div class="cluster" style="--space: 1rem; justify-content: flex-start;">
    <a href="#">Layout</a>
    <a href="#">CSS</a>
    <a href="#">Web Design</a>
    <a href="#">Code</a>
    <a href="#">Front-end</a>
    <a href="#">Development</a>
  </div>
</div>
```

## Use Cases

**Cluster** components suit any groups of elements that differ in length and are liable to wrap. Buttons that appear together at the end of forms are ideal candidates, as well as lists of tags, keywords, or other meta information. Use the **Cluster** to align any groups of horizontally laid out elements to the left or right, or in the center.

By applying `justify-content: space-between` and `align-items: center` you can even set out your page header's logo and navigation. This will wrap naturally, and without the need for an `@media` breakpoint:

_(Example Description: Shows a header layout using Cluster with `justify-content: space-between`. In a wide viewport, the logo is on the left and navigation links are on the right. In a narrow viewport, the navigation links wrap below the logo, maintaining consistent spacing thanks to `gap`.)_
Image caption: The navigation list will wrap below the logo at the point there is no room for its unwrapped content (its maximum width). This means we avoid the scenario where navigation links appear both beside _and_ below the logo.

---

# The Sidebar

## Problem

When the dimensions and settings of the medium for your visual design are indeterminate, even something simple like _putting things next to other things_ is a quandary. Will there be enough horizontal space? And, even if there is, will the layout make the most of the _vertical_ space?

_(Example Description: The left example shows the content overflowing where there are too many adjacent elements. The right example shows the unsightly gaps produced when there are adjacent elements of different heights)_

Where there's not enough space for two adjacent items, we tend to employ a breakpoint (a width-based `@media` query) to reconfigure the layout, and place the two items one atop the other.

It's important we use _content_ rather than _device_ based `@media` queries. That is, we should intervene anywhere the content needs reconfiguration, rather than adhering to arbitrary widths like `720px` and `1024px`. The massive proliferation of devices means there's no real set of standard dimensions to design for.

But even this strategy has a fundamental shortcoming: `@media` queries for width pertain to the _viewport_ width, and have no bearing on the actual available space. A component might appear within a `300px` wide container, or it might appear within a more generous `500px` wide container. But the width of the viewport is the same in either case, so there's nothing to "respond" to.

_(Example Description: Shows two viewports of the same width. In one, the component takes up the whole width, in the next it is constrained by a narrow container)_

Design systems tend to catalogue components that can appear between different contexts and spaces, so this is a real problem. Only with a capability like the mooted container queries might we teach our component layouts to be fully _context aware_.

In some respects, the CSS Flexbox module, with its provision of `flex-basis`, can already govern its own layout, per context, rather well. Consider the following code:

```css
.parent {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex: 1 1 30ch;
	}
}
```

The `flex-basis` value essentially determines an _ideal_ target width for the subject child elements. With growing, shrinking, and wrapping enabled, the available space is used up such that each element is as _close_ to `30ch` wide as possible. In a `> 90ch` wide container, more than three children may appear per row. Between `60ch` and `90ch` only two items can appear, with one item taking up the whole of the final row (if the total number is odd).

_(Example Description: At more than 90ch, there are three items per row. At less than 90ch, there are 5 items, with two items per row except the last row, which is taken up entirely by the last item)_

By designing to _ideal_ element dimensions, and tolerating reasonable variance, you can essentially do away with `@media` breakpoints. Your component handles its own layout, intrinsically, and without the need for manual intervention. Many of the layouts we're covering finesse this basic mechanism to give you more precise control over placement and wrapping.

For instance, we might want to create a classic sidebar layout, wherein one of two adjacent elements has a fixed width, and the other---the _principle_ element, if you will---takes up the rest of the available space. This should be responsive, without `@media` breakpoints, and we should be able to set a _container_ based breakpoint for wrapping the elements into a vertical configuration.

## Solution

The **Sidebar** layout is named for the element that forms the diminutive _sidebar_: the narrower of two adjacent elements. It is a _quantum_ layout, existing simultaneously in one of the two configurations---horizontal and vertical---illustrated below. Which configuration is adopted is not known at the time of conception, and is dependent entirely on the space it is afforded when placed within a parent container.

_(Example Description: The left configuration is in a wide context and the elements are next to each other. The right configuration is in a narrow context and the elements are above and below each other.)_

Where there is enough space, the two elements appear side-by-side. Critically, the sidebar's width is _fixed_ while the two elements are adjacent, and the non-sidebar takes up the rest of the available space. But when the two elements wrap, _each_ takes up `100%` of the shared container.

### Equal height

Note the two adjacent elements are the same height, regardless of the content they contain. This is thanks to a default `align-items` value of `stretch`. In most cases, this is desirable (and was very difficult to achieve before the advent of Flexbox). However, you can "switch off" this behavior with `align-items: flex-start`.

_(Example Description: The left example has align-items stretch and the two adjacent elements are the same height despite different heights of content. In the right example, the two elements are at their natural height)_

How to force wrapping at a certain point, we will come to shortly. First, we need to set up the horizontal layout.

```css
.with-sidebar {
	display: flex;
	flex-wrap: wrap;
}

.sidebar {
	flex-basis: 20rem;
	flex-grow: 1;
}

.not-sidebar {
	flex-basis: 0;
	flex-grow: 999;
}
```

The key thing to understand here is the role of _available space_. Because the `.not-sidebar` element's `flex-grow` value is so high (`999`), it takes up all the available space. The `flex-basis` value of the `.sidebar` element is not counted as available space and is subtracted from the total, hence the sidebar-like layout. The non-sidebar essentially squashes the sidebar down to its ideal width.

_(Example Description: The sidebar width is marked as n. The width of the accompanying element is all of the available space, or space minus n.)_

The `.sidebar` element is still technically allowed to grow, and is able to do so where `.not-sidebar` wraps beneath it. To control where that wrapping happens, we can use `min-inline-size`, which is equivalent to `min-width` in the default `horizontal-tb` writing mode.

```css
.not-sidebar {
	flex-basis: 0;
	flex-grow: 999;
	min-inline-size: 50%;
}
```

Where `.not-sidebar` is destined to be less than or equal to `50%` of the container's width, it is forced onto a new line/row and grows to take up all of its space. The value can be anything, but `50%` is apt since a sidebar ceases to be a sidebar when it is no longer the narrower of the two elements.

_(Example Description: On the left, a legitimate sidebar, where the accompanying element is wider than 50% of the container. On the right, a narrower viewport has made it a false sidebar, because the accompanying element takes up less than 50% of the width.)_

### The gutter

So far, we're treating the two elements as if they're touching. Instead, we might want to place a gutter/space between them. Since we want that space to appear between the elements regardless of the configuration and we _don't_ want there to be extraneous margins on the outer edges, we'll use the `gap` property as we did for the **Cluster** layout.

For a gutter of `1rem`, the CSS now looks like the following.

```css
.with-sidebar {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}

.sidebar {
	/* ↓ The width when the sidebar _is_ a sidebar */
	flex-basis: 20rem;
	flex-grow: 1;
}

.not-sidebar {
	/* ↓ Grow from nothing */
	flex-basis: 0;
	flex-grow: 999;
	/* ↓ Wrap when the elements are of equal width */
	min-inline-size: 50%;
}
```

### Intrinsic sidebar width

So far, we have been prescribing the width of our sidebar element (`flex-basis: 20rem`, in the last example). Instead, we might want to let the sidebar's _content_ determine its width. Where we do not provide a `flex-basis` value at all, the sidebar's width is equal to the width of its contents. The wrapping behavior remains the same.

_(Example Description: The sidebar is shown to be the width of the image found inside it)_

If we set the width of an image inside of our sidebar to `15rem`, that will be the width of the sidebar in the horizontal configuration. It will grow to `100%` in the vertical configuration.

### Intrinsic web design

The term _Intrinsic Web Design_ was coined by Jen Simmons, and refers to a recent move towards tools and mechanisms in CSS that are more befitting of the medium. The kind of _algorithmic_, self-governing layouts set out in this series might be considered intrinsic design methods.

The term _intrinsic_ connotes introspective processes; calculations made by the layout pattern about itself. My use of 'intrinsic' in this section specifically refers to the inevitable width of an element as determined by its contents. A button's width, unless explicitly set, is the width of what's inside it.

The CSS Box Sizing Module was formerly called the Intrinsic & Extrinsic Sizing Module, because it set out how elements can be sized both intrinsically and extrinsically. Generally, we should err on the side of intrinsic sizing. As covered in **Axioms**, we're better allowing the browser to size elements according to their content, and only provide _suggestions_, rather than _prescriptions_, for layout. We are _outsiders_.

## Use cases

The **Sidebar** is applicable to all sorts of content. The ubiquitous "media object" (the placing of an item of media next to a description) is a mainstay, but it can also be used to align buttons with form inputs (where the button forms the sidebar and has an _intrinsic_, content-based width).

---

# The Switcher

## Solution

As we set out in **Boxes**, it's better to provide _suggestions_ rather than diktats about the way the visual design is laid out. An overuse of `@media` breakpoints can easily come about when we try to _fix_ designs to different contexts and devices. By only suggesting to the browser how it should arrange our layout boxes, we move from creating multiple layouts to single _quantum_ layouts existing simultaneously in different states.

The `flex-basis` property is an especially useful tool when adopting such an approach. A declaration of `width: 20rem` means just that: make it `20rem` wide --- regardless of circumstance. But `flex-basis: 20rem` is more nuanced. It tells the browser to consider `20rem` as an ideal or "target" width. It is then free to calculate just how closely the `20rem` target can be resembled given the content and available space. You empower the browser to make the right decision for the content, and the user, reading that content, given their circumstances.

Consider the following code.

```css
.grid {
	display: flex;
	flex-wrap: wrap;

	& > * {
		inline-size: 33.333%;
	}
}

@media (width <= 60rem) {
	.grid > * {
		inline-size: 50%;
	}
}

@media (width <= 30rem) {
	.grid > * {
		inline-size: 100%;
	}
}
```

The mistake here (aside from not using the logical property `inline-size` in place of `width`) is to adopt an _extrinsic_ approach to the layout: we are thinking about the viewport first, then adapting our boxes to it. It's verbose, unreliable, and doesn't make the most of Flexbox's capabilities.

With `flex-basis`, it's easy to make a responsive Grid-like layout which is in no need of `@media` breakpoint intervention. Consider this alternative code:

```css
.grid {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex: 1 1 20rem;
	}
}
```

Now I'm thinking _intrinsically_ --- in terms of the subject elements' own dimensions. That `flex` shorthand property translates to _"let each element grow and shrink to fill the space, but try to make it about `20rem` wide"_. Instead of manually pairing the column count to the viewport width, I'm telling the browser to _generate_ the columns based on my desired column width. I've automated my layout.

As Zoe Mickley Gillenwater has pointed out, `flex-basis`, in combination with `flex-grow` and `flex-shrink`, achieves something similar to an element/container query in that "breaks" occur, implicitly, according to the available space rather than the viewport width. My Flexbox "grid" will automatically adopt a different layout depending on the size of the container in which it is placed. Hence: _quantum layout_.

### Issues with two-dimensional symmetry

While this is a serviceable layout mechanism, it only produces two layouts wherein each element is the same width:

- The single-column layout (given the narrowest of containers)
- The regular multi-column layout (where each row has an equal number of columns)

In other cases, the number of elements and the available space conspire to make layouts like these:

_(Example Description: On the left is a layout of two rows of elements. The first row has three items and the second row has just two. On the right there is a similar layout, except the final row is just one row-long item)_

This is not _necessarily_ a problem that needs to be solved, depending on the brief. So long as the content configures itself to remain in the space, unobscured, the most important battle has been won. However, for smaller numbers of subject elements, there may be cases where you wish to switch _directly_ from a horizontal (one row) to a vertical (one column) layout and bypass the intermediary states.

Any element that has wrapped and grown to adopt a different width could be perceived by the user as being "picked out"; made to deliberately look different, or more important. We should want to avoid this confusion.

_(Example Description: Diagram shows a horizontal line of three elements bypassing an intermediate layout (of two items and the third item on its own row) to form a single-column layout)_

The **Switcher** element (based on the bizarrely named Flexbox Holy Albatross) switches a Flexbox context between a horizontal and a vertical layout at a given, _container_-based breakpoint. That is, if the breakpoint is `30rem`, the layout will switch to a vertical configuration when the parent element is less than `30rem` wide.

In order to achieve this switch, first a basic horizontal layout is instated, with wrapping and `flex-grow` enabled:

```css
.switcher > * {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex-grow: 1;
	}
}
```

The `flex-basis` value enters the (current) width of the container, expressed as `100%`, into a calculation with the designated `30rem` breakpoint.

```text
30rem - 100%
```

Depending on the parsed value of `100%`, this will return either a _positive_ or _negative_ value: positive if the container is narrower than `30rem`, or negative if it is wider. This number is then multiplied by `999` to produce either a _very large_ positive number or a _very large_ negative number:

```text
(30rem - 100%) * 999
```

Here is the `flex-basis` declaration in situ:

```css
.switcher > * {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex-basis: calc((30rem - 100%) * 999);
		flex-grow: 1;
	}
}
```

A negative `flex-basis` value is invalid, and dropped. Thanks to CSS's resilient error handling this means just the `flex-basis` line is ignored, and the rest of the CSS is still applied. The erroneous negative `flex-basis` value is corrected to `0` and---because `flex-grow` is present---each element grows to take up an equal proportion of horizontal space.

### Content width

The previous statement, _"each element grows to take up an equal proportion of the horizontal space"_ is true where the _content_ of any one element does not exceed that alloted proportion. To keep things in order, nested elements can be given a `max-inline-size` of `100%`.

_(Example Description: In the first diagram, a long nested element makes its element take up more space than the other adjacent elements. In the second diagram, this nested element has been given max-width 100%, making its parent and its parents siblings of equal width.)_

If, on the other hand, the calculated `flex-basis` value is a large positive number, each element _maxes out_ to take up a whole row. This results in the vertical configuration. Intermediary configurations are successfully bypassed.

_(Example Description: Diagram shows that flex-basis negative n times 999 results in the horizontal configuration and positive n times 999 results in the vertical configuration)_

### Gutters

To support margins ('gutters'; 'gaps') between the subject elements, we could adapt the negative margin technique covered in the **Cluster** documentation. However, the `flex-basis` calculation would need to be adapted to compensate for the increased width produced by _stretching_ the parent element. That is, by applying negative margins on all sides, the parent becomes wider than _its_ container and their `100%` values no longer match.

```css
.switcher {
	--threshold: 30rem;
	--space: 1rem;

	& > * {
		display: flex;
		flex-wrap: wrap;
		/* ↓ Multiply by -1 to make negative */
		margin: calc(var(--space) / 2 * -1);

		& > * {
			flex-basis: calc((var(--threshold) - (100% - var(--space))) * 999);
			flex-grow: 1;
			/* ↓ Half the value to each element, combining to make the whole */
			margin: calc(var(--space) / 2);
		}
	}
}
```

Instead, since `gap` is now supported in all major browsers, we don't have to worry about such calculations any more. The `gap` property represents the browser making such calculations for us. And it allows us to cut both the HTML and CSS code down quite a bit.

```css
.switcher {
	--threshold: 30rem;

	display: flex;
	flex-wrap: wrap;
	gap: 1rem;

	& > * {
		flex-basis: calc((var(--threshold) - 100%) * 999);
		flex-grow: 1;
	}
}
```

### Managing proportions

There is no reason why one or more of the elements, when in a horizontal configuration, cannot be alloted more or less of the available space. By giving the second element (`:nth-child(2)`) `flex-grow: 2` will become twice as wide as its siblings (and the siblings will shrink to compensate).

```css
.switcher > :nth-child(2) {
	flex-grow: 2;
}
```

_(Example Description: In the horizontal configuration, the second of three adjacent elements has flex 2, and is therefore twice as wide as the others.)_

### Quantity threshold

In the horizontal configuration, the amount of space alloted each element is determined by two things:

- The total space available (the width of the container)
- The number of sibling elements

So far, my **Switcher** _switches_ according to the available space. But we can add as many elements as we like, and they will lay out together horizontally above the breakpoint (or _threshold_). The more elements we add, the less space each gets alloted, and things can easily start to get squashed up.

This is something that could be addressed in documentation, or by providing warning or error messages in the developer's console. But that isn't very efficient or robust. Better to _teach_ the layout to handle this problem itself. The aim for each of the layouts in this project is to make them as self-governing as possible.

It is quite possible to style each of a group of sibling elements based on how many siblings there are in total. The technique is something called a quantity query. Consider the following code.

```css
.switcher > :nth-last-child(n + 5),
.switcher > :nth-last-child(n + 5) ~ * {
	flex-basis: 100%;
}
```

Here, we are applying a `flex-basis` of `100%` to each element, only where there are **five or more elements in total**. The `nth-last-child(n+5)` selector targets any elements that are more than 4 from the _end_ of the set. Then, the general sibling combinator (`~`) applies the same rule to the rest of the elements (it matches anything after `:nth-last-child(n+5)`). If there are fewer that 5 items, no `:nth-last-child(n+5)` elements and the style is not applied.

_(Example Description: Counting from the right back to the start, n + 5 matches any element starting at the 5th last element. If these elements are matched, you can use them to select all of the rest of the elements with the general sibling (~) combinator.)_

Now the layout has two kinds of threshold that it can handle, and is twice as robust as a result.

## Use cases

There are any number of situations in which you might want to switch directly between a horizontal and vertical layout. But it is especially useful where each element should be considered equal, or part of a continuum. Card components advertising products should share the same width no matter the orientation, otherwise one or more cards could be perceived as highlighted or featured in some way.

A set of numbered steps is also easier on cognition if those steps are laid out along one horizontal or vertical line.

---

# The Cover

## Problem

For years, there was consternation about how hard it was to horizontally and vertically center something with CSS. It was used by detractors of CSS as a kind of exemplary "proof" of its shortcomings.

The truth is, there are numerous ways to center content with CSS. However, there are only so many ways you can do it without fear of overflows, overlaps, or other such breakages. For example, we could use `relative` positioning and a `transform` to vertically center an element within a parent:

```css
.parent {
	/* ↓ Give the parent the height of the viewport */
	block-size: 100vb;

	& > .child {
		position: relative;
		/* ↓ Push the element down 50% of the parent */
		inset-block-start: 50%;
		/* ↓ Then adjust it by 50% of its own height */
		transform: translateY(-50%);
	}
}
```

What's neat about this is the `translateY(-50%)` part, which compensates for the height of the element itself---no matter what that height is. What's less than neat is the top and bottom overflow produced when the child element's content makes it taller than the parent. We have not, so far, designed the layout to tolerate dynamic content.

_(Example Description: On the left, the child element is shorter than the container, so fits in its vertical center. On the right, it is taller. It is still central, but breaches the top and bottom edges of the parent and overflows.)_

Perhaps the most robust method is to combine Flexbox's `justify-content: center` (horizontal) and `align-items: center` (vertical).

```css
.centered {
	display: flex;
	align-items: center;
	justify-content: center;
}
```

### Proper handling of height

Just applying the Flexbox CSS will not, on its own, have a visible effect on vertical centering because, by default, the `.centered` element's height is determined by the height of its content (implicitly, `block-size: auto`). This is something sometimes referred to as _intrinsic sizing_, and is covered in more detail in the **Sidebar** layout documentation.

Setting a fixed height---as in the unreliable `transform` example from before---would be foolhardy: we don't know ahead of time how much content there will be, or how much vertical space it will take up. In other words, there's nothing stopping overflow from happening.

_(Example Description: On the left, the child element is in the vertical center of the 100vh high parent. On the right, the element is taller than 100vh and breaches the bottom edge to overflow.)_

Instead, we can set a `min-block-size` (`min-height` in the `horizontal-tb` writing mode). This way, the element will expand vertically to accommodate the content, wherever the natural (`auto`) height happens to be more than the `min-block-size`. Where this happens, the provision of some vertical padding ensures the centered content does not meet the edges.

_(Example Description: On the left, the child element is not as tall as the parent's min-height, so appears in the vertical center. On the right, the parent element has grown past its min-height to accommodate a taller child.)_

### Box sizing

To ensure the parent element retains a height of `100vh`, despite the additional padding, a `box-sizing: border-box` value must be applied. Where it is not, the padding is _added_ to the total height.

The `box-sizing: border-box` is so desirable, it is usually applied to all elements in a global declaration block. The use of the `*` (universal) selector means all elements are affected.

```css
* {
	box-sizing: border-box;
	/* other global styles */
}
```

This is perfectly serviceable where only one centered element is in contention. But we have a habit of wanting to include other elements, above and below the centered one. Perhaps it's a close button in the top right, or a "read more" indicator in the bottom center. In any case, I need to handle these cases in a modular fashion, and without producing breakages.

## Solution

What I need is a layout component that can handle vertically centered content (under a `min-block-size` threshold) and can accommodate top/header and bottom/footer elements. To make the component truly _composable_ I should be able to add and remove these elements in the HTML without having to _also_ adapt the CSS. It should be modular, and therefore not a coding imposition on content editors.

The **Cover** component is a Flexbox context with `flex-direction: column`. This declaration means child elements are laid out vertically rather than horizontally. In other words, the 'flow direction' of the Flexbox formatting context is returned to that of a standard block element.

```css
.cover {
	display: flex;
	flex-direction: column;
}
```

The **Cover** has one _principal_ element that should always gravitate towards the center. In addition, it can have one top/header element and/or one bottom/footer element.

_(Example Description: Each of the four possible configurations. In each case, the principal element is in the center.)_

How do we manage all these cases without having to adapt the CSS? First, we give the centered element (`h1` in the example, but it can be any element) `auto` margins. This can be done in one declaration using `margin-block`:

```css
.cover {
	display: flex;
	flex-direction: column;

	& > h1 {
		margin-block: auto;
	}
}
```

These _push_ the element away from anything above and below it, moving it into the center of the available space. Critically, it will _push off_ the inside edge of a parent _or_ the top/bottom edge of a sibling element.

_(Example Description: On the left, vertical auto margins place the child element in the exact vertical center. On the right, a header element is in place. The centered element is in the vertical center of the available space)_

All that remains is to ensure there is space between the (up to) three child elements where the `min-block-size` threshold has been breached.

_(Example Description: The header and footer elements have small margins. As the principal (centered) element grows, these margins keep the elements apart.)_

Currently, the `auto` margins simply collapse down to nothing. Since we can't enter `auto` into a `calc()` function to adapt the margin (`calc(auto + 1rem)` is invalid), the best we can do is to add `margin` to the header and footer elements contextually.

```css
.cover > * {
	margin-block: 1rem;
}

.cover > h1 {
	margin-block: auto;
}

.cover > :first-child:not(h1) {
	margin-block-start: 0;
}

.cover > :last-child:not(h1) {
	margin-block-end: 0;
}
```

Note, the use of the cascade, specificity and negation to target the correct elements. First, we apply top and bottom margins to all the children, using a universal child selector. We then override this for the to-be-centered (`h1`) element to achieve the `auto` margins. Finally, we use the `:not()` function to remove extraneous margin from the top and bottom elements _only_ if they are _not_ the centered element. If there is a centered element and a footer element, but no header element, the centered element will be the `:first-child` and must retain `margin-block-start: auto`.

### Shorthands

Notice how we use `margin-block: 1rem` and not `margin: 1rem 0`. The reason is that _this component_ only cares about the vertical margins to achieve its layout. By making the inline (horizontal in the default writing mode) margins `0`, we might be unduly undoing styles applied or inherited by an ancestor component.

Only set what you need to set.

Now it is safe to add spacing around the inside of the **Cover** container using `padding`. Whether there are one, two or three elements present, spacing now remains _symmetrical_, and our component modular without styling intervention.

```css
.cover {
	min-block-size: 100vb;
	padding: 1rem;
}
```

The `min-block-size` is set to `100vh`, so that the element _covers_ 100% of the viewport's height (hence the name). However, there's no reason why the `min-block-size` cannot be set to another value. `100vh` is considered a _sensible default_, and is the default value for the `minHeight` prop in the custom element implementation to come.

### Horizontal centering

So far I've not tackled horizontal centering, and that's quite deliberate. Layout components should try to solve just one problem---and the modular centering problem is a peculiar one. The **Center** layout handles horizontal centering and can be used in composition with the **Cover**. You might wrap the **Cover** in a **Center** or make a **Center** one or more of its children. It's all about _composition_.

## Use cases

A typical use for the **Cover** would be to create the "above the fold" introductory content for a web page. In the following demo, a nested **Cluster** element is used to lay out the logo and navigation menu. In this case, a utility class (`.text-align\:center`) is used to horizontally center the `<h1>` and footer elements.

It might be that you treat each section of the page as a **Cover**, and use the Intersection Observer API to animate aspects of the cover as it comes into view. A simple implementation is provided below (where the `data-visible` attribute is added as the element comes into view).

```javascript
if ('IntersectionObserver' in globalThis) {
	const targets = Array.from(document.querySelectorAll('cover-l'))
	for (const t of targets) t.dataset.observe = ''
	const callback = (entries, observer) => {
		for (const entry of entries) {
			entry.target.dataset.visible = entry.isIntersecting
		}
	}
	const observer = new IntersectionObserver(callback)
	for (const t of targets) observer.observe(t)
}
```

---

# The Grid

## Problem

Designers sometimes talk about designing _to a grid_. They put the grid---a matrix of horizontal and vertical lines---in place first, then they populate that space, making the words and pictures span the boxes those intersecting lines create.

_(Example Description: Different shaped areas of content fitting over different areas of a grid)_

A 'grid first' approach to layout is only really tenable where two things are known ahead of time:

1. The space
2. The content

For a paper-destined magazine layout, like the one described in **Axioms**, these things are attainable. For a screen and device-independent web layout containing dynamic (read: changeable) content, they fundamentally are not.

The CSS Grid module is radical because it lets you place content anywhere within a predefined grid, and as such brings _designing to a grid_ to the web. But the more particular and deliberate the placement of grid content, the more manual adjustment, in the form of `@media` breakpoints, is needed to adapt the layout to different spaces. Either the grid definition itself, the position of content within it, or both will have to be changed by hand, and with additional code.

As I covered in **The Switcher**, `@media` breakpoints pertain to viewport dimensions only, and not the immediate available space offered by a parent container. That means layout components defined using `@media` breakpoints are fundamentally not context independent: a huge issue for a modular design system.

It is not, even theoretically, possible to design _to a grid_ in a context-independent, automatically responsive fashion. However, it's possible to create basic grid-like formations: sets of elements divided into both columns and rows.

_(Example Description: On the left: a grid marked out with dotted lines labeled 'a grid for content'. On the right: a grid made up of black boxes labeled 'a grid of content')_

Compromise is inevitable, so it's a question of finding the most archetypal yet efficient solution.

### Flexbox for grids

Using Flexbox, I can create a grid formation using `flex-basis` to determine an _ideal_ width for each of the grid cells:

```css
.flex-grid {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex: 1 1 30ch;
	}
}
```

The `display: flex` declaration defines the Flexbox context, `flex-wrap: wrap` allows wrapping, and `flex: 1 1 30ch` says, _"the ideal width should be 30ch, but items should be allowed to grow and shrink according to the space available"_. Importantly, the number of columns is not prescribed based on a fixed grid schematic; it's determined _algorithmically_ based on the `flex-basis` and the available space. The content and the context define the grid, not a human arbiter.

In **The Switcher**, we identified an interaction between _wrapping_ and _growth_ that leads items to 'break' the grid shape under certain circumstances:

_(Example Description: On the left is a layout of two rows of elements. The first row has three items and the second row has just two. On the right there is a similar layout, except the final row is just one row-long item)_

On the one hand, the layout takes up all its container's horizontal space, and there are no unsightly gaps. On the other, a generic grid formation should probably make each of its items align to both the horizontal and vertical rules.

### Mitigation

You'll recall the global measure rule explored in the **Axioms** section. This ensured all applicable elements could not become wider than a comfortably readable line-length.

Where a grid-like layout created with Flexbox results in a full-width `:last-child` element, the measure of its contained text elements would be in danger of becoming too long. Not with that global measure style in place. The benefit of global rules (_axioms_) is in not having to consider each design principle per-layout. Many are already taken care of.

_(Example Description: The first row of the grid has two boxes. In each, the text takes up the full width. The last row has one box taking up all the width. Its text is narrower than its width)_

### _Grid_ for grids

The aptly named CSS Grid module brings us closer to a 'true' responsive grid formation in one specific sense: It's possible to make items grow, shrink, and wrap together _without_ breaching the column boundaries.

_(Example Description: The flex version's vertical gutters are not continuous, because the columns grow to be different widths. The grid version does have equal width columns, but this results in gaps where there are too few cells to complete the grid)_

This behavior is closer to the archetypal responsive grid I have in mind, and will be the layout we pursue here. There's just one major implementation issue to quash. Consider the following code.

```css
.grid {
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

This is the pattern, which I first discovered in Jen Simmon's Layout Land video series. To break it down:

1. **`display: grid`:** sets the grid context, which makes grid cells for its children.
2. **`grid-gap`:** places a 'gutter' _between_ each grid item (saving us from having to employ the negative margin technique first described in **The Cluster**).
3. **`grid-template-columns`:** Would ordinarily define a rigid grid for _designing to_, but used with `repeat` and `auto-fit` allows the dynamic spawning and wrappping of columns to create a behavior similar to the preceding Flexbox solution.
4. **`minmax`:** This function ensures each column, and therefore each cell of content shares a width between a minimum and maximum value. Since `1fr` represents one part of the available space, columns grow together to fill the container.

The shortcoming of this layout is the minimum value in `minmax()`. Unlike `flex-basis`, which allows any amount of growing or shrinking from a single 'ideal' value, `minmax()` sets a scope with hard limits.

Without a fixed minimum (`250px`, in this case) there's nothing to _trigger_ the wrapping. A value of `0` would just produce one row of ever-diminishing widths. But it being a fixed minimum has a clear consequence: in any context narrower than the minimum, overflow will occur.

_(Example Description: Single column of boxes breaches the right hand edge of the browser viewport)_

To put it simply: the pattern as it stands can only safely produce layouts where the columns converge on a width that is below the estimated minimum for the container. About `250px` is reasonably safe because most handheld device viewports are no wider. But what if I want my columns to grow considerably beyond this width, where the space is available? With Flexbox and `flex-basis` that is quite possible, but with CSS Grid it is not without assistance.

## Solution

Each of the layouts described so far in **Every Layout** have handled sizing and wrapping with just CSS, and without `@media` queries. Sometimes it's not possible to rely on CSS alone for automatic reconfiguration. In these circumstances, turning to `@media` breakpoints is out of the question, because it undermines the modularity of the layout system. Instead, I _might_ defer to JavaScript. But I should do so _judiciously_, and using progressive enhancement.

`ResizeObserver` (soon to be available in most modern browsers) is a highly optimized API for tracking and responding to changes in element dimensions. It is the most efficient method yet for creating container queries with JavaScript. I wouldn't recommend using it as a matter of course, but employed _only_ for solving tricky layout issues is acceptable.

Consider the following code:

```css
.grid {
	display: grid;
	gap: 1rem;

	&.aboveMin {
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
	}
}
```

The `aboveMin` class presides over an overriding declaration that produces the responsive grid. `ResizeObserver` is then instructed to add and remove the `aboveMin` class depending on the container width. The minimum value of `500px` (in the above example) is _only_ applied where the container itself is wider than that threshold. Here is a standalone function to activate the `ResizeObserver` on a grid element.

```javascript
function observeGrid(gridNode) {
	// Feature detect ResizeObserver
	if ('ResizeObserver' in globalThis) {
		// Get the min value from data-min="[min]"
		const { min } = gridNode.dataset
		// Create a proxy element to measure and convert
		// the `min` value (which might be em, rem, etc) to `px`
		const test = document.createElement('div')
		test.style.width = min
		gridNode.append(test)
		const minToPixels = test.offsetWidth
		test.remove()
		const ro = new ResizeObserver((entries) => {
			for (let entry of entries) {
				// Get the element's current dimensions
				const cr = entry.contentRect
				// `true` if the container is wider than the minimum
				const isWide = cr.width > minToPixels
				// toggle the class conditionally
				gridNode.classList.toggle('aboveMin', isWide)
			}
		})
		ro.observe(gridNode)
	}
}
```

If `ResizeObserver` is not supported, the fallback one-column layout is applied perpetually. This basic fallback is included here for brevity, but you could instead fallback to the serviceable-but-imperfect Flexbox solution covered in the previous section. In any case, no content is lost or obscured, and you have the ability to use larger `minmax()` minimum values for more expressive grid formations. And since we're no longer bound to absolute limits, we can begin employing relative units.

_(Example Description: On the left, a grid formation is created with minmax(250px, 1fr). On the right, the viewport is narrower that 250px, but the cells are 100% width, meaning nothing is overflowing.)_

Here's an example initialization (code is elided for brevity):

```html
<div class="grid" data-min="250px">

</div>
<script>
  const grid = document.querySelector('.grid');
  observeGrid(grid);
</script>
```

### The `min()` function

While it is worth covering `ResizeObserver` because it may serve you well in other circumstances, it is actually no longer needed to solve this particular problem. That's because we have the recently widely adopted CSS `min()` function. Sorry for the wild goose chase but we can, in fact, write this layout without JavaScript after all.

As a fallback, we configure the grid into a single column. Then we use `@supports` to test for `min()` and enhance from there:

```css
.grid {
	display: grid;
	gap: 1rem;
}

@supports (width: min(250px, 100%)) {
	.grid {
		grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
	}
}
```

The way `min()` works is it calculates the _shortest length_ from a set of comma-separated values. That is: `min(250px, 100%)` would return `100%` where `250px` evaluates as _higher_ than the evaluated `100%`. This useful little algorithm _decides for us_ where the width must be capped at `100%`.

### `<watched-box>`

If you are looking for a general solution for container queries, I have created `<watched-box>`. It's straightforward and declarative, and it supports any CSS length units.

It is recommended `<watched-box>` is used as a "last resort" manual override. In all but unusual cases, one of the purely CSS-based layouts documented in **Every Layout** will provide context sensitive layout automatically.

## Use cases

Grids are great for browsing teasers for permalinks or products. I can quickly compose a card component to house each of my teasers using a **Box** and a **Stack**.

---

# The Sidebar

## Problem

When the dimensions and settings of the medium for your visual design are indeterminate, even something simple like _putting things next to other things_ is a quandary. Will there be enough horizontal space? And, even if there is, will the layout make the most of the _vertical_ space?

_(Example Description: The left example shows the content overflowing where there are too many adjacent elements. The right example shows the unsightly gaps produced when there are adjacent elements of different heights)_

Where there's not enough space for two adjacent items, we tend to employ a breakpoint (a width-based `@media` query) to reconfigure the layout, and place the two items one atop the other.

It's important we use _content_ rather than _device_ based `@media` queries. That is, we should intervene anywhere the content needs reconfiguration, rather than adhering to arbitrary widths like `720px` and `1024px`. The massive proliferation of devices means there's no real set of standard dimensions to design for.

But even this strategy has a fundamental shortcoming: `@media` queries for width pertain to the _viewport_ width, and have no bearing on the actual available space. A component might appear within a `300px` wide container, or it might appear within a more generous `500px` wide container. But the width of the viewport is the same in either case, so there's nothing to "respond" to.

_(Example Description: Shows two viewports of the same width. In one, the component takes up the whole width, in the next it is constrained by a narrow container)_

Design systems tend to catalogue components that can appear between different contexts and spaces, so this is a real problem. Only with a capability like the mooted container queries might we teach our component layouts to be fully _context aware_.

In some respects, the CSS Flexbox module, with its provision of `flex-basis`, can already govern its own layout, per context, rather well. Consider the following code:

```css
.parent {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex: 1 1 30ch;
	}
}
```

The `flex-basis` value essentially determines an _ideal_ target width for the subject child elements. With growing, shrinking, and wrapping enabled, the available space is used up such that each element is as _close_ to `30ch` wide as possible. In a `> 90ch` wide container, more than three children may appear per row. Between `60ch` and `90ch` only two items can appear, with one item taking up the whole of the final row (if the total number is odd).

_(Example Description: At more than 90ch, there are three items per row. At less than 90ch, there are 5 items, with two items per row except the last row, which is taken up entirely by the last item)_

By designing to _ideal_ element dimensions, and tolerating reasonable variance, you can essentially do away with `@media` breakpoints. Your component handles its own layout, intrinsically, and without the need for manual intervention. Many of the layouts we're covering finesse this basic mechanism to give you more precise control over placement and wrapping.

For instance, we might want to create a classic sidebar layout, wherein one of two adjacent elements has a fixed width, and the other---the _principle_ element, if you will---takes up the rest of the available space. This should be responsive, without `@media` breakpoints, and we should be able to set a _container_ based breakpoint for wrapping the elements into a vertical configuration.

## Solution

The **Sidebar** layout is named for the element that forms the diminutive _sidebar_: the narrower of two adjacent elements. It is a _quantum_ layout, existing simultaneously in one of the two configurations---horizontal and vertical---illustrated below. Which configuration is adopted is not known at the time of conception, and is dependent entirely on the space it is afforded when placed within a parent container.

_(Example Description: The left configuration is in a wide context and the elements are next to each other. The right configuration is in a narrow context and the elements are above and below each other.)_

Where there is enough space, the two elements appear side-by-side. Critically, the sidebar's width is _fixed_ while the two elements are adjacent, and the non-sidebar takes up the rest of the available space. But when the two elements wrap, _each_ takes up `100%` of the shared container.

### Equal height

Note the two adjacent elements are the same height, regardless of the content they contain. This is thanks to a default `align-items` value of `stretch`. In most cases, this is desirable (and was very difficult to achieve before the advent of Flexbox). However, you can "switch off" this behavior with `align-items: flex-start`.

_(Example Description: The left example has align-items stretch and the two adjacent elements are the same height despite different heights of content. In the right example, the two elements are at their natural height)_

How to force wrapping at a certain point, we will come to shortly. First, we need to set up the horizontal layout.

```css
.with-sidebar {
	display: flex;
	flex-wrap: wrap;
}

.sidebar {
	flex-basis: 20rem;
	flex-grow: 1;
}

.not-sidebar {
	flex-basis: 0;
	flex-grow: 999;
}
```

The key thing to understand here is the role of _available space_. Because the `.not-sidebar` element's `flex-grow` value is so high (`999`), it takes up all the available space. The `flex-basis` value of the `.sidebar` element is not counted as available space and is subtracted from the total, hence the sidebar-like layout. The non-sidebar essentially squashes the sidebar down to its ideal width.

_(Example Description: The sidebar width is marked as n. The width of the accompanying element is all of the available space, or space minus n.)_

The `.sidebar` element is still technically allowed to grow, and is able to do so where `.not-sidebar` wraps beneath it. To control where that wrapping happens, we can use `min-inline-size`, which is equivalent to `min-width` in the default `horizontal-tb` writing mode.

```css
.not-sidebar {
	flex-basis: 0;
	flex-grow: 999;
	min-inline-size: 50%;
}
```

Where `.not-sidebar` is destined to be less than or equal to `50%` of the container's width, it is forced onto a new line/row and grows to take up all of its space. The value can be anything, but `50%` is apt since a sidebar ceases to be a sidebar when it is no longer the narrower of the two elements.

_(Example Description: On the left, a legitimate sidebar, where the accompanying element is wider than 50% of the container. On the right, a narrower viewport has made it a false sidebar, because the accompanying element takes up less than 50% of the width.)_

### The gutter

So far, we're treating the two elements as if they're touching. Instead, we might want to place a gutter/space between them. Since we want that space to appear between the elements regardless of the configuration and we _don't_ want there to be extraneous margins on the outer edges, we'll use the `gap` property as we did for the **Cluster** layout.

For a gutter of `1rem`, the CSS now looks like the following.

```css
.with-sidebar {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}

.sidebar {
	/* ↓ The width when the sidebar _is_ a sidebar */
	flex-basis: 20rem;
	flex-grow: 1;
}

.not-sidebar {
	/* ↓ Grow from nothing */
	flex-basis: 0;
	flex-grow: 999;
	/* ↓ Wrap when the elements are of equal width */
	min-inline-size: 50%;
}
```

### Intrinsic sidebar width

So far, we have been prescribing the width of our sidebar element (`flex-basis: 20rem`, in the last example). Instead, we might want to let the sidebar's _content_ determine its width. Where we do not provide a `flex-basis` value at all, the sidebar's width is equal to the width of its contents. The wrapping behavior remains the same.

_(Example Description: The sidebar is shown to be the width of the image found inside it)_

If we set the width of an image inside of our sidebar to `15rem`, that will be the width of the sidebar in the horizontal configuration. It will grow to `100%` in the vertical configuration.

### Intrinsic web design

The term _Intrinsic Web Design_ was coined by Jen Simmons, and refers to a recent move towards tools and mechanisms in CSS that are more befitting of the medium. The kind of _algorithmic_, self-governing layouts set out in this series might be considered intrinsic design methods.

The term _intrinsic_ connotes introspective processes; calculations made by the layout pattern about itself. My use of 'intrinsic' in this section specifically refers to the inevitable width of an element as determined by its contents. A button's width, unless explicitly set, is the width of what's inside it.

The CSS Box Sizing Module was formerly called the Intrinsic & Extrinsic Sizing Module, because it set out how elements can be sized both intrinsically and extrinsically. Generally, we should err on the side of intrinsic sizing. As covered in **Axioms**, we're better allowing the browser to size elements according to their content, and only provide _suggestions_, rather than _prescriptions_, for layout. We are _outsiders_.

## Use cases

The **Sidebar** is applicable to all sorts of content. The ubiquitous "media object" (the placing of an item of media next to a description) is a mainstay, but it can also be used to align buttons with form inputs (where the button forms the sidebar and has an _intrinsic_, content-based width).

---

# The Switcher

## Solution

As we set out in **Boxes**, it's better to provide _suggestions_ rather than diktats about the way the visual design is laid out. An overuse of `@media` breakpoints can easily come about when we try to _fix_ designs to different contexts and devices. By only suggesting to the browser how it should arrange our layout boxes, we move from creating multiple layouts to single _quantum_ layouts existing simultaneously in different states.

The `flex-basis` property is an especially useful tool when adopting such an approach. A declaration of `width: 20rem` means just that: make it `20rem` wide --- regardless of circumstance. But `flex-basis: 20rem` is more nuanced. It tells the browser to consider `20rem` as an ideal or "target" width. It is then free to calculate just how closely the `20rem` target can be resembled given the content and available space. You empower the browser to make the right decision for the content, and the user, reading that content, given their circumstances.

Consider the following code.

```css
.grid {
	display: flex;
	flex-wrap: wrap;

	& > * {
		inline-size: 33.333%;
	}
}

@media (width <= 60rem) {
	.grid > * {
		inline-size: 50%;
	}
}

@media (width <= 30rem) {
	.grid > * {
		inline-size: 100%;
	}
}
```

The mistake here (aside from not using the logical property `inline-size` in place of `width`) is to adopt an _extrinsic_ approach to the layout: we are thinking about the viewport first, then adapting our boxes to it. It's verbose, unreliable, and doesn't make the most of Flexbox's capabilities.

With `flex-basis`, it's easy to make a responsive Grid-like layout which is in no need of `@media` breakpoint intervention. Consider this alternative code:

```css
.grid {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex: 1 1 20rem;
	}
}
```

Now I'm thinking _intrinsically_ --- in terms of the subject elements' own dimensions. That `flex` shorthand property translates to _"let each element grow and shrink to fill the space, but try to make it about `20rem` wide"_. Instead of manually pairing the column count to the viewport width, I'm telling the browser to _generate_ the columns based on my desired column width. I've automated my layout.

As Zoe Mickley Gillenwater has pointed out, `flex-basis`, in combination with `flex-grow` and `flex-shrink`, achieves something similar to an element/container query in that "breaks" occur, implicitly, according to the available space rather than the viewport width. My Flexbox "grid" will automatically adopt a different layout depending on the size of the container in which it is placed. Hence: _quantum layout_.

### Issues with two-dimensional symmetry

While this is a serviceable layout mechanism, it only produces two layouts wherein each element is the same width:

- The single-column layout (given the narrowest of containers)
- The regular multi-column layout (where each row has an equal number of columns)

In other cases, the number of elements and the available space conspire to make layouts like these:

_(Example Description: On the left is a layout of two rows of elements. The first row has three items and the second row has just two. On the right there is a similar layout, except the final row is just one row-long item)_

This is not _necessarily_ a problem that needs to be solved, depending on the brief. So long as the content configures itself to remain in the space, unobscured, the most important battle has been won. However, for smaller numbers of subject elements, there may be cases where you wish to switch _directly_ from a horizontal (one row) to a vertical (one column) layout and bypass the intermediary states.

Any element that has wrapped and grown to adopt a different width could be perceived by the user as being "picked out"; made to deliberately look different, or more important. We should want to avoid this confusion.

_(Example Description: Diagram shows a horizontal line of three elements bypassing an intermediate layout (of two items and the third item on its own row) to form a single-column layout)_

The **Switcher** element (based on the bizarrely named Flexbox Holy Albatross) switches a Flexbox context between a horizontal and a vertical layout at a given, _container_-based breakpoint. That is, if the breakpoint is `30rem`, the layout will switch to a vertical configuration when the parent element is less than `30rem` wide.

In order to achieve this switch, first a basic horizontal layout is instated, with wrapping and `flex-grow` enabled:

```css
.switcher > * {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex-grow: 1;
	}
}
```

The `flex-basis` value enters the (current) width of the container, expressed as `100%`, into a calculation with the designated `30rem` breakpoint.

```text
30rem - 100%
```

Depending on the parsed value of `100%`, this will return either a _positive_ or _negative_ value: positive if the container is narrower than `30rem`, or negative if it is wider. This number is then multiplied by `999` to produce either a _very large_ positive number or a _very large_ negative number:

```text
(30rem - 100%) * 999
```

Here is the `flex-basis` declaration in situ:

```css
.switcher > * {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex-basis: calc((30rem - 100%) * 999);
		flex-grow: 1;
	}
}
```

A negative `flex-basis` value is invalid, and dropped. Thanks to CSS's resilient error handling this means just the `flex-basis` line is ignored, and the rest of the CSS is still applied. The erroneous negative `flex-basis` value is corrected to `0` and---because `flex-grow` is present---each element grows to take up an equal proportion of horizontal space.

### Content width

The previous statement, _"each element grows to take up an equal proportion of the horizontal space"_ is true where the _content_ of any one element does not exceed that alloted proportion. To keep things in order, nested elements can be given a `max-inline-size` of `100%`.

_(Example Description: In the first diagram, a long nested element makes its element take up more space than the other adjacent elements. In the second diagram, this nested element has been given max-width 100%, making its parent and its parents siblings of equal width.)_

If, on the other hand, the calculated `flex-basis` value is a large positive number, each element _maxes out_ to take up a whole row. This results in the vertical configuration. Intermediary configurations are successfully bypassed.

_(Example Description: Diagram shows that flex-basis negative n times 999 results in the horizontal configuration and positive n times 999 results in the vertical configuration)_

### Gutters

To support margins ('gutters'; 'gaps') between the subject elements, we could adapt the negative margin technique covered in the **Cluster** documentation. However, the `flex-basis` calculation would need to be adapted to compensate for the increased width produced by _stretching_ the parent element. That is, by applying negative margins on all sides, the parent becomes wider than _its_ container and their `100%` values no longer match.

```css
.switcher {
	--threshold: 30rem;
	--space: 1rem;

	& > * {
		display: flex;
		flex-wrap: wrap;
		/* ↓ Multiply by -1 to make negative */
		margin: calc(var(--space) / 2 * -1);

		& > * {
			flex-basis: calc((var(--threshold) - (100% - var(--space))) * 999);
			flex-grow: 1;
			/* ↓ Half the value to each element, combining to make the whole */
			margin: calc(var(--space) / 2);
		}
	}
}
```

Instead, since `gap` is now supported in all major browsers, we don't have to worry about such calculations any more. The `gap` property represents the browser making such calculations for us. And it allows us to cut both the HTML and CSS code down quite a bit.

```css
.switcher {
	--threshold: 30rem;

	display: flex;
	flex-wrap: wrap;
	gap: 1rem;

	& > * {
		flex-basis: calc((var(--threshold) - 100%) * 999);
		flex-grow: 1;
	}
}
```

### Managing proportions

There is no reason why one or more of the elements, when in a horizontal configuration, cannot be alloted more or less of the available space. By giving the second element (`:nth-child(2)`) `flex-grow: 2` will become twice as wide as its siblings (and the siblings will shrink to compensate).

```css
.switcher > :nth-child(2) {
	flex-grow: 2;
}
```

_(Example Description: In the horizontal configuration, the second of three adjacent elements has flex 2, and is therefore twice as wide as the others.)_

### Quantity threshold

In the horizontal configuration, the amount of space alloted each element is determined by two things:

- The total space available (the width of the container)
- The number of sibling elements

So far, my **Switcher** _switches_ according to the available space. But we can add as many elements as we like, and they will lay out together horizontally above the breakpoint (or _threshold_). The more elements we add, the less space each gets alloted, and things can easily start to get squashed up.

This is something that could be addressed in documentation, or by providing warning or error messages in the developer's console. But that isn't very efficient or robust. Better to _teach_ the layout to handle this problem itself. The aim for each of the layouts in this project is to make them as self-governing as possible.

It is quite possible to style each of a group of sibling elements based on how many siblings there are in total. The technique is something called a quantity query. Consider the following code.

```css
.switcher > :nth-last-child(n + 5),
.switcher > :nth-last-child(n + 5) ~ * {
	flex-basis: 100%;
}
```

Here, we are applying a `flex-basis` of `100%` to each element, only where there are **five or more elements in total**. The `nth-last-child(n+5)` selector targets any elements that are more than 4 from the _end_ of the set. Then, the general sibling combinator (`~`) applies the same rule to the rest of the elements (it matches anything after `:nth-last-child(n+5)`). If there are fewer that 5 items, no `:nth-last-child(n+5)` elements and the style is not applied.

_(Example Description: Counting from the right back to the start, n + 5 matches any element starting at the 5th last element. If these elements are matched, you can use them to select all of the rest of the elements with the general sibling (~) combinator.)_

Now the layout has two kinds of threshold that it can handle, and is twice as robust as a result.

## Use cases

There are any number of situations in which you might want to switch directly between a horizontal and vertical layout. But it is especially useful where each element should be considered equal, or part of a continuum. Card components advertising products should share the same width no matter the orientation, otherwise one or more cards could be perceived as highlighted or featured in some way.

A set of numbered steps is also easier on cognition if those steps are laid out along one horizontal or vertical line.

---

# The Cover

## Problem

For years, there was consternation about how hard it was to horizontally and vertically center something with CSS. It was used by detractors of CSS as a kind of exemplary "proof" of its shortcomings.

The truth is, there are numerous ways to center content with CSS. However, there are only so many ways you can do it without fear of overflows, overlaps, or other such breakages. For example, we could use `relative` positioning and a `transform` to vertically center an element within a parent:

```css
.parent {
	/* ↓ Give the parent the height of the viewport */
	block-size: 100vb;

	& > .child {
		position: relative;
		/* ↓ Push the element down 50% of the parent */
		inset-block-start: 50%;
		/* ↓ Then adjust it by 50% of its own height */
		transform: translateY(-50%);
	}
}
```

What's neat about this is the `translateY(-50%)` part, which compensates for the height of the element itself---no matter what that height is. What's less than neat is the top and bottom overflow produced when the child element's content makes it taller than the parent. We have not, so far, designed the layout to tolerate dynamic content.

_(Example Description: On the left, the child element is shorter than the container, so fits in its vertical center. On the right, it is taller. It is still central, but breaches the top and bottom edges of the parent and overflows.)_

Perhaps the most robust method is to combine Flexbox's `justify-content: center` (horizontal) and `align-items: center` (vertical).

```css
.centered {
	display: flex;
	align-items: center;
	justify-content: center;
}
```

### Proper handling of height

Just applying the Flexbox CSS will not, on its own, have a visible effect on vertical centering because, by default, the `.centered` element's height is determined by the height of its content (implicitly, `block-size: auto`). This is something sometimes referred to as _intrinsic sizing_, and is covered in more detail in the **Sidebar** layout documentation.

Setting a fixed height---as in the unreliable `transform` example from before---would be foolhardy: we don't know ahead of time how much content there will be, or how much vertical space it will take up. In other words, there's nothing stopping overflow from happening.

_(Example Description: On the left, the child element is in the vertical center of the 100vh high parent. On the right, the element is taller than 100vh and breaches the bottom edge to overflow.)_

Instead, we can set a `min-block-size` (`min-height` in the `horizontal-tb` writing mode). This way, the element will expand vertically to accommodate the content, wherever the natural (`auto`) height happens to be more than the `min-block-size`. Where this happens, the provision of some vertical padding ensures the centered content does not meet the edges.

_(Example Description: On the left, the child element is not as tall as the parent's min-height, so appears in the vertical center. On the right, the parent element has grown past its min-height to accommodate a taller child.)_

### Box sizing

To ensure the parent element retains a height of `100vh`, despite the additional padding, a `box-sizing: border-box` value must be applied. Where it is not, the padding is _added_ to the total height.

The `box-sizing: border-box` is so desirable, it is usually applied to all elements in a global declaration block. The use of the `*` (universal) selector means all elements are affected.

```css
* {
	box-sizing: border-box;
	/* other global styles */
}
```

This is perfectly serviceable where only one centered element is in contention. But we have a habit of wanting to include other elements, above and below the centered one. Perhaps it's a close button in the top right, or a "read more" indicator in the bottom center. In any case, I need to handle these cases in a modular fashion, and without producing breakages.

## Solution

What I need is a layout component that can handle vertically centered content (under a `min-block-size` threshold) and can accommodate top/header and bottom/footer elements. To make the component truly _composable_ I should be able to add and remove these elements in the HTML without having to _also_ adapt the CSS. It should be modular, and therefore not a coding imposition on content editors.

The **Cover** component is a Flexbox context with `flex-direction: column`. This declaration means child elements are laid out vertically rather than horizontally. In other words, the 'flow direction' of the Flexbox formatting context is returned to that of a standard block element.

```css
.cover {
	display: flex;
	flex-direction: column;
}
```

The **Cover** has one _principal_ element that should always gravitate towards the center. In addition, it can have one top/header element and/or one bottom/footer element.

_(Example Description: Each of the four possible configurations. In each case, the principal element is in the center.)_

How do we manage all these cases without having to adapt the CSS? First, we give the centered element (`h1` in the example, but it can be any element) `auto` margins. This can be done in one declaration using `margin-block`:

```css
.cover {
	display: flex;
	flex-direction: column;

	& > h1 {
		margin-block: auto;
	}
}
```

These _push_ the element away from anything above and below it, moving it into the center of the available space. Critically, it will _push off_ the inside edge of a parent _or_ the top/bottom edge of a sibling element.

_(Example Description: On the left, vertical auto margins place the child element in the exact vertical center. On the right, a header element is in place. The centered element is in the vertical center of the available space)_

All that remains is to ensure there is space between the (up to) three child elements where the `min-block-size` threshold has been breached.

_(Example Description: The header and footer elements have small margins. As the principal (centered) element grows, these margins keep the elements apart.)_

Currently, the `auto` margins simply collapse down to nothing. Since we can't enter `auto` into a `calc()` function to adapt the margin (`calc(auto + 1rem)` is invalid), the best we can do is to add `margin` to the header and footer elements contextually.

```css
.cover > * {
	margin-block: 1rem;
}

.cover > h1 {
	margin-block: auto;
}

.cover > :first-child:not(h1) {
	margin-block-start: 0;
}

.cover > :last-child:not(h1) {
	margin-block-end: 0;
}
```

Note, the use of the cascade, specificity and negation to target the correct elements. First, we apply top and bottom margins to all the children, using a universal child selector. We then override this for the to-be-centered (`h1`) element to achieve the `auto` margins. Finally, we use the `:not()` function to remove extraneous margin from the top and bottom elements _only_ if they are _not_ the centered element. If there is a centered element and a footer element, but no header element, the centered element will be the `:first-child` and must retain `margin-block-start: auto`.

### Shorthands

Notice how we use `margin-block: 1rem` and not `margin: 1rem 0`. The reason is that _this component_ only cares about the vertical margins to achieve its layout. By making the inline (horizontal in the default writing mode) margins `0`, we might be unduly undoing styles applied or inherited by an ancestor component.

Only set what you need to set.

Now it is safe to add spacing around the inside of the **Cover** container using `padding`. Whether there are one, two or three elements present, spacing now remains _symmetrical_, and our component modular without styling intervention.

```css
.cover {
	min-block-size: 100vb;
	padding: 1rem;
}
```

The `min-block-size` is set to `100vh`, so that the element _covers_ 100% of the viewport's height (hence the name). However, there's no reason why the `min-block-size` cannot be set to another value. `100vh` is considered a _sensible default_, and is the default value for the `minHeight` prop in the custom element implementation to come.

### Horizontal centering

So far I've not tackled horizontal centering, and that's quite deliberate. Layout components should try to solve just one problem---and the modular centering problem is a peculiar one. The **Center** layout handles horizontal centering and can be used in composition with the **Cover**. You might wrap the **Cover** in a **Center** or make a **Center** one or more of its children. It's all about _composition_.

## Use cases

A typical use for the **Cover** would be to create the "above the fold" introductory content for a web page. In the following demo, a nested **Cluster** element is used to lay out the logo and navigation menu. In this case, a utility class (`.text-align\:center`) is used to horizontally center the `<h1>` and footer elements.

It might be that you treat each section of the page as a **Cover**, and use the Intersection Observer API to animate aspects of the cover as it comes into view. A simple implementation is provided below (where the `data-visible` attribute is added as the element comes into view).

```javascript
if ('IntersectionObserver' in globalThis) {
	const targets = Array.from(document.querySelectorAll('cover-l'))
	for (const t of targets) t.dataset.observe = ''
	const callback = (entries, observer) => {
		for (const entry of entries) {
			entry.target.dataset.visible = entry.isIntersecting
		}
	}
	const observer = new IntersectionObserver(callback)
	for (const t of targets) observer.observe(t)
}
```

---

# The Grid

## Problem

Designers sometimes talk about designing _to a grid_. They put the grid---a matrix of horizontal and vertical lines---in place first, then they populate that space, making the words and pictures span the boxes those intersecting lines create.

_(Example Description: Different shaped areas of content fitting over different areas of a grid)_

A 'grid first' approach to layout is only really tenable where two things are known ahead of time:

1. The space
2. The content

For a paper-destined magazine layout, like the one described in **Axioms**, these things are attainable. For a screen and device-independent web layout containing dynamic (read: changeable) content, they fundamentally are not.

The CSS Grid module is radical because it lets you place content anywhere within a predefined grid, and as such brings _designing to a grid_ to the web. But the more particular and deliberate the placement of grid content, the more manual adjustment, in the form of `@media` breakpoints, is needed to adapt the layout to different spaces. Either the grid definition itself, the position of content within it, or both will have to be changed by hand, and with additional code.

As I covered in **The Switcher**, `@media` breakpoints pertain to viewport dimensions only, and not the immediate available space offered by a parent container. That means layout components defined using `@media` breakpoints are fundamentally not context independent: a huge issue for a modular design system.

It is not, even theoretically, possible to design _to a grid_ in a context-independent, automatically responsive fashion. However, it's possible to create basic grid-like formations: sets of elements divided into both columns and rows.

_(Example Description: On the left: a grid marked out with dotted lines labeled 'a grid for content'. On the right: a grid made up of black boxes labeled 'a grid of content')_

Compromise is inevitable, so it's a question of finding the most archetypal yet efficient solution.

### Flexbox for grids

Using Flexbox, I can create a grid formation using `flex-basis` to determine an _ideal_ width for each of the grid cells:

```css
.flex-grid {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex: 1 1 30ch;
	}
}
```

The `display: flex` declaration defines the Flexbox context, `flex-wrap: wrap` allows wrapping, and `flex: 1 1 30ch` says, _"the ideal width should be 30ch, but items should be allowed to grow and shrink according to the space available"_. Importantly, the number of columns is not prescribed based on a fixed grid schematic; it's determined _algorithmically_ based on the `flex-basis` and the available space. The content and the context define the grid, not a human arbiter.

In **The Switcher**, we identified an interaction between _wrapping_ and _growth_ that leads items to 'break' the grid shape under certain circumstances:

_(Example Description: On the left is a layout of two rows of elements. The first row has three items and the second row has just two. On the right there is a similar layout, except the final row is just one row-long item)_

On the one hand, the layout takes up all its container's horizontal space, and there are no unsightly gaps. On the other, a generic grid formation should probably make each of its items align to both the horizontal and vertical rules.

### Mitigation

You'll recall the global measure rule explored in the **Axioms** section. This ensured all applicable elements could not become wider than a comfortably readable line-length.

Where a grid-like layout created with Flexbox results in a full-width `:last-child` element, the measure of its contained text elements would be in danger of becoming too long. Not with that global measure style in place. The benefit of global rules (_axioms_) is in not having to consider each design principle per-layout. Many are already taken care of.

_(Example Description: The first row of the grid has two boxes. In each, the text takes up the full width. The last row has one box taking up all the width. Its text is narrower than its width)_

### _Grid_ for grids

The aptly named CSS Grid module brings us closer to a 'true' responsive grid formation in one specific sense: It's possible to make items grow, shrink, and wrap together _without_ breaching the column boundaries.

_(Example Description: The flex version's vertical gutters are not continuous, because the columns grow to be different widths. The grid version does have equal width columns, but this results in gaps where there are too few cells to complete the grid)_

This behavior is closer to the archetypal responsive grid I have in mind, and will be the layout we pursue here. There's just one major implementation issue to quash. Consider the following code.

```css
.grid {
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

This is the pattern, which I first discovered in Jen Simmon's Layout Land video series. To break it down:

1. **`display: grid`:** sets the grid context, which makes grid cells for its children.
2. **`grid-gap`:** places a 'gutter' _between_ each grid item (saving us from having to employ the negative margin technique first described in **The Cluster**).
3. **`grid-template-columns`:** Would ordinarily define a rigid grid for _designing to_, but used with `repeat` and `auto-fit` allows the dynamic spawning and wrappping of columns to create a behavior similar to the preceding Flexbox solution.
4. **`minmax`:** This function ensures each column, and therefore each cell of content shares a width between a minimum and maximum value. Since `1fr` represents one part of the available space, columns grow together to fill the container.

The shortcoming of this layout is the minimum value in `minmax()`. Unlike `flex-basis`, which allows any amount of growing or shrinking from a single 'ideal' value, `minmax()` sets a scope with hard limits.

Without a fixed minimum (`250px`, in this case) there's nothing to _trigger_ the wrapping. A value of `0` would just produce one row of ever-diminishing widths. But it being a fixed minimum has a clear consequence: in any context narrower than the minimum, overflow will occur.

_(Example Description: Single column of boxes breaches the right hand edge of the browser viewport)_

To put it simply: the pattern as it stands can only safely produce layouts where the columns converge on a width that is below the estimated minimum for the container. About `250px` is reasonably safe because most handheld device viewports are no wider. But what if I want my columns to grow considerably beyond this width, where the space is available? With Flexbox and `flex-basis` that is quite possible, but with CSS Grid it is not without assistance.

## Solution

Each of the layouts described so far in **Every Layout** have handled sizing and wrapping with just CSS, and without `@media` queries. Sometimes it's not possible to rely on CSS alone for automatic reconfiguration. In these circumstances, turning to `@media` breakpoints is out of the question, because it undermines the modularity of the layout system. Instead, I _might_ defer to JavaScript. But I should do so _judiciously_, and using progressive enhancement.

`ResizeObserver` (soon to be available in most modern browsers) is a highly optimized API for tracking and responding to changes in element dimensions. It is the most efficient method yet for creating container queries with JavaScript. I wouldn't recommend using it as a matter of course, but employed _only_ for solving tricky layout issues is acceptable.

Consider the following code:

```css
.grid {
	display: grid;
	gap: 1rem;

	&.aboveMin {
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
	}
}
```

The `aboveMin` class presides over an overriding declaration that produces the responsive grid. `ResizeObserver` is then instructed to add and remove the `aboveMin` class depending on the container width. The minimum value of `500px` (in the above example) is _only_ applied where the container itself is wider than that threshold. Here is a standalone function to activate the `ResizeObserver` on a grid element.

```javascript
function observeGrid(gridNode) {
	// Feature detect ResizeObserver
	if ('ResizeObserver' in globalThis) {
		// Get the min value from data-min="[min]"
		const { min } = gridNode.dataset
		// Create a proxy element to measure and convert
		// the `min` value (which might be em, rem, etc) to `px`
		const test = document.createElement('div')
		test.style.width = min
		gridNode.append(test)
		const minToPixels = test.offsetWidth
		test.remove()
		const ro = new ResizeObserver((entries) => {
			for (let entry of entries) {
				// Get the element's current dimensions
				const cr = entry.contentRect
				// `true` if the container is wider than the minimum
				const isWide = cr.width > minToPixels
				// toggle the class conditionally
				gridNode.classList.toggle('aboveMin', isWide)
			}
		})
		ro.observe(gridNode)
	}
}
```

If `ResizeObserver` is not supported, the fallback one-column layout is applied perpetually. This basic fallback is included here for brevity, but you could instead fallback to the serviceable-but-imperfect Flexbox solution covered in the previous section. In any case, no content is lost or obscured, and you have the ability to use larger `minmax()` minimum values for more expressive grid formations. And since we're no longer bound to absolute limits, we can begin employing relative units.

_(Example Description: On the left, a grid formation is created with minmax(250px, 1fr). On the right, the viewport is narrower that 250px, but the cells are 100% width, meaning nothing is overflowing.)_

Here's an example initialization (code is elided for brevity):

```html
<div class="grid" data-min="250px">

</div>
<script>
  const grid = document.querySelector('.grid');
  observeGrid(grid);
</script>
```

### The `min()` function

While it is worth covering `ResizeObserver` because it may serve you well in other circumstances, it is actually no longer needed to solve this particular problem. That's because we have the recently widely adopted CSS `min()` function. Sorry for the wild goose chase but we can, in fact, write this layout without JavaScript after all.

As a fallback, we configure the grid into a single column. Then we use `@supports` to test for `min()` and enhance from there:

```css
.grid {
	display: grid;
	gap: 1rem;
}

@supports (width: min(250px, 100%)) {
	.grid {
		grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
	}
}
```

The way `min()` works is it calculates the _shortest length_ from a set of comma-separated values. That is: `min(250px, 100%)` would return `100%` where `250px` evaluates as _higher_ than the evaluated `100%`. This useful little algorithm _decides for us_ where the width must be capped at `100%`.

### `<watched-box>`

If you are looking for a general solution for container queries, I have created `<watched-box>`. It's straightforward and declarative, and it supports any CSS length units.

It is recommended `<watched-box>` is used as a "last resort" manual override. In all but unusual cases, one of the purely CSS-based layouts documented in **Every Layout** will provide context sensitive layout automatically.

## Use cases

Grids are great for browsing teasers for permalinks or products. I can quickly compose a card component to house each of my teasers using a **Box** and a **Stack**.

---

# The Frame

## The problem

Some things exist as relationships. A line exists as the relationship between two points; without both the points, the line cannot come into being.

When it comes to drawing lines, there are factors we don't necessarily know, and others we absolutely do. We don't necessarily know where, in the universe, each of the points will appear. That might be outside of our control. But we _do_ know that, no matter where the points appear, we'll be able to draw a straight line between them.

_(Example Description: Pairs of dots are joined by lines. The lines intersect.)_

The position of the points is variable, but the nature of their relationship is constant. Capitalizing on the constants that exist in spite of the variables is how we shape dynamic systems.

### Aspect ratio

Aspect ratio is another constant that comes up a lot, especially when working with images. You find the aspect ratio by dividing the width of an image by its height.

_(Example Description: A 16 by 9 aspect ratio represented by 16 colon 9, 16 over 9 (a vulgar fraction) or 1.777)_

The `<img />` element is a replaced element; it is an element _replaced_ by the externally loaded source to which it points.

This source (an image file such as a PNG, JPEG, or SVG) has certain characteristics outside of your control as a writer of CSS. Aspect ratio is one such characteristic, and is determined when the image is originally created and cropped.

Making your images responsive is a matter of ensuring they don't overflow their container. A `max-inline-size` value of `100%` does just that.

```css
img {
	max-inline-size: 100%;
}
```

### Global responsive images

Since this basic responsive behavior should be the default for all images, I apply the style with a non-specific element selector. Not all of your styles are component-specific; read **Global and local styling** for more info.

Now the image's width will match one of two values:

- Its own intrinsic/natural width, based on the file data
- The width of the horizontal space afforded by the container element

Importantly, the height---in either case---is determined by the aspect ratio. It's the same as writing `block-size: auto`, but that explicit declaration isn't needed by modern, compliant browsers.

```text
height == width / aspect ratio
```

Sometimes we want to dictate the aspect ratio, rather than inheriting it from the image file. The only way to achieve this without squashing, or otherwise distorting, the image is to dynamically recrop it. Declaring `object-fit: cover` on an image will do just that: crop it to fit the space without augmenting its _own_ aspect ratio. The container becomes a window onto the undistorted image.

_(Example Description: A 16:9 frame placed over a 24:9 image. There are no gaps in the frame.)_

What might be useful is a general solution whereby we can draw a rectangle, based on a given aspect ratio, and make it a window onto any content we place within it.

## The solution

The first thing we need to do is find a way to give an arbitrary element an aspect ratio _without_ hard-coding its width and height. That is, we need to make a container behave like a (replaced) image.

For that, we have the aspect ratio property that would take an `x/n` value:

```css
.frame {
	aspect-ratio: 16 / 9;
}
```

Before the advent of this property, we had to lean on an intrinsic ratio technique first written about as far back as 2009. The technique capitalizes on the fact that padding, even in the vertical dimension, is relative to the element's width. That is, `padding-bottom: 56.25%` will make an empty element (with no set height) _nine sixteenths as high as it is wide_ --- an aspect ratio of `16:9`. You find `56.25%` by dividing `9` (representing the height) by `16` (representing the width) --- the opposite way around to finding the aspect ratio itself.

_(Example Description: The bottom padding of 66.666% is what gives the element its shape: an aspect ratio of 6:9)_

Using custom properties and `calc()`, we can create an interface that accepts any numbers for the left (numerator, or `n`) and right (denominator, or `d`) values of the ratio:

```css
.frame {
	padding-block-end: calc(var(--n) / var(--d) * 100%);
}
```

Assuming `class="frame"` is a block level element (such as a `<div>`), its width will automatically match that of its parent. Whatever the calculated width value, the height is determined by multiplying it by `9 / 16`.

Since support is now good for the `aspect-ratio` property, we can go ahead and use that instead of this elaborate hack.

### Cropping

So how does the cropping work? For replaced elements, like `<img />` and `<video />` elements, we just need to give them a `100%` width and height, along with `object-fit: cover`:

```css
.frame {
	aspect-ratio: 16 / 9;

	& > img,
	& > video {
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}
}
```

### Cropping position

Implicitly, the complementary `object-position` property's value is `50% 50%`, meaning the media is cropped around its center point. This is likely to be the most desirable cropping position (since most images have a focal point somewhere towards their middle). Be aware that `object-position` is at your disposal for adjustment.

The `object-fit` property is not designed for normal, non-replaced elements, so we'll have to include something more to handle them. Fortunately, Flexbox justification and alignment can have a similar effect. Since Flexbox has no affect on replaced elements, we can safely add these styles to the parent, with `overflow: hidden` preventing the content from escaping.

```css
.frame {
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;

	aspect-ratio: 16 / 9;

	& > img,
	& > video {
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}
}
```

Now any simple element will be placed in the center of the **Frame**, and cropped where it is taller or wider than the **Frame** itself. If the element's content makes it taller than the parent, it'll be cropped at the top _and_ the bottom. Since inline content wraps, a specific set width might be needed to cause cropping on the left and right. To make sure the cropping happens in all contexts, and at all zoom levels, a `%`-based value will work.

_(Example Description: The child element is cropped on the top and bottom edges due to its content making it taller than its parent. It's cropped on the left and right edges due to a 150% width)_

### Background images

Another way to crop an image to cover its parent's shape is to supply it as a background image, and use `background-size: cover`. For this implementation, we are assuming the image should be treated as _content_, and therefore be supplied with alternative text.

Background images cannot take alternative text directly, and are also removed by some high contrast modes/themes some of your users may be running. Using a "real" image, via an `<img />` tag, is usually preferable for accessibility.

## Use cases

The **Frame** is mostly useful for cropping media (videos and images) to a desired aspect ratio. Once you start controlling the aspect ratio, you can of course tailor it to the current circumstances. For example, you might want to give images a different aspect ratio depending on the viewport orientation.

It's possible to achieve this by changing the custom property values via an orientation `@media` query. In the following example, the **Frame** elements of the previous example are made square (rather than `16:9` landscape) where there is relatively more vertical space available.

```css
@media (orientation: portrait) {
	.frame {
		aspect-ratio: 1 / 1;
	}
}
```

The Flexbox provision means you can crop any kind of HTML to the given aspect ratio, including `<canvas>` elements if those are your chosen means of creating imagery. A set of card-like components might each contain either an image or---where none is available---a textual fallback.

---

# The Reel

## The problem

When I'm sequencing music, I don't know how long the track I'm creating is going to be until I'm done. My sequencer software is aware of this and provisions time _on demand_, as I add bars of sound. Just as music sequencers dynamically provision time, web pages provision space. If all songs had to be four minutes and twenty six seconds long, or all web pages `768px` high, well, that would be needlessly restrictive.

_(Example Description: Music sequencer. X axis marks time and y axis marks instruments)_

The mechanism whereby the provisioned space can be explored within a fixed "viewport" is called _scrolling_. Without it, everyone's devices would have to be exactly the same size, shape, and magnification level at all times. Writing content for such a space would become a formalist game, like writing haiku. Thanks to scrolling, you don't have to worry about space when writing web content. Writing for print does not have the same luxury.

The CSS `writing-mode` with which you are probably most familiar is `horizontal-tb`. In this mode, text and inline elements progress horizontally (either from left to right, as in English, or right to left) and block elements flow from top to bottom (that's the `tb` part). Since text and inline elements are instructed to _wrap_, the horizontal overflow which would trigger horizontal scrolling is generally avoided. Because content is not permitted to reach _outwards_ is resolves to reach _downwards_. The vertical progression of block elements inevitably triggers vertical scrolling instead.

_(Example Description: Block elements stay within the width of their parent, but overflow vertically. One block element is shown overflowing the viewport at the bottom. A vertical scrollbar has appeared.)_

As a Western reader, accustomed to the `horizontal-tb` writing mode, vertical scrolling is conventional and expected. When you find the page needs to be scrolled vertically to see all the content, you don't think something has gone wrong. Where you encounter _horizontal_ scrolling, it's not only unexpected but has clear usability implications: where overflow follows writing direction, each successive line of text has to be scrolled to be read.

All this is not to say that horizontal scrolling is strictly forbidden within a `horizontal-tb` writing mode. In fact, where implemented deliberately and clearly, horizontally scrolling sections within a vertically scrolling page can be an ergonomic way to browse content. Television streaming services tend to dissect their content by category vertically and programme horizontally, for example. The one thing you really want to avoid are single elements that scroll _bidirectionally_. This is considered a failure under WCAG's **1.4.10 Reflow** criterion.

_(Example Description: On the left, the page scrolls vertically and horizontally, and is marked as bad with a cross. On the right, the page scrolls vertically and some elements inside the page scroll horizontally, which is marked as good with a tick.)_

I formalized an accessible "carousel" component for the BBC which---instead of deferring entirely to JavaScript for the browsing functionality---simply invokes native scrolling with overflow. The browsing buttons provided are merely a progressive enhancement, and increment the scroll position. Every Layout's **Reel** is similar, but foregoes the JavaScript to rely on standard browser scrolling behavior alone.

## The solution

As we set out in **The Cluster**, an efficient way to change the direction of block flow is to create a Flexbox context. By applying `display: flex` to an element, its children will switch from progressing downwards to progressing rightwards --- at least where the default LTR (left-to-right) writing `direction` is in effect.

By omitting the often complementary `flex-wrap: wrap` declaration, elements are forced to maintain a single-file formation. Where this line of content is longer than the parent element is wide, overflow occurs. By default, this will cause the page itself to scroll horizontally. We don't want that, because it's only our Flexbox content that actually needs scrolling. It would be better that everything else stays still. So, instead, we apply `overflow: auto` to the Flex element, which automatically invokes scrolling _on that element_ and only where overflow does indeed occur.

```css
.reel {
	/* ↓ We only want horizontal scrolling */
	overflow-inline: auto;
	display: flex;
}
```

_(Example Description: Overflowing the container on the right causes the scrollbar to appear.)_

I'm yet to tackle affordance (making the element _look_ scrollable), and there's the matter of spacing to address too, but this is the core of the layout. Because it capitalizes on standard browser behavior, it's extremely terse in code and robust --- quite unlike your average carousel/slider jQuery plugin.

### The scrollbar

Scrolling is multimodal functionality: there are many ways to do it, and you can choose whichever suits you best. While touch, trackpad gestures, and arrow key presses may be some of the more ergonomic modes, clicking and dragging the scrollbar itself is probably the most familiar, especially to older users on desktop. Having a visible scrollbar has two advantages:

1. It allows for scrolling by dragging the scrollbar handle (or _"thumb"_)
2. It indicates scrolling is available by this and other means (_increases affordance_)

Some operating systems and browsers hide the scrollbar by default, but there are CSS methods to reveal it. Webkit and Blink-based browsers proffer the following prefixed properties:

```css
::-webkit-scrollbar {
}

::-webkit-scrollbar-button {
}

::-webkit-scrollbar-track {
}

::-webkit-scrollbar-track-piece {
}

::-webkit-scrollbar-thumb {
}

::-webkit-scrollbar-corner {
}

::-webkit-resizer {
}
```

As of version 64, there are also limited opportunities to style the scrollbar in Firefox, with the standardized `scrollbar-color` and `scrollbar-width` properties. Note that the `scrollbar-color` settings only take effect on MacOS where **Show scroll bars** is set to **Always** (in **Settings > General**).

Setting scrollbar colors is a question of aesthetics, which is not really what **Every Layout** is about. But it's important, for reasons of affordance, that scrollbars are _apparent_. The following black and white styles are chosen just to suit **Every Layout's** own aesthetic. You can adjust them as you wish.

```css
.reel {
	/* ↓ First value: thumb; second value: track */
	scrollbar-color: var(--color-light) var(--color-dark);
	/* ↓ We only want horizontal scrolling */
	overflow-inline: auto;
	display: flex;

	&::-webkit-scrollbar {
		block-size: 1rem;
	}

	&::-webkit-scrollbar-track {
		background-color: var(--color-dark);
	}

	&::-webkit-scrollbar-thumb {
		background-color: var(--color-dark);
		background-image: linear-gradient(
			var(--color-dark) 0,
			var(--color-dark) 0.25rem,
			var(--color-light) 0.25rem,
			var(--color-light) 0.75rem,
			var(--color-dark) 0.75rem
		);
	}
}
```

Not all properties are supported for these proprietary pseudo-classes. Hence, visually _insetting_ the thumb is a question of painting a centered stripe using a `linear-gradient` rather than attempting a margin or border.

_(Example Description: Shows how the scrollbar thumb has a dark to light to dark gradient to make it look inset.)_

### Height

What should the height of a **Reel** instance be? Probably shorter than the viewport, so that the whole **Reel** can be brought into view. But should we be setting a height at all? Probably not. The best answer is _"as high as it needs to be"_, and is a question of the _content_ height.

In the following demonstration, a **Reel** element houses a set of card-like components. The height of the **Reel** is determined by the height of the tallest card, which is the card with the most content. Note that the last element of each "card" (a simple attribution) is pushed to the bottom of the space, by using a **Stack** with `splitAfter="2"`.

For images, which may be very large or use differing aspect ratios, we may want to _set_ the **Reel's** height. The common image `block-size` (`height` in a `horizontal-tb` writing mode) should accordingly be `100%`, and the width `auto`. This will ensure the images share a height but maintain their own aspect ratio.

```css
.reel {
	block-size: 50vb;

	& > img {
		inline-size: auto;
		block-size: 100%;
	}
}
```

### Child versus descendant selectors

Notice how we are using `.reel > img` and not `.reel img`. We only want to affect the layout of images _if_ they are the direct descendants (or _children_) of the **Reel**. Hence, the `>` child combinator.

### Spacing

Spacing out the child elements used to be a surprisingly tricky business. A border is applied around the **Reel** in this case, to give it its shape.

Until recently, we would have had to use margin and the adjacent sibling combinator to add a space between the child elements. We use a logical property to ensure the **Reel** works in both writing directions.

```css
.reel > * + * {
	margin-inline-start: var(--s1);
}
```

Now, since we're in a Flexbox context, we are also able to use the `gap` property, which is applied to the parent:

```css
.reel {
	gap: var(--s1);
}
```

The main advantage of `gap` is ensuring the margins don't appear in the wrong places when elements wrap. Since the **Reel's** content is not designed to wrap, we shall use the `margin`-based solution instead. It's longer and better supported.

Adding spacing _around_ the child elements (in between them and the parent `.reel` element) is a trickier business. Unfortunately, padding interacts unexpectedly with scrolling. The effect on the right hand side is as if there were no padding at all:

_(Example Description: Scrollable area is scrolled all the way to the right. The last child element's right edge is flush with the parent's right edge despite the padding on the parent)_

So, if we want spacing around the children, we take a different approach. We add margin to all but the right hand side of each child element, then insert space using pseudo-content on the last of those children.

```css
.reel {
	border-width: var(--border-thin);

	&::after {
		content: '';
		flex-basis: var(--s0);
		/* ↓ Default is 1 so needs to be overridden */
		flex-shrink: 0;
	}

	& > * {
		margin: var(--s0);
		margin-inline-end: 0;
	}
}
```

### Cascading border styles

Here, we are only applying the border width, and not the border color or style. For this to take effect, the `border-style` has to be applied somewhere already. In **Every Layout's** own stylesheet, the `border-style` is applied _universally_, making `border-width` the only ongoing concern for most border cases:

```css
*,
*::before,
*::after {
	border-style: solid;
	/* ↓ 0 by default */
	border-width: 0;
}
```

_(Example Description: The pseudo-content fixes the spacing issue by moving the last child's right outer edge away from the parent's right inner edge.)_

The implementation to follow assumes you do not need padding on the **Reel** element itself; the approach using `.reel > * + *` therefore suffices.

That just leaves the space between the children and the scrollbar (where present and visible) to handle. Not a problem, you may think: just add some padding to the bottom of the parent (`class="reel"` here). The trouble is, this creates a _redundant_ space wherever the **Reel** is not overflowing and the scrollbar has not been invoked.

Ideally, there would be a pseudo-class for overflowing/scrolling elements. Then we could add the padding selectively. Currently, the `:overflowed-content` pseudo-class exists as little more than an idea. For now, we can apply the margin, and remove it using JavaScript and a simple `ResizeObserver`. Innately, this is a progressive enhancement technique: where JavaScript is unavailable, or `ResizeObserver` is not supported, the padding does not appear for an overflowing **Reel** --- but with little detrimental effect. It just presses the scrollbar up against the content.

```javascript
const reels = Array.from(document.querySelectorAll('.reel'))
const toggleOverflowClass = (element) => {
	element.classList.toggle('overflowing', element.scrollWidth > element.clientWidth)
}
for (let reel of reels) {
	if ('ResizeObserver' in globalThis) {
		new ResizeObserver((entries) => {
			toggleOverflowClass(entries[0].target)
		}).observe(reel)
	}
}
```

Inside the observer, the **Reel's** `scrollWidth` is compared to its `clientWidth`. If the `scrollWidth` is larger, the `overflowing` class is added.

```css
.reel.overflowing {
	padding-block-end: var(--s0);
}
```

### Concatenating classes

See how the `reel` and `overflowing` classes are concatenated. This has the advantage that the `overflowing` styles defined here _only_ apply to **Reel** components. That is, they can't unwittingly be applied to other elements and components that might also take an `overflowing` class.

Some developers use verbose namespacing to localize their styles, like prefixing each class associated with a component with the component name (`reel--overflowing` etc.). Deliberate specification through class concatenation is less verbose and more elegant.

We're not quite done yet, because we haven't dealt with the case of child elements being dynamically removed from the **Reel**. That will affect `scrollWidth` too. We can abstract the class toggling function and add a `MutationObserver` that observes the `childList`. `MutationObserver` is almost ubiquitously supported.

```javascript
const reels = Array.from(document.querySelectorAll('.reel'))
const toggleOverflowClass = (element) => {
	element.classList.toggle('overflowing', element.scrollWidth > element.clientWidth)
}
for (let reel of reels) {
	if ('ResizeObserver' in globalThis) {
		new ResizeObserver((entries) => {
			toggleOverflowClass(entries[0].target)
		}).observe(reel)
	}
	if ('MutationObserver' in globalThis) {
		new MutationObserver((entries) => {
			toggleOverflowClass(entries[0].target)
		}).observe(reel, { childList: true })
	}
}
```

It's fair to say this is a bit _overkill_ if only used to add or remove that bit of padding. But these observers can be used for other enhancements, even beyond styling. For example, it may be beneficial to keyboard users for an overflowing/scrollable **Reel** to take the `tabindex="0"` attribution. This would make the element focusable by keyboard and, therefore, scrollable using the arrow keys. If each _child element_ is focusable, or includes focusable content, this may not be necessary: focusing an element automatically brings it into view by changing the scroll position.

## Use cases

The **Reel** is a robust and efficient antidote to carousel/slider components. As already discussed and demonstrated, it is ideal for browsing categories of things: movies; products; news stories; photographs.

In addition, it can be used to supplant button-activated menu systems. What Bradley Taunt calls sausage links may well be more usable than "hamburger" menus for many. For such a use case, the visible scrollbar is probably rather heavy-handed. This is why the ensuing custom element implementation includes a Boolean `noBar` property.

There's no reason why the links have to be shaped like sausages, of course! That's just an etymological hangover. One thing to note, however, is the lack of affordance the omitted scrollbar represents. So long as the last visible child element on the right is partly obscured, it's relatively clear overflow is occurring and the ability to scroll is present. If this is not the case, it may appear that all of the available elements are already in view.

_(Example Description: In the first version, the right-most element is partly obscured. The label reads "I need to scroll". In the second version, the right-most element is completely obscured. The label reads "Everything seems to be here".)_

From a layout perspective, you can reduce the likelihood of _"Everything seems to be here"_ by avoiding certain types of width. Percentage widths like `25%` or `33.333%` are going to be problematic because---at least in the absence of spacing---this will fit the elements exactly within the space.

In addition, you can indicate the availability of scrolling by other means. You can capitalize on the observers' `overflowing` class to reveal a textual instruction (reading _"scroll for more"_, perhaps):

```css
.reel.overflowing + .instruction {
	display: block;
}
```

However, this is not reactive to the _current_ scroll position. You might use additional scripting to detect when the element is scrolled all the way to either side, and add `start` or `end` classes accordingly. The ever-innovative Lea Verou devised a way to achieve something similar using images and CSS alone. Shadow background images take `background-attachment: scroll` and remain at either end of the scrollable element. "Shadow cover" background images take `background-attachment: local`, moving _with_ the content. Whenever the user reaches one end of the scrollable area, these "shadow cover" backgrounds obscure the shadows beneath them.

These considerations don't strictly relate to layout, more to communication, but are worth exploring further to improve usability.

## The generator

Use this tool to generate basic **Reel** CSS and HTML. You would want to include the `ResizeObserver` script along with the code generated. Here's a version implemented as an Immediately Invoked Function Expression (IIFE):

```javascript
;(function () {
	const className = 'reel'
	const reels = Array.from(document.querySelectorAll(`.${className}`))
	const toggleOverflowClass = (element) => {
		element.classList.toggle('overflowing', element.scrollWidth > element.clientWidth)
	}
	for (let reel of reels) {
		if ('ResizeObserver' in globalThis) {
			new ResizeObserver((entries) => {
				toggleOverflowClass(entries[0].target)
			}).observe(reel)
		}
		if ('MutationObserver' in globalThis) {
			new MutationObserver((entries) => {
				toggleOverflowClass(entries[0].target)
			}).observe(reel, { childList: true })
		}
	}
})()
```

---

# The Imposter

## The problem

Positioning in CSS, using one or more instances of the `position` property's `relative`, `absolute`, and `fixed` values, is like manually overriding web layout. It is to switch off automatic layout and take matters into your own hands. As with piloting a commercial airliner, this is not a responsibility you would wish to undertake except in rare and extreme circumstances.

In the **Frame** documentation, you were warned of the perils of eschewing the browser's standard layout algorithms:

> When you give an element `position: absolute`, you remove it from the natural flow of the document. It lays itself out as if the elements around it don't exist. In most circumstances this is highly undesirable, and can easily lead to problems like overlapping and obscured content.

But what if you _wanted_ to obscure content, by placing other content over it? If you've been working in web development for more than 23 minutes, it's likely you have already done this, in the incorporation of a dialog element, "popup", or custom dropdown menu.

The purpose of the **Imposter** element is to add a general purpose _superimposition_ element to your layouts suite. It will allow the author to centrally position an element over the viewport, the document, or a selected "positioning container" element.

## The solution

There are many ways to centrally position elements vertically, and many more to centrally position them horizontally (some alternatives were mentioned as part of the **Center** layout). However, there are only a few ways to position elements centrally _over_ other elements/content.

The contemporaneous approach is to use CSS Grid. Once your grid is established, you can arrange content by grid line number. The concept of flow is made irrelevant, and overlapping is eminently achievable wherever desired.

_(Example Description: An element is centered in a Grid using grid-area: 2 / 2 / 5 / 8)_

### Source order and layers

Whether you are positioning content according to Grid lines or doing so with the `position` property, which elements appear _over_ which is, by default, a question of source order. That is: if two elements share the same space, the one that appears _above_ the other will be the one that comes last in the source.

_(Example Description: In a grid, an element labeled last in source overlaps an element labeled first in source)_

Since you can place any elements along any grid lines you wish, an overlapping last-in-source element can appear first down the vertical axis

This is often overlooked, and some believe that `z-index` needs to accompany `position: absolute` in all cases to determine the "layering". In fact, `z-index` is only necessary where you want to layer positioned elements irrespective of their source order. It's another kind of override, and should be avoided wherever possible.

An arms race of escalating `z-index` values is often cited as one of those irritating but necessary things you have to deal with using CSS. I rarely have `z-index` problems, because I rarely use positioning, and I'm mindful of source order when I do.

CSS Grid does not precipitate a general solution, because it would only work where your positioning element is set to `display: grid` ahead of time, and the column/row count is suitable. We need something more flexible.

### Positioning

You can position an element to one of three things ("_positioning contexts_" from here on):

1. The viewport
2. The document
3. An ancestor element

To position an element relative to the viewport, you would use `position: fixed`. To position it relative to the document, you use `position: absolute`.

Positioning it relative to an ancestor element is possible where that element (the "_positioning container_" from here on) is also explicitly positioned. The easiest way to do this is to give the ancestor element `position: relative`. This sets the localized positioning context _without_ moving the position of the ancestor element, or taking it out of the document flow.

_(Example Description: The very outer box is labeled the positioning container. The the inner box is labeled the positioned element.)_

The `static` value for the `position` property is the default, so you will rarely see or use it except to reset the value.

### Centering

How do we position the **Imposter** element over the _center_ of the document, viewport, or positioning container? For positioned elements, techniques like `margin: auto` or `place-items: center` do not work. In _manual override_, we have to use a combination of the `top`, `left`, `bottom`, and/or `right` properties. Importantly, the values for each of these properties relate to the positioning context---not to the immediate parent element.

_(Example Description: Nested boxes. The very outer box is labeled the positioning container. The box on top, overlapping the others is labeled the positioned element. Its top and left offset is set according to the positioning container element (the outer box))_

The `static` value for the `position` property is the default, so you will rarely see or use it.

So far, so bad: we want the element itself to be centered, not its top corner. Where we know the `width` of the element, we can compensate by using negative margins. For example, `margin-inline-start: -20rem` and `margin-block-start: -10rem` will recenter an element that is `40rem` wide and `20rem` tall (the negative value is always half the dimension).

_(Example Description: Arrows indicate the negative margins pulling the element left and up, to make its center the positioning container's center)_

We avoid hard coding dimensions because, like positioning, it dispenses with the browser's algorithms for arranging elements according to available space. Wherever you code a fixed width on an element, the chances of that element or its contents becoming obscured on _somebody's_ device _somewhere_ are close to inevitable. Not only that, but we might not know the element's width or height ahead of time. So we wouldn't know which negative margin values with which to complement it.

Instead of designing layout, we design _for layout_, allowing the browser to have the final say. In this case, it's a question of using transforms. The `transform` property arranges elements according to their own dimensions, whatever they are at the given time. In short: `transform: translate(-50%, -50%)` will _translate_ the element's position by -50% of its _own_ width and height respectively. We don't need to know the element's dimensions ahead of time, because the browser can calculate them and act on them for us.

Centering the element over its positioning container, no matter its dimensions, is therefore quite simple:

```css
.imposter {
	/* ↓ Position the top left corner in the center */
	position: absolute;
	inset-block-start: 50%;
	inset-inline-start: 50%;
	/* ↓ Reposition so the center of the element
  is the center of the positioning container */
	transform: translate(-50%, -50%);
}
```

It should be noted at this point that a block-level **Imposter** element set to `position: absolute` no longer takes up the available space along the element's writing direction (usually horizontal; left-to-right). Instead, the element "shrink wraps" its content as if it were inline.

_(Example Description: A small element with the text hello world is centered within its positioning container)_

By default, the element's `width` will be 50%, or less if its content takes up less than 50% of the positioning container. If you add an explicit `width` or `height`, it will be honoured _and_ the element will continue to be centered within the positioning container --- the internal translation algorithm sees to that.

### Overflow

What if the positioned **Imposter** element becomes wider or taller than its positioning container? With careful design and content curation, you should be able to create the generous tolerances that prevent this from happening under most circumstances. But it may still happen.

By default, the effect will see the **Imposter** _poking out_ over the edges of the positioning container --- and may be in danger of obscuring content around that container. In the following illustration, an **Imposter** is taller than its positioning container.

_(Example Description: Of two boxes, the one on top reaches higher and lower than the one underneath, meaning it also overlaps lines of text above and below the shorter box)_

Since `max-width` and `max-height` override `width` and `height` respectively, we can allow authors to set dimensions---or minimum dimensions---but still ensure the element is contained. All that's left is to add `overflow: auto` to ensure the constricted element's contents can be scrolled into view.

```css
.imposter {
	position: absolute;
	/* ↓ equivalent to `top` in horizontal-tb writing mode */
	inset-block-start: 50%;
	/* ↓ equivalent to `left` in horizontal-tb writing mode */
	inset-inline-start: 50%;
	transform: translate(-50%, -50%);
	/* ↓ equivalent to `max-width` in horizontal-tb writing mode */
	max-inline-size: 100%;
	/* ↓ equivalent to `max-height` in horizontal-tb writing mode */
	max-block-size: 100%;
}
```

### Margin

In some cases, it will be desirable to have a minimum gap (space; margin; whatever you want to call it) between the **Imposter** element and the inside edges of its positioning container. For two reasons, we can't achieve this by adding padding to the positioning container:

1. It would inset any static content of the container, which is likely not to be a desirable visual effect
2. Absolute positioning does not respect padding: our **Imposter** element would ignore and overlap it

The answer, instead, is to adjust the `max-width` and `max-height` values. The `calc()` function is especially useful for making these kinds of adjustments.

```css
.imposter {
	position: absolute;
	inset-block-start: 50%;
	inset-inline-start: 50%;
	transform: translate(-50%, -50%);

	max-inline-size: calc(100% - 2rem);
	max-block-size: calc(100% - 2rem);
}
```

The above example would create a minimum gap of `1rem` on all sides: the `2rem` value is `1rem` removed for each end.

_(Example Description: The positioned (imposter) element's top and bottom edges are 1rem away from the positioning container's own inside edges)_

### Fixed positioning

Where you wish the **Imposter** to be fixed relative to the _viewport_, rather than the document or an element (read: positioning container) within the document, you should replace `position: absolute` with `position: fixed`. This is often desirable for dialogs, which should follow the user as they scroll the document, and remain in view until tended to.

In the following example, the **Imposter** element has a `--positioning` custom property with a default value of `absolute`.

```css
.imposter {
	position: var(--positioning, absolute);
	inset-block-start: 50%;
	inset-inline-start: 50%;
	transform: translate(-50%, -50%);

	max-inline-size: calc(100% - 2rem);
	max-block-size: calc(100% - 2rem);
}
```

As described in the **Every Layout** article Dynamic CSS Components Without JavaScript, you can override this default value inline, inside a `style` attribute for special cases:

```html
<div class="imposter" style="--positioning: fixed">

</div>
```

In the custom element implementation to follow (under **The Component**) an equivalent mechanism takes the form of a Boolean `fixed` prop'. Adding the `fixed` attribute overrides the `absolute` positioning that is default.

### Fixed positioning and Shadow DOM

In most cases, using a `fixed` value for `position` will position the element relative to the viewport. That is, any candidate positioning containers (positioned ancestor elements) will be ignored.

However, a `shadowRoot` host element will be treated as the outer element of a nested document. Therefore, any element with `position: fixed` found inside Shadow DOM will instead be positioned relative to the `shadowRoot` host (the element that hosts the Shadow DOM). In effect, it becomes a positioning container as in previous examples.

_(Example Description: Left: a normal element element, used as a positioning container does not contain the fixed child (Imposter) element. Right: A shadowRoot element does contain the fixed child (Imposter) element.)_

## Use cases

Wherever content needs to be deliberately obscured, the **Imposter** pattern is your friend. It may be that the content is yet to be made available. In which case, the **Imposter** may consist of a call-to-action to unlock that content.

It may be that the artifacts obscured by the **Imposter** are more decorative, and do not need to be revealed in full.

When creating a dialog using an **Imposter**, be wary of the accessibility considerations that need to be included---especially those relating to keyboard focus management. Inclusive Components has a chapter on dialogs which describes these considerations in detail.

---

# The Container

Something we are starting to get asked a lot is this:

> Now we have container queries, is Every Layout obsolete?

As the proprietors of **Every Layout**, it's in our interest to eke as much out of our peculiar CSS layout solution as possible. So it is with great relief when we say that container queries (as useful as they are, and we'll get into that shortly) absolutely do not make **Every Layout** obsolete, worm food, shark chum, or in any other way _done_.

Primarily, **Every Layout** is an exposition of the benefit of automatic, self-governing layout. The less manual intervention you have to do, the better. It's less code and less bother. So far, manual intervention has exclusively meant _"using a width-related `@media` query"_ of some sort. Here's a trivial example that switches a Flexbox layout between one and two columns:

```css
.layout {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex-basis: 50%; /* two columns */
	}
}

@media (width <= 360px) {
	.layout > * {
		flex-basis: 100%; /* one column */
	}
}
```

Media queries are especially problematic because they pertain to the width of the viewport, not the space actually available to the element/component/layout in question. Media queries are only pertinent when your overarching page layout is not subject to change.

_(Example Description: The viewport width is marked as known but an element's width inside it is marked as unknown)_

As the name suggests, container queries pertain to a containing element. It is this containing element we measure, not the viewport, and it yields values much more useful for layout purposes.

```css
.layout {
	container-type: inline-size;
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex-basis: 50%; /* two columns */
	}
}

@container (width < 360px) {
	.layout > * {
		flex-basis: 100%; /* one column */
	}
}
```

_(Example Description: The viewport and all the elements inside it have widths marked as known)_

Both `@media` and `@container` queries are forms of manual intervention. They are circuit breakers we wire into layouts we know are going to error. And while I'm grateful for the existence of circuit breakers (otherwise my house might have repeatedly caught on fire) I'd sooner not have them anywhere I know they're not needed.

What if we took this approach instead?

```css
.layout {
	display: flex;
	flex-wrap: wrap;

	& > * {
		flex-basis: 180px; /* half of 360px */
		flex-grow: 1;
	}
}
```

It's less code. It's more backwards compatible code. But more importantly, it's code that revolves around the subject elements, not the viewport or a container they may or may not belong to. It's an _intrinsically_ sound layout.

_(Example Description: The viewport and element widths are marked as unneeded)_

**Every Layout's** Sidebar is a layout that intrinsically switches between 1 and 2-column states. And it bases where to switch on the comparative widths of the two elements (sidebar and non-sidebar). Increasing the sidebar width reveals the elegance of this approach: the position of the switch automatically moves.

_(Example Description: Shows how the breakpoint moves to the right when the sidebar increases in size)_

This is not something container queries are capable of because they only know the container's state, not the state(s) of the elements inside it. Were you to increase the sidebar width, you would have to manually adjust the container breakpoint or create a complex set of new rules:

```css
.with-sidebar {
	container-type: inline-size;
}

@container (width < 640px) {
	.with-sidebar:has(.sidebar--large) > * {
		flex-basis: 100%;
	}
}

@container (width < 360px) {
	.with-sidebar:has(.sidebar--small) > * {
		flex-basis: 100%;
	}
}
```

## The :has() functional pseudo-class

I'm using the `:has()` function to check whether the sidebar layout includes an element with the class `.sidebar--large` or with the class `.sidebar--small`. It's the only way of making an element aware of its children and is not necessary in the Sidebar layout component.

## The problem

So what layout problem (or problems) do container queries solve? The simple answer is: _any for which an intrinsically sound layout cannot be easily devised_. And while we are confident the layout generics we provide here---especially when used in composition---will solve the majority of your layout challenges, it doesn't hurt to have an escape hatch.

The **Container** layout is not a layout as such. It's more our way of saying _"now draw the rest of the damn owl"_. Except, in this case, most of the owl is already done.

_(Example Description: The CSS owl selector followed by a whole ASCII owl picture)_

## The solution

### Not really a layout

All we're going to solve here is the establishment of containers. How you "query" these containers is left up to you, for whenever you feel a need for them.

Using container queries allows you to finesse the other layouts in ways that would not otherwise be possible. As such, this is not a layout solution; more a meta-layout utility.

In terms of establishing containers, there are two main things to be aware of:

1. Containers can be named or unnamed
2. Containers can be nested

### Unnamed containers

The simplest way to set up a container is using the `container-type` property. For adapting **Every Layout**-like layouts, the `type` would invariably be `inline-size`.

```css
.container {
	container-type: inline-size;
}
```

When nesting containers, any query will correspond, by default, to the closest ancestral container:

```html
<div class="container">
  <div class="container">
    <div class="container">
      <div class="container">

      </div>
    </div>
  </div>
</div>
```

### Named containers

You can name a container using the following shorthand syntax, which combines the name with the type:

```css
.container {
	container: mycontainer / inline-size;
}
```

Now you can query any container, _at any ancestral level_, by referencing its name:

```css
.layout {
	container: mycontainer / inline-size;
}

@container myContainer (width < 360px) {
	.layout > * {
		/* fill your boots */
	}
}
```

## Use cases

You can use container queries to affect _any_ styles contingent on container dimensions. Container queries are just hooks, you have all of CSS at your disposal.

So the question becomes: which CSS properties are _relevant_ to changing container dimensions? The size and wrapping behavior of your typography could certainly be applicable, for example, and there are container units (video introduction) to help with that.

On the other hand, you probably _don't_ want to change the `color` or `font-family`. What would be the use in that? It's not relevant to layout.

Tutorials explaining CSS selectors always seem to use a change in `color` to demonstrate the selector being applied but it's usually the last thing you want to change---especially between the typically unimaginative `green`, `blue`, and `red`...

---

# THE LIST OF LAYOUTS

- The Stack
- The Box
- The Center
- The Cluster
- The Sidebar
- The Switcher
- The Cover
- The Grid
- The Frame
- The Reel
- The Imposter
- The Container
