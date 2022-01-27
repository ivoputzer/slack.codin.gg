const { Configuration, OpenAIApi } = require('openai')
const { App, LogLevel } = require('@slack/bolt')

const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret })
const ai = new OpenAIApi(configuration)
const app = new App({ signingSecret: process.env.npm_config_slack_secret, token: process.env.npm_config_slack_token, logLevel: LogLevel.DEBUG })

app.message(withFilter, async ({ message, say }) => {
  console.log('app.message', message)
  try {
    const { data: { choices: [{ text: answer }] } } = await ai.createCompletion('text-davinci-001', { prompt: message.text, temperature: 0.25, max_tokens: 480, top_p: 1, frequency_penalty: 0, presence_penalty: 0 })
    await say(answer.trimStart())
  } catch (error) {
    console.error('app.message', error)
    await say(`Sorry @<${message.user}>! I got this error: ${error.message}`)
  }
})

  ; (async () => {
    try {
      await app.start(80)
      console.log(`app.start ⚡️ https://${process.env.npm_package_name}:${80}`)
    } catch (error) {
      console.error('app.start', error)
    }
  })()

async function withFilter({ message: { bot_profile, subtype, thread_ts }, next }) {
  if (bot_profile || subtype || thread_ts) return
  await next()
}
