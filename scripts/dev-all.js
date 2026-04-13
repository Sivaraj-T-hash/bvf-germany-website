import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';

const children = [];
let exiting = false;

function prefixLog(prefix, stream, chunk) {
  const text = chunk.toString();
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    if (!line) continue;
    stream.write(`[${prefix}] ${line}\n`);
  }
}

function run(name, script) {
  const command = isWindows ? 'cmd.exe' : 'npm';
  const args = isWindows ? ['/d', '/s', '/c', `npm run ${script}`] : ['run', script];

  const child = spawn(command, args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: false,
  });

  child.stdout.on('data', (chunk) => prefixLog(name, process.stdout, chunk));
  child.stderr.on('data', (chunk) => prefixLog(name, process.stderr, chunk));
  child.on('error', (error) => {
    if (exiting) return;
    console.error(`[runner] Failed to start ${name}:`, error);
    shutdown(1);
  });

  child.on('exit', (code, signal) => {
    if (exiting) {
      return;
    }

    const result = signal ? `signal ${signal}` : `code ${code ?? 0}`;
    console.log(`[runner] ${name} exited with ${result}. Stopping other processes...`);
    shutdown(code ?? 0);
  });

  children.push(child);
}

function shutdown(exitCode = 0) {
  if (exiting) {
    return;
  }

  exiting = true;

  for (const child of children) {
    if (child.exitCode === null) {
      child.kill('SIGINT');
    }
  }

  setTimeout(() => {
    for (const child of children) {
      if (child.exitCode === null) {
        child.kill('SIGTERM');
      }
    }
    process.exit(exitCode);
  }, 400);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('server', 'server');
run('frontend', 'dev');
