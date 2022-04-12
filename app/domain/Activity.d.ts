import { InferType } from "yup";
import { validationSchema } from "./Activity";

export type Activity = InferType<typeof validationSchema>;
