interface IApplizeBuildPhase {
  name: string;
  execute: () => Promise<void>;
}

export class ApplizeBuilder {
  phases: IApplizeBuildPhase[] = [];

  addPhase(name: string, execute: () => void): void {
    this.phases.push({ name, execute: () => Promise.resolve(execute()) });
  }

  addPhaseAsync(name: string, execute: () => Promise<void>): void {
    this.phases.push({ name, execute });
  }

  async run() {
    await this.phases
    .map<{ index: number } & IApplizeBuildPhase>((v, i) => ({ index: i, ...v }))
    .map(v => {
      return v.execute;
    })
    .reduce((a, b) => () => a().then(b), () => Promise.resolve())();
  }
}
