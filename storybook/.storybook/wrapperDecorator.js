import Wrapper from './wrapper.svelte'

export const withWrapper = (Story, context) => {
   return {
      Component: Wrapper,
       props:{
				Component: Story,
        ...context.args
			}
   }
}