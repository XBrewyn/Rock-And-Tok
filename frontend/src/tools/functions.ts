/**
 * Constructs a className string from multiple class name parts.
 * @param {...string} props - The class name parts to concatenate.
 * @returns {string} The concatenated class name string.
 */
const getClassName = (...props: string[]): string => {
  let classes: string = '';

  for (let prop of props)
    if (prop) classes += `${prop} `;

  return classes.trim();
}

export {
  getClassName
}