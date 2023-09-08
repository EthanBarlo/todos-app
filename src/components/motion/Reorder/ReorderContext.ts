import { createContext } from "react";
import { ReorderContextProps } from "./types";

export const ReorderContext = createContext<ReorderContextProps<any> | null>(null);
