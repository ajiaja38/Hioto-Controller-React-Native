import { EDevice } from "@/types/enum/EDevice.enum";
import { z } from "zod";

export const registerDeviceSchema = z.object({
  guid: z
    .string({ required_error: "Guid is required" })
    .min(16, { message: "Guid is required" }),
  mac: z
    .string({ required_error: "Mac Address is required" })
    .min(1, { message: "Mac Address is required" }),
  type: z.enum([EDevice.AKTUATOR, EDevice.SENSOR], {
    message: "Type is required",
  }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" }),
  version: z
    .string({ required_error: "Version is required" })
    .min(1, { message: "Version is required" }),
  minor: z
    .string({ required_error: "Minor is required" })
    .min(1, { message: "Minor is required" }),
});
