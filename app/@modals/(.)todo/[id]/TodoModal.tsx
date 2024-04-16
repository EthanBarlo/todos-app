"use client";
// Import Types
import { Todo } from "@/db/schema";

// Import External
import { Checkbox, ModalBody, ModalHeader, tv } from "@nextui-org/react";

// Import Internal
import RouteModal from "@/components/RouteModal";
import { trpc } from "@/trpc/client";

const _styles = tv({
	base: "text-foreground hover:scale-[1.0125] hover:-translate-y-1 transition-all duration-300 ease-in-out",
	slots: {
		name: "text-lg",
		checkIcon: "text-green-700 cursor-pointer",
		binIcon: "text-red-500 cursor-pointer",
	},
});

export default function TodoModal(initialData: Todo) {
	const styles = _styles();

	const data = trpc.todos.get.useQuery(initialData.id, {
		initialData: initialData as any,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	if (!data.data) return null;

	const { id, content, done, name, scheduledDay } = data.data;

	const utils = trpc.useContext();
	const updateTodo = trpc.todos.update.useMutation({
		onSettled() {
			utils.todos.getAll.invalidate();
			utils.todos.get.invalidate(id);
			utils.todos.getAllByDay.invalidate(scheduledDay ?? "");
		},
	});
	return (
		<RouteModal>
			<ModalHeader className="flex gap-1">
				<Checkbox
					isSelected={done === 1}
					onValueChange={(value) => updateTodo.mutate({ id, done: value ? 1 : 0 })}
					lineThrough>
					<p className={styles.name()}>{name ?? "Undefined"}</p>
				</Checkbox>
			</ModalHeader>
			<ModalBody>
				<p>{content}</p>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit
					venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam.
				</p>
			</ModalBody>
		</RouteModal>
	);
}
