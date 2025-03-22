import { z } from "zod";

const emailScheme = z.string().email();

export const isValidEmail = (email: string): boolean => {
  return emailScheme.safeParse(email).success;
};
