export type TLogger = {
  error: (message: string, err: unknown) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
  http: (message: string) => void;
  debug: (message: string) => void;
};
