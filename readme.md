# slack.codin.gg

**This is a simple slack app (well bot) that makes use of gpt3. Feel free to improve the project however you like ❤️**
## Have fun with gpt3 locally

**Clone (or fork 🚀) the repository**
```sh
gh repo clone ivoputzer/slack.codin.gg
cd slack.codin.gg
```

**Create an `.npmrc` file with your https://openai.com secret**
```ini
openai_secret=<open-ai-secret>
```

**Have fun with gpt3 in your terminal**
```
npm run prompt
```

**Secret can also be embedded into the command**
```
npm run prompt --openai_secret=<open-ai-secret>
```

**Run prompt with text to speech**
```
npm run prompt --openai_secret=<open-ai-secret> -- --tts
```

## Contribute
Fork the repo open PR and get in touch 📬

## Todo
- [ ] give gpt3 more context, keep a rotating buffer of previous messages
- [ ] set typing for as long as the request towards openai is loading
- [ ] find a way to clear channel messages via pattern matching or slash command (can be implemented on the slack config directly)
