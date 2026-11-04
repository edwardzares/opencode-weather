export type Colors = {
  cyan: (text: string) => string;
  green: (text: string) => string;
  yellow: (text: string) => string;
  red: (text: string) => string;
  bold: (text: string) => string;
  dim: (text: string) => string;
};

export function createColors(enabled: boolean): Colors {
  function style(code: string, text: string): string {
    return enabled ? `\u001b[${code}m${text}\u001b[0m` : text;
  }

  return {
    cyan: (text: string) => style("36", text),
    green: (text: string) => style("32", text),
    yellow: (text: string) => style("33", text),
    red: (text: string) => style("31", text),
    bold: (text: string) => style("1", text),
    dim: (text: string) => style("2", text),
  };
}

export const colors = createColors(Boolean(process.stdout.isTTY));
