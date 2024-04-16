"use client";

import { Todo } from "@/db/schema";
import { trpc } from "@/trpc/client";
import TodoCard from "../TodoCard";
import { DragEvent, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

	const [showPlaceholder, setPlaceholder] = useState(false);

	const onDrop = useCallback(
		async (e: DragEvent<HTMLElement>) => {
			e.preventDefault();
			setPlaceholder(false);
			const id = e.dataTransfer.getData("id");
			const previousDay = e.dataTransfer.getData("previousDay");
			if (previousDay === day) return;
			updateTodo.mutate({ id: parseInt(id), scheduledDay: day });
		},
		[day]
	);

	// const onDragOver = useCallback((e: DragEvent<HTMLElement>) => {
	// 	e.preventDefault();
	// 	setPlaceholder(true);
	// }, []);

	return (
		<section
			className="grow space-y-2 bg-slate-100 p-2 rounded-2xl"
			onDragOver={(e) => e.preventDefault()} // This required to enable the onDrop event
			onDragEnter={() => setPlaceholder(true)}
			onDragLeave={() => setPlaceholder(false)}
			onDrop={onDrop}>
			{getTodos.data &&
				getTodos.data.map((todo) => (
					<motion.div layout key={todo.id}>
						<TodoCard {...todo} />
					</motion.div>
				))}
			<AnimatePresence>
				{showPlaceholder && (
					<motion.div
						initial={{ height: 0 }}
						animate={{ height: "3rem" }}
						exit={{ height: 0 }}
						className="bg-slate-300 w-full rounded-xl"
					/>
				)}
			</AnimatePresence>
		</section>
	);
}
