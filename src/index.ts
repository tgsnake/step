import type { Context } from "tgsnake";

type callBack = () => {};

export type stepAddon = (
  ctx: Context.Combine<Context.MessageContext, {}>,
  data: any[]
) => { data: any[]; performed: boolean };

class User {
  constructor(readonly userId: bigint, public step: string) {}
}

export class Step {
  private userPool: User[] = [];
  private addonData: any[] = [];
  private i: number = 0;
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
  addon(a: stepAddon) {
    if (this.performed) return this;
    if (!this.addonData[this.i]) this.addonData.push([]);
    const retunValue = a(this.ctx, this.addonData[this.i]);
    this.addonData[this.i] = retunValue.data;
    this.performed = retunValue.performed;
    this.i++;
    return this;
  }
  end() {
    if (!this.performed && this?.config?.defaultMessage)
      this.ctx.reply(this.config.defaultMessage);
    this.i = 0;
    this.performed = false;
  }
}
