export const isValidEmail = (email: string): boolean => {
  //     /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i.
  return /^[A-Z0-9_+-]+(\.[A-Z0-9_+-]+)*@[A-Z0-9]+(\.[A-Z0-9][A-Z0-9-]*)*[A-Z]{2}$/i.test(email);
};
