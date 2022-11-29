const { Configuration, OpenAIApi } = require('openai')
const { App, LogLevel } = require('@slack/bolt')

const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret })
const ai = new OpenAIApi(configuration)
const app = new App({ signingSecret: process.env.npm_config_slack_secret, token: process.env.npm_config_slack_token, logLevel: LogLevel.DEBUG, port: 80 })

app.message(withFilter, async ({ message, say }) => {
  try {
    console.log('app.message', message)
    const { data: { choices: [{ text: answer }] } } = await ai.createCompletion('text-davinci-003', { prompt: message.text, temperature: 0.25, max_tokens: 480, top_p: 1, frequency_penalty: 0, presence_penalty: 0 })
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
async function withFilter ({ message: { bot_profile, subtype, thread_ts }, next }) {
  // eslint-disable-next-line camelcase
  if (bot_profile || subtype || thread_ts) return
  await next()
}
