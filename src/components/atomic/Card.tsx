import { DetailedHTMLProps, HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
	base: "bg-white rounded-xl p-4 shadow shadow-black/5 ring-1 ring-white/10",
});

interface ICard extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: React.ReactNode;
}
export default function Card({ children, className, ...rest }: ICard) {
	return (
		<div className={styles({ className })} {...rest}>
			{children}
		</div>
	);
}
