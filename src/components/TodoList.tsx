"use client";
// Import Types
import { serverClient } from "@/trpc/serverClient";

// Import External
import { useState } from "react";

// Import Internal
import { trpc } from "@/trpc/client";
import TodoCard from "@/components/composite/TodoCard";
import { Todo } from "@/db/schema";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

interface ITodoList {
	initialTodos: Awaited<ReturnType<(typeof serverClient)["todos"]["getAll"]>>;
}
export default function TodoList({ initialTodos }: ITodoList) {
	const getTodos = trpc.todos.getAll.useQuery(undefined, {
		initialData: initialTodos,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});
	const addTodo = trpc.todos.create.useMutation({
		onSettled: () => {
			getTodos.refetch();
		},
	});

	const [content, setContent] = useState("");
	const [name, setName] = useState("");

	return (
		<div>
			{getTodos.data.map((todo) => (
				<TodoCard key={todo.id} {...(todo as Todo)} />
			))}

			<div className="flex gap-3 items-center">
				<Input variant="bordered" label="Name" placeholder="Task Name" value={name} onValueChange={setName} />
				<Input
					variant="bordered"
					label="Content"
					placeholder="Task Content"
					value={content}
					onValueChange={setContent}
				/>
				<Button
					onClick={async () => {
						if (content.length) {
							addTodo.mutate({
								name,
								content,
							});
							setContent("");
							setName("");
						}
					}}>
					Add Todo
				</Button>
			</div>
		</div>
	);
}
