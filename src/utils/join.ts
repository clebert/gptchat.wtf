export function join(
  ...classNames: (string | false | null | undefined)[]
): string {
  return classNames.filter(Boolean).join(` `);
}
