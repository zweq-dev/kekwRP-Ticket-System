module.exports = class {
    constructor(client) {
      this.client = client;

    }

  async run() {
    this.client.user.setActivity(`ZWEQ#? BOT SYSTEMS`);
    this.client.user.setStatus('idle');
    this.client.logger.log(`${this.client.user.tag}, kullanıma hazır! Dev by ZWEQ`, "ready");
  }
}
