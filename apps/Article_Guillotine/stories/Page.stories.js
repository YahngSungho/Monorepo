import { expect, userEvent, within } from '@storybook/test'
import Page from './Page.svelte'

export default {
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  title: 'Example/Page',
}

export const LoggedOut = {}

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const LoggedIn = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement)
    const loginButton = canvas.getByRole('button', { name: /log in/i })
    await expect(loginButton).toBeInTheDocument()
    await userEvent.click(loginButton)
    await expect(loginButton).not.toBeInTheDocument()

    const logoutButton = canvas.getByRole('button', { name: /log out/i })
    await expect(logoutButton).toBeInTheDocument()
  },
}
