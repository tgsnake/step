import type { Context } from "tgsnake";

type callBack = () => void;

type NextFunction = boolean;

export type Done = () => NextFunction;
export type PluginFunc = (instance : Step,done : Done) => (NextFunction | any);

const done : Done = () => {
  return false;
}

class User {
  constructor(readonly userId: bigint, public step: string) {}
}

export class Step {
  private userPool: User[] = [];
  //@ts-ignore
  private ctx: Context.Combine<Context.MessageContext, {}>;
  private performed: boolean = false;
  constructor(private config?: { defaultMessage?: string }) {
    this.config ||= {};
    this.config.defaultMessage = this?.config?.defaultMessage || "";
  }
  set(ctx: Context.Combine<Context.MessageContext, {}>) {
    this.ctx = ctx;
    return this;
  }
  start(s: string, callBack: callBack) {
    if (["/start", "!start"].includes(this.ctx.text || "")) {
      this.userPool.push(new User(this.ctx.from.id, s));
      callBack();
      this.performed = true;
    }
    return this;
  }
  step(s: string, callBack: callBack) {
    if (this.performed) return this;
    const user = this.userPool.find((x) => x.step === s);
    if (!user || user.step !== s) return this;
    callBack();
    this.performed = true;
    return this;
  }
  setStep(s: string): void {
    const user = this.userPool.findIndex((x) => x.userId === this.ctx.from.id);
    if (user === -1) return;
    this.userPool[user].step = s;
  }
  async plugin(pluginFunc : PluginFunc){
    if(this.performed) return;
    const returnValue = await pluginFunc(this,done);
    this.performed = returnValue === undefined;
    return;
  }
  noStep(){
    const user = this.userPool.findIndex((x) => x.userId === this.ctx.from.id);
    if (user === -1) return;
    this.userPool[user].step = "";
  }
  getStep() : string | boolean {
    const user = this.userPool.find((x) => x.userId === this.ctx.from.id);
    if (!user) return false;
    return user.step;
  }
  end() {
    if (!this.performed && this?.config?.defaultMessage)
      this.ctx.reply(this.config.defaultMessage);
    this.performed = false;
  }
}
