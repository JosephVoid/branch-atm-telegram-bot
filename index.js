const { Telegraf, Markup } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

let locationType;
bot.command('start', async (ctx) => {
  ctx.reply(
    'What location do you want?',
    Markup.keyboard([['Branch', 'ATM']])
      .oneTime()
      .resize(),
  );
});

bot.hears('Branch', (ctx) => {
  locationType = 'BRANCH';
  ctx.reply(
    'Send us your location, so we know where you are...\nእባክዎ ያሉበትን ቦታ ይላኩልን...',
    Markup.keyboard([
      [Markup.button.locationRequest('Send Location\t ይሄን ይጫኑ', false)],
    ])
      .oneTime()
      .resize(),
  );
});

bot.hears('ATM', (ctx) => {
  locationType = 'ATM';
  ctx.reply(
    'Send us your location, so we know where you are...\nእባክዎ ያሉበትን ቦታ ይላኩልን...',
    Markup.keyboard([
      [Markup.button.locationRequest('Send Location\t ይሄን ይጫኑ', false)],
    ])
      .oneTime()
      .resize(),
  );
});

bot.command('D@SH_upload', async (ctx) => {
  if (process.env.ADM === ctx.message.from.id) {
    ctx.reply('Upload');
  }
});

bot.on('location', async (ctx) => {
  if (locationType === 'BRANCH') {
    ctx.reply('Branch Location');
  } else {
    ctx.reply('ATM Location');
  }
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
