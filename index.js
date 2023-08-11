import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { updateFID, getClosestATMs, getClosestBranches } from './api.js';

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

bot.on('photo', async (ctx) => {
  if (process.env.ADMN === `${ctx.message.from.id}`) {
    const fileId = ctx.message.photo[0].file_id;
    const photoType = ctx.message.caption[0].toLocaleLowerCase() ?? '';
    const entityId = ctx.message.caption.split(' ')[1] ?? '';

    if (await updateFID(entityId, photoType, fileId)) {
      ctx.reply('Updated!');
    } else {
      ctx.reply('Something went wrong!');
    }
  }
});

bot.on('location', async (ctx) => {
  if (locationType === 'BRANCH') {
    const result = await getClosestBranches(
      5,
      ctx.message.location.latitude,
      ctx.message.location.longitude,
    );
    if (result) {
      result.forEach((branch) => {
        ctx.reply(branch);
      });
    }
  } else {
    const result = await getClosestATMs(
      5,
      ctx.message.location.latitude,
      ctx.message.location.longitude,
    );
    if (result) {
      result.forEach((atm) => {
        ctx.reply(atm);
      });
    }
  }
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
