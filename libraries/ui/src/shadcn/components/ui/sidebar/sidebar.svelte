<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	import * as Sheet from "$shadcn/components/ui/sheet/index.js";
	import { cn, type WithElementRef } from "$shadcn/utils.js";

	import { SIDEBAR_WIDTH_MOBILE } from "./constants.js";
	import { useSidebar } from "./context.svelte.js";

	let {
		ref = $bindable(null),
		side = "left",
		variant = "sidebar",
		collapsible = "offcanvas",
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		collapsible?: "icon" | "none" | "offcanvas";
		side?: "left" | "right";
		variant?: "floating" | "inset" | "sidebar";
	} = $props();

	const sidebar = useSidebar();
</script>

{#if collapsible === "none"}
	<div
		bind:this={ref}
		class={cn(
			"bg-sidebar text-sidebar-foreground w-(--sidebar-width) flex h-full flex-col",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</div>
{:else if sidebar.isMobile}
	<Sheet.Root
		bind:open={() => sidebar.openMobile, (v) => sidebar.setOpenMobile(v)}
		{...restProps}
	>
		<Sheet.Content
			style="--sidebar-width: {SIDEBAR_WIDTH_MOBILE};"
			class="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
			data-mobile="true"
			data-sidebar="sidebar"
			data-slot="sidebar"
			{side}
		>
			<Sheet.Header class="sr-only">
				<Sheet.Title>Sidebar</Sheet.Title>
				<Sheet.Description>Displays the mobile sidebar.</Sheet.Description>
			</Sheet.Header>
			<div class="flex h-full w-full flex-col">
				{@render children?.()}
			</div>
		</Sheet.Content>
	</Sheet.Root>
{:else}
	<div
		bind:this={ref}
		class="text-sidebar-foreground group peer hidden md:block"
		data-collapsible={sidebar.state === "collapsed" ? collapsible : ""}
		data-side={side}
		data-slot="sidebar"
		data-state={sidebar.state}
		data-variant={variant}
	>
		<!-- This is what handles the sidebar gap on desktop -->
		<div
			class={cn(
				"w-(--sidebar-width) relative bg-transparent transition-[width] duration-200 ease-linear",
				"group-data-[collapsible=offcanvas]:w-0",
				"group-data-[side=right]:rotate-180",
				variant === "floating" || variant === "inset"
					? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
					: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
			)}
			data-slot="sidebar-gap"
		></div>
		<div
			class={cn(
				"w-(--sidebar-width) fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex",
				side === "left"
					? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
					: "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
				// Adjust the padding for floating and inset variants.
				variant === "floating" || variant === "inset"
					? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
					: "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
				className
			)}
			data-slot="sidebar-container"
			{...restProps}
		>
			<div
				class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
				data-sidebar="sidebar"
				data-slot="sidebar-inner"
			>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
