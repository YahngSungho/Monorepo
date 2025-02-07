

type FormTextareaEvent<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLTextAreaElement
}

type TextareaEvents = {
	blur: FormTextareaEvent<FocusEvent>
	change: FormTextareaEvent<Event>
	click: FormTextareaEvent<MouseEvent>
	focus: FormTextareaEvent<FocusEvent>
	input: FormTextareaEvent<InputEvent>
	keydown: FormTextareaEvent<KeyboardEvent>
	keypress: FormTextareaEvent<KeyboardEvent>
	keyup: FormTextareaEvent<KeyboardEvent>
	mouseenter: FormTextareaEvent<MouseEvent>
	mouseleave: FormTextareaEvent<MouseEvent>
	mouseover: FormTextareaEvent<MouseEvent>
	paste: FormTextareaEvent<ClipboardEvent>
}

export {
	type FormTextareaEvent,
	
	//
	
	type TextareaEvents,
}

export {default as Root, default as Textarea} from './textarea.svelte'