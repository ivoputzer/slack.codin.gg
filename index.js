const { Configuration, OpenAIApi } = require('openai')
const { App, LogLevel } = require('@slack/bolt')

const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret })
const ai = new OpenAIApi(configuration)
const app = new App({ signingSecret: process.env.npm_config_slack_secret, token: process.env.npm_config_slack_token, logLevel: LogLevel.DEBUG })
const messages = []

  ; (async (bolt) => {
    bolt.message(onMessage)
    await bolt.start(80)
    console.log(`⚡️ Bolt is available at https://${process.env.npm_package_name}:${80}`)
  })(app)

async function onMessage({ message, say }) {
  console.debug(message)
  const { data: { choices: [{ text: answer }] } } = await ai.createCompletion('text-davinci-001', { prompt: message.text, temperature: 0.25, max_tokens: 480, top_p: 1, frequency_penalty: 0, presence_penalty: 0 })
  await say(answer.trimStart())
}
