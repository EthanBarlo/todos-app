import RouteModal from "@/components/RouteModal";
import { ModalBody, ModalHeader } from "@nextui-org/react";
import TodoModal from "./TodoModal";
import { serverClient } from "@/trpc/serverClient";

interface TodoPageProps {
	params: { id: string };
}
export default async function InterceptedTodoPage({ params: { id } }: TodoPageProps) {
	const todo = await serverClient.todos.get(Number(id));

	return <TodoModal {...todo} />;
}
