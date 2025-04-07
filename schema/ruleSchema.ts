import { z } from "zod"

export const createRuleSchema = z.object({
  inputDevice: z
    .string({ required_error: "Input Device is required" })
    .min(1, "Input Device is required"),
  outputDevices: z
    .array(z.object({ value: z.string() }))
    .min(1, "Choose at least one output device"),
})
