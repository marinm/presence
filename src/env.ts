import { z } from "zod";

export const env = z
  .object({
    VITE_SERVER_PATH: z.coerce.string(),
    VITE_CHANNEL: z.coerce.string(),
  })
  .parse(import.meta.env);
