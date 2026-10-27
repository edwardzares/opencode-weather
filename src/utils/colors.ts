const enabled = Boolean(process.stdout.isTTY);

function style(code: string, text: string): string {
  return enabled ? `\u001b[${code}m${text}\u001b[0m` : text;
}

export const colors = {
  cyan: (text: string) => style("36", text),
  green: (text: string) => style("32", text),
  yellow: (text: string) => style("33", text),
  red: (text: string) => style("31", text),
  bold: (text: string) => style("1", text),
  dim: (text: string) => style("2", text),
};
