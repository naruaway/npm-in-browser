// NPM_IN_BROWSER$PROCESS_PARAMS
export interface ProcessInitType {
  //  '/home/web/app'
  cwd: string;
  // /path/to/node
  execPath: string;
  // "npm", "install", 'react-dom', 'react', 'zod', 'framer-motion', 'react-icons'
  args: string[];
  exit: (exitCode: number) => void;
  console: {
    log: (message: string) => void;
    error: (message: string) => void;
    warn: (message: string) => void;
  };
}
