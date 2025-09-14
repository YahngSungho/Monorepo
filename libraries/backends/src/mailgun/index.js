import { blockClient_action } from '@library/helpers/functions'
import formData from 'form-data'
import Mailgun from 'mailgun.js'

blockClient_action()

export const mg = (new Mailgun(formData)).client({key: String(process.env.MAILGUN), username: 'api'})
