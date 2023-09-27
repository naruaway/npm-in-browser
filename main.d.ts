export declare const runNpmCli: (
  args: string[],
  options: {
    fs: unknown;
    cwd: string;
    stdout: (chunk: string) => void;
    stderr: (chunk: string) => void;
  },
) => Promise<void>;
