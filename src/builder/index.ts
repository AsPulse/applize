import {
  say,
  decorate,
  colors,
  symbols,
  outlined,
  filledBySpace,
} from '../util/console/consoleCommunicater';

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
    const phaseStart = new Date().getTime();
    say();
    say(
      filledBySpace(
        [
          decorate(colors.white, colors.pink, true) +
            symbols.hexagon +
            ' ApplizeBuilder'
        ],
        4,
        1,
        decorate(colors.white, colors.pink, true)
      )
    );
    say();
    await this.phases
      .map<{ index: number } & IApplizeBuildPhase>((v, i) => ({
        index: i,
        ...v,
      }))
      .map(v => async () => {
        const start = new Date().getTime();
        say(
          decorate(colors.white, colors.pink, true),
          ' ',
          `${v.index + 1}/${this.phases.length}`,
          ' ',
          decorate(colors.pink, undefined, true),
          ' ',
          v.name
        );
        await v.execute();
        say(
          decorate(colors.gray),
          '( Done in ',
          `${new Date().getTime() - start}ms`,
          ' )'
        );
        say();
      })
      .reduce(
        (a, b) => () => a().then(b),
        () => Promise.resolve()
      )();

    say(
      decorate(colors.white, colors.pink, true),
      ' FINISHED ',
      decorate(), ' ',
      'Total time: ',
      `${new Date().getTime() - phaseStart}ms`
    );
  }
}
