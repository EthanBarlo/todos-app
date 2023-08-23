"use client";
// Import External
import { tv } from "tailwind-variants";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline } from "react-icons/io5";

// Import Internal
import { trpc } from "@/trpc/client";
import { Card } from "@/components/atomic";

const _styles = tv({
	base: "text-black",
	slots: {
		name: "text-lg",
		checkIcon: "text-red-500 cursor-pointer",
	},
});

interface ITodoCard {
	id: number;
	name: string | null;
	isComplete: boolean;
}
export default function TodoCard({ id, name, isComplete }: ITodoCard) {
	const styles = _styles();

	const utils = trpc.useContext();
	const setDone = trpc.setDone.useMutation({
		onSettled() {
			utils.getTodos.invalidate();
		},
	});

	return (
		<Card key={id} className={styles.base()}>
			<p className={styles.name()}>{name ?? "Undefined"}</p>
			<span onClick={() => setDone.mutate({ id: id, done: isComplete ? 0 : 1 })}>
				{isComplete ? (
					<IoCheckmarkCircle size={30} className={styles.checkIcon()} />
				) : (
					<IoCheckmarkCircleOutline size={30} className={styles.checkIcon()} />
				)}
			</span>
		</Card>
	);
}
