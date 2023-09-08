import { Axis, Box } from "framer-motion";

export interface ReorderContextProps<T> {
	axis: "x" | "y";
	registerItem: (id: T, layout: Box) => void;
	updateOrder: (id: T, offset: number, velocity: number) => void;
}

export interface ItemData<T> {
	value: T;
	layout: Axis;
}
