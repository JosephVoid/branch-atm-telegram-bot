import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { updateFID, getClosestATMs, getClosestBranches } from './api.js';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

async function displayResults(_bot, _ctx, result) {
  for (let index = 0; index < result.length; index += 1) {
    const element = result[index];
    if (element.ENTITY.FID !== null) {
      await _bot.telegram.sendPhoto(_ctx.chat.id, element.ENTITY.FID, {
        caption: `🏢\t${element.ENTITY.LOCATION.toUpperCase()}
      \n🚶🏾‍♂️\tDistance: ${(element.dist < 1 ? `${Math.round(element.dist * 100)} m` : `${element.dist} km`)}
      \n🗺\thttps://maps.google.com/?q=${element.ENTITY.LATITIUDE},${element.ENTITY.LONGITUDE}`,
      });
    } else {
      await _bot.telegram.sendMessage(_ctx.chat.id, `🏢\t${element.ENTITY.LOCATION.toUpperCase()}
      \n🚶🏾‍♂️\tDistance: ${(element.dist < 1 ? `${Math.round(element.dist * 100)} m` : `${element.dist} km`)}
      \n🗺\thttps://maps.google.com/?q=${element.ENTITY.LATITIUDE},${element.ENTITY.LONGITUDE}`);
    }
  }
}

// bot.catch((err) =>{
//   console.log("Caught: "+err);
// })

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
  if (process.env.ADMN1 === `${ctx.message.from.id}` ||
    process.env.ADMN2 === `${ctx.message.from.id}` ||
    process.env.ADMN3 === `${ctx.message.from.id}` ||
    process.env.ADMN4 === `${ctx.message.from.id}`
  ) {
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
      await displayResults(bot, ctx, result);
    }
  } else {
    const result = await getClosestATMs(
      5,
      ctx.message.location.latitude,
      ctx.message.location.longitude,
    );
    if (result) {
      await displayResults(bot, ctx, result);
    }
  }
  ctx.reply(
    '👆 Here are the closest 5.\n\nGet more location?',
    Markup.keyboard([['Branch', 'ATM']])
      .oneTime()
      .resize(),
  );
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
