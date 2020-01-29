export function camelToSnakeCase(string, delimiter = '_') {
  return string.replace(
    /[A-Z]/g,
    letter => `${delimiter}${letter.toLowerCase()}`
  );
}
