## Tgsnake Step

step module for tgsnake. :snake:

#### Description

The steps in Telegram bots are very important.

For example, to get a person's full name, you should first ask him his first name and then his last name.

It will be difficult to implement these steps, especially if the project becomes bigger, but this module can easily implement these steps in the best possible way. :rocket:

#### install

```plaintext
npm install @tgsnake/step
```

### learning

Let's start with a simple example, We want to get two numbers from the user and then add them together.

Let's write the code by step module.

```typescript
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
          step.noStep();
          // We are setting a pointless step here so the bot won't respond, you can create another step to handle this step. 
      })
      .end();
});
```

---

#### Configurations

The required configurations must be passed to constructor in the form of an object when prototyping from class.

##### defaultMessage

When the bot is not started or does not have a specific step (by calling the noStep method) this message is sent to the user, if the value of this property is empty, nothing will be sent to the user.

---

#### Methods

List of methods you can use in the application development process.

#### set

This method receives the ctx value from you so that other methods can work. **If this method is not used before the other methods, the program will be in trouble.**

Example of use:

```typescript
bot.on("message",(ctx)=>{
   step.set(ctx);
})
```

#### start

This method is implemented when the robot starts, it takes this method and the amount, the first is a streat that is set as the user step, and the second value is a callback function that is called when the method is executed.

Example of use:

```typescript
step
.set(ctx)
.start("main",async ()=>{
   await ctx.reply("Hello")
})
.end();
```

#### end

Does not have an explanation in private. Only at the end of the program itself must be called, otherwise the program will work properly.

```typescript
step
.set(ctx)
.start("main",async ()=>{
   await ctx.reply("Hello")
})
.end(); // Always need to be called at the end
```

#### step

This is one of the most important and most used methods of this library.

It receives two values, the first being a string, and the second a callback function.

The first value acts as a condition, i.e. if the user's step value is equal to the given string, the method will be executed.

The second value, which is a callback function, is called when performing the method.

Example of use:

```typescript
step
.set(ctx)
.start('age',async ()=>{
  await ctx.reply("Hello, how old are you?");
})
.step('age',async ()=>{
  await ctx.reply(`Oh, ${ctx.text} is an important age`);
})
.end();
```

#### setStep

This method is also one of the most used, you can change the user using this step method.

Example of use:

```typescript
step
.set(ctx)
.start("age",async ()=>{
  await ctx.reply("Hello, how old are you?");
})
.step("age",async ()=>{
  await ctx.reply(`Oh, ${ctx.text} is an important age, What is your favorite color?`);
  step.setStep("color")
})
.step("color",async ()=>{
  await ctx.reply(‍`${ctx.text} is a beautiful color`);
})
.end();
```

#### plugin

This method is not likable to most users. Because it is async, it continuously cuts the method chain.  
This method can be used to install plugins, or you can use it with a special architecture to write your methods in separate files.  
This method receives two parameters, the first with the name instance, which is the object of your program within it, and any changes to it are also applied to the main object.  
The second parameter is done, which can allow the program to pass and go to the rest of the step if it is called and adjusted as a return value.  
Exactly an implementation similar to next in middleware.

Example of use:

```typescript
step
.set(ctx)
.start("main",async ()=>{
   await ctx.reply("Hello, how old are you?");
});

await step.plugin(async (_instance, done)=>{
   if(isNaN(Number(ctx.text))){
      await ctx.reply("Only numbers are allowed");
   }else{
      return done();
   }
});

step
.step("age",async ()=>{
  await ctx.reply(`Oh, ${ctx.text} is an important age, What is your favorite color?`);
  step.noStep();
})
.end();
```

Example of use 2:

```typescript
step
.set(ctx);

// Import from external files
await step.plugin(require("plugins/first"));
await step.plugin(require("plugins/second"));
await step.plugin(require("plugins/third"));

step
.end();
```

#### noStep

Emptys the step value, so no step requirement will be included for this user until he starts the bot from scratch.  
It also displays the message to the user if there is a defaultMessage in the config.

Example of use:

```typescript
step
.set(ctx)
.start("name",async ()=>{
   await ctx.reply("Hi, what is your name?");
})
.step("name",async ()=>{
   await ctx.relpy(`${ctx.text} is a beautiful name, bye bye 😁`);
   step.noStep()
})
.end();
```

#### getStep

This method is not of particular use and is more useful for plugins.  
The task of this method is to return the user's step value.

Example of use:

```typescript
step
.set(ctx)
.start("name",async ()=>{
   await ctx.reply("Hi, what is your name?");
})

await step.plugin(async (instance,next)=>{
   if(instance.getStep() === "name"){
       if(isNaN(Number(ctx.text))){
          return done();
       }else{
          await ctx.reply("No numbers allowed");
       }
   }
});

step
.step("name",async ()=>{
   await ctx.relpy(`${ctx.text} is a beautiful name, how old are oyu?`);
   step.setStep("age");
})
.step("age", async ()=>{
  await ctx.reply(`Oh, ${ctx.text} is an important age, What is your favorite color?`);
  step.noStep();
})
.end();
```

---

### Additional descriptions

Additional descriptions of the module

*   The purpose of the construction

The purpose of building this module was to make it easier to use tgsnake.

Especially since the implementation of step system makes the project much busier.

*   Why should the module be used within the event?

We implemented the module so that it must be within the event. We could develop this module like a separate framework and implement the items in a simpler way.  
But the purpose of building this module was to be used within Tgsnake, not independently!  
Also, if you use in the form of a separate framework , you could no longer directly use other Tgsnake modules.

---

Build with ♥️ by [tgsnake dev](https://t.me/+Fdu8unNApTg3ZGU1).