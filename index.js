const express = require('express')

const { WebClient, LogLevel: { DEBUG } } = require('@slack/web-api')
const { createEventAdapter } = require('@slack/events-api')

const events = createEventAdapter(process.env.npm_config_slack_secret)
const client = new WebClient(process.env.npm_config_slack_token, { logLevel: DEBUG })

events.on('message', async (event) => {
  if (event.bot_profile) return

  const channel = event.channel
  const token = process.env.npm_config_slack_token

  client.chat.postMessage({ channel, token, text: 'yes man' })
})

return express()
  .use('/', events.expressMiddleware())
  .get('/status', (req, res) => {
    res.json({ online: true, uptime: process.uptime() })
  })
  .listen(80, () => {
    console.log(`${process.env.npm_package_name} listening at http://localhost:${80}`)
  })
