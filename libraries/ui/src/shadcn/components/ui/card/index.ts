

import Description from "./card-description.svelte";
import Footer from "./card-footer.svelte";
import Header from "./card-header.svelte";
import Title from "./card-title.svelte";

export {
	//
	Description as CardDescription,
	Footer as CardFooter,
	Header as CardHeader,
	Title as CardTitle,
	Description,
	Footer,
	Header,
	Title,
};

export {default as Card, default as Root} from "./card.svelte";
export {default as Action, default as CardAction} from "./card-action.svelte";
export {default as CardContent, default as Content} from "./card-content.svelte";