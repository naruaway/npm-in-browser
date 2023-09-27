export declare const runNpmCli: (
  args: string[],
  options: {
    fs: unknown;
    cwd: string;
    stdout?: (chunk: string) => void;
    stderr?: (chunk: string) => void;
    timings?: {
      start: (name: string) => void
      end: (name: string) => void
    },
  },
) => Promise<void>;
