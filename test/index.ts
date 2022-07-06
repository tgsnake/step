import { Snake } from "tgsnake";
import { Step } from "../src/index";

const bot = new Snake({
  apiId: 1,
  apiHash: "",
  botToken: "",
});

const step = new Step({ defaultMessage: "please send /start" })!;

bot.on("message", (ctx) => {
  step
    .set(ctx)
    .start("main", async () => {
      await ctx.reply("hello user");
    })
    .step("main", async () => {
      await ctx.reply("message from main");
      step.setStep("home");
    })
    .addon((_ctx, data) => {
      data.push({ test: 1 });
      console.log(data);
      return { data, performed: true };
    })
    .step("home", async () => {
      await ctx.reply("messgae from home");
      step.setStep("main");
    })
    .end();
});

bot.run();
