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
}
