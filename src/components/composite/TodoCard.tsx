"use client";
// Import External
import { tv } from "tailwind-variants";
import { IoTrashOutline } from "react-icons/io5";

// Import Internal
import { trpc } from "@/trpc/client";
import { useCallback } from "react";

import { Todo } from "@/db/schema";
import { Checkbox } from "@nextui-org/checkbox";
import { Card, CardBody } from "@nextui-org/card";

const _styles = tv({
	base: "text-foreground hover:scale-[1.0125] hover:-translate-y-1 transition-all duration-300 ease-in-out",
	slots: {
		name: "text-lg",
		checkIcon: "text-green-700 cursor-pointer",
		binIcon: "text-red-500 cursor-pointer",
	},
});

export default function TodoCard({ id, name, done, scheduledDay }: Todo) {
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
		<Card key={id} className={styles.base()} draggable onDragStart={onDrag}>
			<CardBody>
				<Checkbox
					isSelected={done === 1}
					onValueChange={(value) => updateTodo.mutate({ id, done: value ? 1 : 0 })}
					lineThrough>
					<p className={styles.name()}>{name ?? "Undefined"}</p>
				</Checkbox>
				<IoTrashOutline size={30} className={styles.binIcon()} onClick={() => deleteTodo.mutate(id)} />
			</CardBody>
		</Card>
	);
}
