const { createReadStream } = require('fs')
const { Configuration, OpenAIApi } = require('openai')
const { App, LogLevel } = require('@slack/bolt')
const { RTMClient } = require('@slack/rtm-api')

const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret })
const ai = new OpenAIApi(configuration)
const app = new App({ signingSecret: process.env.npm_config_slack_secret, token: process.env.npm_config_slack_token, logLevel: LogLevel.DEBUG, port: 80 })
const rtm = new RTMClient(process.env.npm_config_slack_rtm_token)

app.message(createImage, async ({ message, say }) => {
  try {
    const { data: { data: [{ url }] } } = await ai.createImage({
      prompt: message.text.replace(/!ima?ge?\s*/i, String.prototype),
      n: 1,
      size: '512x512'
    })
    await say(url)
  } catch (error) {
    console.error('app.message', error)
    await say(`Sorry @<${message.user}>! I got this error: ${error.message}`)
  }
})

app.message(createImageEdit, async ({ message, say }) => {
  try {
    console.log('app.message', message)
    const { data: { data: [{ url }] } } = await ai.createImageEdit(
      createReadStream('codin.2.png'),
      createReadStream('codin.2.mask.png'),
      message.text.replace(/!nft\s*/i, String.prototype),
      1,
      '512x512'
    )
    await say(url)
  } catch (error) {
    console.error('app.message', error)
    await say(`Sorry @<${message.user}>! I got this error: ${error.message}`)
  }
})

app.message(createCompletion, async ({ message, say }) => {
  try {
    console.log('app.message', message)
    const { data: { choices: [{ text: answer }] } } = await ai.createCompletion({
      model: 'text-davinci-003',
      prompt: message.text,
      temperature: 0.25,
      max_tokens: 480,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
    console.log('ai.createCompletion', answer)
    await say(answer.trimStart())
  } catch (error) {
    console.error('app.message', error)
    await say(`Sorry @<${message.user}>! I got this error: ${error.message}`)
  }
})

; (async () => {
  try {
    await app.start()
    console.log(`app.start ⚡️ https://${process.env.npm_package_name}:${80}`)
  } catch (error) {
    console.error('app.start', error)
  }
})()

// eslint-disable-next-line camelcase
async function createCompletion ({ message: { bot_profile, subtype, thread_ts, text }, next }) {
  // eslint-disable-next-line camelcase
  if (bot_profile || subtype || thread_ts || /!ima?ge?/i.test(text) || /!nft/i.test(text)) return
  await next()
}

// eslint-disable-next-line camelcase
async function createImageEdit ({ message: { bot_profile, subtype, thread_ts, text }, next }) {
  // eslint-disable-next-line camelcase
  if (bot_profile || subtype || thread_ts || !/!nft/i.test(text)) return
  await next()
}

// eslint-disable-next-line camelcase
async function createImage ({ message: { bot_profile, subtype, thread_ts, text }, next }) {
  // eslint-disable-next-line camelcase
  if (bot_profile || subtype || thread_ts || !/!ima?ge?/i.test(text)) return
  await next()
}
