const { Telegraf, Markup } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const dotenv = require('dotenv');

dotenv.config();


const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', async (ctx) => {

});

bot.command('D@SH_upload', async (ctx) => {

});

bot.on('location', async (ctx) => {

});

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))  