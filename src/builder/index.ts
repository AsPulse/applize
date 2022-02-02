interface IApplizeBuildPhase {
  name: string;
  execute: () => void;
}

export class ApplizeBuilder {
  phases: IApplizeBuildPhase[] = [];

  addPhase(name: string, execute: () => void): void {
    this.phases.push({ name, execute });
  }
}
