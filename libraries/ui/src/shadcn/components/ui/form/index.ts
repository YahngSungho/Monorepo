import * as FormPrimitive from "formsnap";

import Field from "./form-field.svelte";
import FieldErrors from "./form-field-errors.svelte";
import Fieldset from "./form-fieldset.svelte";
import Label from "./form-label.svelte";
import Legend from "./form-legend.svelte";

const {Control} = FormPrimitive;

export {
	Control,
	Field,
	FieldErrors,
	Fieldset,
	Control as FormControl,
	//
	Field as FormField,
	FieldErrors as FormFieldErrors,
	Fieldset as FormFieldset,
	Label as FormLabel,
	Legend as FormLegend,
	Label,
	Legend,
};

export {default as Button, default as FormButton} from "./form-button.svelte";
export {default as Description, default as FormDescription} from "./form-description.svelte";
export {default as ElementField, default as FormElementField} from "./form-element-field.svelte";