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


## install `ai` command

To have a global `ai` command available to interact with OpenAI, do the following (to be improved with npm install -g)

1. `gh repo clone ivoputzer/slack.codin.gg`
2. `cd slack.codin.gg`
3. Run `npm i -g .` to install the `ai` command globally
4. To run the command `ai` from anywhere, setup the environment variable `OPENAI_API_KEY` or edit global configuration located at `~/.npmrc`
5. Run `ai` and you'll be presented an interactive CLI to interact with OpenAI 

## Contribute
Fork the repo open PR and get in touch 📬

## Todo
- [ ] give gpt3 more context, keep a rotating buffer of previous messages
- [ ] set typing for as long as the request towards openai is loading
- [ ] find a way to clear channel messages via pattern matching or slash command (can be implemented on the slack config directly)
