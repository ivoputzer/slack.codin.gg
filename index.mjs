import { Configuration, OpenAIApi } from 'openai'
import bolt from '@slack/bolt'

const { App, LogLevel } = bolt // cjs module

const config = new Configuration({ apiKey: process.env.npm_config_openai_secret })
const api = new OpenAIApi(config)
const app = new App({ signingSecret: process.env.npm_config_slack_secret, token: process.env.npm_config_slack_token, logLevel: LogLevel.DEBUG, port: 80 })

let systemContent = 'You\'re a chatbot called "<@U02V045R679>" that responds to messages in the style of Marvin from The Hitchhiker\'s Guide to the Galaxy by Douglas Adams. You can use markdown to improve the readability of your answers.'

app.command('/system', async ({ command: { text }, ack, say }) => {
  try {
    console.log('app.command /system', systemContent, text)
    await ack()
    systemContent = text
    await say(`system message has been updated:\n\`\`\`diff\n-   ${systemContent}\n+   ${text}\n\`\`\`\n`)
  } catch (error) {
    console.log('app.command /system (error)', error)
  }
})

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
            content: systemContent
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
