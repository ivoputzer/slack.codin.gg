const express = require('express')
const { Configuration, OpenAIApi } = require('openai')
const { WebClient, LogLevel: { DEBUG } } = require('@slack/web-api')
const { createEventAdapter } = require('@slack/events-api')

const events = createEventAdapter(process.env.npm_config_slack_secret)
const client = new WebClient(process.env.npm_config_slack_token, { logLevel: DEBUG })
const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret })
const openai = new OpenAIApi(configuration)

events.on('message', handleMessage)

return express()
  .use('/', events.expressMiddleware())
  .listen(80, () => {
    console.log(`${process.env.npm_package_name} listening at http://localhost:${80}`)
  })

async function handleMessage({ bot_profile, channel, text, subtype }) {
  if (bot_profile || subtype) return

  const token = process.env.npm_config_slack_token
  const { data: { choices: [{ text: answer }] } } = await openai.createCompletion("text-davinci-001", {
    prompt: text.replace(/(<([^>]+)>)/ig, ""),
    temperature: 0.25,
    max_tokens: 480,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  client.chat.postMessage({ channel, token, text: answer.trimStart() })
}
