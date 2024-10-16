type Sub = {
  event: string;
  action: () => void;
};

export class PubSub {
  private subs: Sub[];
  private static instance: PubSub | null;

  private constructor() {
    this.subs = [];
  }

  public static getInstance(): PubSub {
    if (!this.instance) {
      this.instance = new PubSub();
    }
    return this.instance;
  }

  public subscribe(sub: Sub): void {
    this.subs.push(sub);
  }

  public publish(event: string): void {
    this.subs.forEach((sub) => {
      if (sub.event === event) {
        sub.action();
      }
    });
  }
}
