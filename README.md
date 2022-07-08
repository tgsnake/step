# step
step module for tgSnake :snake:
### Description 
The steps in Telegram bots are very important. 
For example, to get a person's full name, you should first ask him his first name and then his last name.
It will be difficult to implement these steps, especially if the project becomes bigger, but this module can easily implement these steps in the best possible way. :rocket: 
### install
You can use the following command to install 
```bash
npm install @tgsnake/step
```
### learning
Let's start with a simple example 
We want to get two numbers from the user and then add them together.
Let's write the code by step module :memo:
```javascript 
import {Snake} from "tgsnake";
import {Step} from "@tgsnake/step";
const bot  = new Snake({/*..config..*/});
const step = new Step({/*..config..*/});
let number = 0;
bot.on("message",(ctx)=>{
  step.set(ctx)
      .start("first",async ()=>{
          await ctx.reply("Enter the first number..");
      })
      .step("first",async ()=>{
          number = Number(ctx.text);
          await ctx.reply("Enter the second number ..");
          step.setStep("second");
      })
      .step("second",async ()=>{
          number += Number(ctx.text);
          await ctx.reply(`Your numbers have been added up ${number} \n Send /start to restart.`);
          number = 0;
          step.setStep("empty");
          // We are setting a pointless step here so the bot won't respond, you can create another step to handle this step. 
      })
      .end();
});

```

This document will be completed soon ... 
