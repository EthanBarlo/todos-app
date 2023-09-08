"use client";
// Import Types
import { serverClient } from "@/trpc/serverClient";

// Import External
import { useState } from "react";

// Import Internal
import { trpc } from "@/trpc/client";
import TodoCard from "@/components/composite/TodoCard";
import { Todo } from "@/db/schema";

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
				<TodoCard {...(todo as Todo)} />
			))}

			<div className="flex gap-3 items-center">
				<label htmlFor="name">Name</label>
				<input
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="flex-grow text-black bg-white rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
				/>
				<label htmlFor="content">Content</label>
				<input
					id="content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className="flex-grow text-black bg-white rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2"
				/>
				<button
					onClick={async () => {
						if (content.length) {
							addTodo.mutate({
								name,
								content,
							});
							setContent("");
							setName("");
						}
					}}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
					Add Todo
				</button>
			</div>
		</div>
	);
}
