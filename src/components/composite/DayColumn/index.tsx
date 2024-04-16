import { serverClient } from "@/trpc/serverClient";
import Column from "./Column";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

interface DayColumn {
	day: string;
}
export default async function DayColumn({ day }: DayColumn) {
	const todos = await serverClient.todos.getAllByDay(day);

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<h2>{day}</h2>
			</CardHeader>
			<CardBody>
				<Column day={day} initialTodos={todos} />
			</CardBody>
		</Card>
	);
}
