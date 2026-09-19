import { get } from './client.js'

export const getOptions = () => get('/meta/options')
export const getStats = () => get('/meta/stats')
