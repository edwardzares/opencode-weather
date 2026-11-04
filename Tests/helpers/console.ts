export type ConsoleCapture = {
  lines: string[];
  text: () => string;
  restore: () => void;
};

export function captureConsole(): ConsoleCapture {
  const original = console.log;
  const lines: string[] = [];

  console.log = (...args: unknown[]) => {
    lines.push(args.map((arg) => String(arg)).join(" "));
  };

  return {
    lines,
    text: () => lines.join("\n"),
    restore: () => {
      console.log = original;
    },
  };
}
