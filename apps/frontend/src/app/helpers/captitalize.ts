export const capitalizeFirstLetter = (input: string): string => {
  if (input.length === 0) {
    return input; // Return unchanged if the input is an empty string
  }

  return input.charAt(0).toUpperCase() + input.slice(1);
};
