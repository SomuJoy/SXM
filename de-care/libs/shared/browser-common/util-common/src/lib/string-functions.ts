export function toTitleCase(val: string): string {
    return val
        ? val
              .toLowerCase()
              .split(' ')
              .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
              .join(' ')
        : val;
}
