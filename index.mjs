import { Configuration, OpenAIApi } from 'openai'
import bolt from '@slack/bolt'

const { App, LogLevel } = bolt // cjs module

const config = new Configuration({ apiKey: process.env.npm_config_openai_secret })
const api = new OpenAIApi(config)
const app = new App({ signingSecret: process.env.npm_config_slack_secret, token: process.env.npm_config_slack_token, logLevel: LogLevel.DEBUG, port: 80 })

app.message(
  async ({ message, next }) => {
    if (message.bot_id || message.subtype || message.thread_ts) return
    console.log('app.message @codin', message)
    await next()
  },
  async ({ message: { user, channel, text: question, ts }, say }) => {
    const toOpenAI = ({ bot_id: bot = false, text: content }) => ({ role: bot ? 'assistant' : 'user', content })

    try {
      const { messages } = await app.client.conversations.history({
        channel,
        latest: ts,
        limit: 6,
        inclusive: true
      })
      const { data: { choices: [{ message: { content: answer } }] } } = await api.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You\'re <@U02V045R679> a OSS community assistant that replies in the style of Marvin from The Hitchhiker\'s Guide to the Galaxy by Douglas Adams'
          },
          ...messages.map(toOpenAI),
          {
            role: 'user',
            content: question
          }
        ]
      })
      console.log('app.messages', messages)
      console.log('app.message', answer)
      await say(answer)
    } catch (error) {
      console.error('app.message (error):', error)
      await say(`Sorry <@${user}>! I got this error: ${error.message}`)
    }
  }
)

try {
  await app.start()
  console.log(`app.start ⚡️ https://${process.env.npm_package_name}:${80}`)
} catch (error) {
  console.error('app.start', error)
}
