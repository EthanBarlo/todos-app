"use client";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("./features").then((res) => res.default);

interface IMotionProvider {
	children: React.ReactNode;
}
export default function MotionProvider({ children }: IMotionProvider) {
	return (
		<LazyMotion features={loadFeatures} strict>
			{children}
		</LazyMotion>
	);
}
