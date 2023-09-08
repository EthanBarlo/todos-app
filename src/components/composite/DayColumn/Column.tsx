"use client";

import { Todo } from "@/db/schema";
import { trpc } from "@/trpc/client";
import TodoCard from "../TodoCard";
import { DragEvent, useCallback } from "react";
import { AnimatePresence, m } from "framer-motion";

interface Column {
	day: string;
	initialTodos: Todo[];
}
export default function Column({ day, initialTodos }: Column) {
	const utils = trpc.useContext();
	const getTodos = trpc.todos.getAllByDay.useQuery(day, {
		initialData: initialTodos,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});
	const updateTodo = trpc.todos.update.useMutation({
		onSettled() {
			utils.todos.getAllByDay.invalidate();
			getTodos.refetch();
		},
	});

	const onDrop = useCallback(
		async (e: DragEvent<HTMLElement>) => {
			e.preventDefault();
			const id = e.dataTransfer.getData("id");
			const previousDay = e.dataTransfer.getData("previousDay");
			if (previousDay === day) return;
			updateTodo.mutate({ id: parseInt(id), scheduledDay: day });
		},
		[day]
	);

	return (
		<section
			className="grow space-y-2 bg-black/10 p-1 rounded-md"
			onDragOver={(e) => e.preventDefault()} // This required to enable the onDrop event
			onDrop={onDrop}>
			<AnimatePresence mode="popLayout" initial={false}>
				{getTodos.data.map((todo) => (
					<m.div
						key={todo.id}
						initial={{ height: 0 }}
						animate={{ height: "auto" }}
						exit={{ opacity: [0, 0], height: 0 }}>
						<TodoCard {...todo} />
					</m.div>
				))}
			</AnimatePresence>
		</section>
	);
}
