import * as FormPrimitive from 'formsnap'

import Label from './form-label.svelte'
import Legend from './form-legend.svelte'

const { Control } = FormPrimitive

export {
	Control,
	Control as FormControl,
	//
	Legend as FormLegend,
	Label,
	Legend,
}

export { default as Button, default as FormButton } from './form-button.svelte'
export { default as Description, default as FormDescription } from './form-description.svelte'
export { default as ElementField, default as FormElementField } from './form-element-field.svelte'
export { default as Field, default as FormField } from './form-field.svelte'
export { default as FieldErrors, default as FormFieldErrors } from './form-field-errors.svelte'
export { default as Fieldset, default as FormFieldset } from './form-fieldset.svelte'
export { default as FormLabel } from './form-label.svelte'
