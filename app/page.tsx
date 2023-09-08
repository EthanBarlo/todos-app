import TodoList from "@/components/TodoList";
import DayColumn from "@/components/composite/DayColumn";
import { serverClient } from "@/trpc/serverClient";

export default async function Home() {
	const todos = await serverClient.todos.getAll();
	return (
		<main className="max-w-3xl mx-auto mt-5">
			<TodoList initialTodos={todos} />

			<div className="grid grid-cols-3 gap-4">
				<DayColumn day="Unscheduled" />
				<DayColumn day="Monday" />
				<DayColumn day="Tuesday" />
			</div>
		</main>
	);
}
