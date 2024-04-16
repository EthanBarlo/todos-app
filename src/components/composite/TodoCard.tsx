"use client";
// Import Types
import { Todo } from "@/db/schema";

// Import External
import { useCallback } from "react";
import { tv } from "tailwind-variants";
import { IoTrashOutline } from "react-icons/io5";
import { Checkbox } from "@nextui-org/checkbox";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

// Import Internal
import { trpc } from "@/trpc/client";
import Link from "next/link";

const _styles = tv({
	base: "text-foreground hover:scale-[1.0125] hover:-translate-y-1 transition-all duration-300 ease-in-out",
	slots: {
		name: "text-lg",
		checkIcon: "text-green-700 cursor-pointer",
		binIcon: "text-red-500 cursor-pointer",
	},
});

export default function TodoCard({ id, name, done, scheduledDay, content }: Todo) {
	const styles = _styles();

	const utils = trpc.useContext();
	const updateTodo = trpc.todos.update.useMutation({
		onSettled() {
			utils.todos.getAll.invalidate();
			utils.todos.getAllByDay.invalidate(scheduledDay ?? "");
		},
	});
	const deleteTodo = trpc.todos.delete.useMutation({
		onSettled() {
			utils.todos.getAll.invalidate();
			utils.todos.getAllByDay.invalidate(scheduledDay ?? "");
		},
	});

	// Sets the draggable data to the id of the todo, which we use in the dropzone to identify which todo to move
	const onDrag = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.dataTransfer.setData("id", id.toString());
			e.dataTransfer.setData("previousDay", scheduledDay ?? "");
		},
		[id]
	);

	return (
		<Link href={`/todo/${id}`}>
			<Card key={id} className={styles.base()} draggable onDragStart={onDrag}>
				<CardHeader className="flex w-full justify-between">
					<Checkbox
						isSelected={done === 1}
						onValueChange={(value) => updateTodo.mutate({ id, done: value ? 1 : 0 })}
						lineThrough>
						<p className={styles.name()}>{name ?? "Undefined"}</p>
					</Checkbox>
					<IoTrashOutline size={30} className={styles.binIcon()} onClick={() => deleteTodo.mutate(id)} />
				</CardHeader>
				<CardBody className="pt-0 text-sm text-foreground-500">{content}</CardBody>
			</Card>
		</Link>
	);
}
