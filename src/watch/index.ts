import { exec, spawn } from 'child_process';
import { watch } from 'chokidar';
import { exit } from 'process';

export function applizeWatch(directory: string, target: string, builder: string) {
  const watcher = watch(directory, {
    persistent: true
  });

  let process = spawn(`node ${target}`);
  process.stdout.on('data', data => {
    console.log((<{toString: () => string}>data).toString());
  });

  watcher.on('ready', () => {

    ['add', 'change', 'unlink'].forEach(v => {
      watcher.on(v, () => {
        exec(`node ${builder}`, (error, stdout) => {
          if(error) exit(1);
          console.log(stdout);
          process.kill();
          process = spawn(`node ${target}`);
          process.stdout.on('data', data => {
            console.log((<{toString: () => string}>data).toString());
          });
        });
      });
    });
  });
}
