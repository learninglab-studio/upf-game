const { App } = require('@slack/bolt');
const airtableTools = require(`./src/utilities/airtable-tools`);
const { game1, game2, harvardLife } = require('./src/games')
const newSituationDMFromMove = require('./src/game-tools/new-situation-dm-from-move');
const { blue, darkgray, gray, magenta, yellow, divider, red } = require('./src/utilities/mk-loggers')
const { appHome } = require('./src/game-tools')

require('dotenv').config()

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN // add this
});

app.message('hello', async ({ message, say }) => {
    await say(`Hey there <@${message.user}>!`);
});

app.view(/.*/, async ({ body, ack }) => { 
    ack();
    blue(body);
});

// app.event(/.*/, async ({ event }) => { darkgray(event) });
// app.event("reaction_added", async ({ event, client }) => { yellow("got a reaction", event) });
app.event('app_home_opened', appHome);

// app.action("tg_choice_made", newSituationDMFromMove);
app.action("hl_choice_made", harvardLife.handleChoice);

app.action(/.*/, async ({ payload, context, body, ack }) => {
    await ack();
    // darkgray(divider, `ACTION PAYLOAD`, divider, payload);
    // darkgray(divider, `ACTION BODY`, divider, body);
})


// app.command("/game1", game1);
// app.command("/game2", game2);
app.command("/harvardlife",
    harvardLife.start
);



(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  red('⚡️ Bolt app is running!');
})();