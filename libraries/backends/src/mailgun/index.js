import { blockClient_action } from '@library/helpers/functions'
import Mailgun from 'mailgun.js'
import formData from 'form-data'

blockClient_action()

export const mg = (new Mailgun(formData)).client({username: 'api', key: String(process.env.MAILGUN)})
