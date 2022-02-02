import {
  say,
  decorate,
  colors,
  symbols,
  filledBySpace,
} from '../util/console/consoleCommunicater';

interface IApplizeBuildPhase {
  name: string;
  execute: () => Promise<boolean>;
}

export class ApplizeBuilder {
  phases: IApplizeBuildPhase[] = [];

  addPhase(name: string, execute: () => boolean): void {
    this.phases.push({ name, execute: () => Promise.resolve(execute()) });
  }

  addPhaseAsync(name: string, execute: () => Promise<boolean>): void {
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
            ' ApplizeBuilder',
        ],
        4,
        1,
        decorate(colors.white, colors.pink, true)
      )
    );
    say();
    const success = await this.phases
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
        const result = await v.execute();
        say(
          decorate(result ? colors.gray : colors.pink, undefined, !result),
          `( ${result ? 'Done' : 'Failed'} in `,
          `${new Date().getTime() - start}ms`,
          ' )'
        );
        say();
        return result;
      })
      .reduce(
        (a, b) => () => a().then(async v => v ? await b() : Promise.resolve(false)),
        () => Promise.resolve(true)
      )();
    if ( success ) {
      say(
        decorate(colors.white, colors.pink, true),
        ' FINISHED ',
        decorate(),
        ' ',
        'Total time: ',
        `${new Date().getTime() - phaseStart}ms`
      );
    } else {
      say(
        decorate(colors.white, colors.pink, true),
        ' FAILED! ',
        decorate(),
        ' ',
        'Total time: ',
        `${new Date().getTime() - phaseStart}ms`
      );
    }
  }
}
