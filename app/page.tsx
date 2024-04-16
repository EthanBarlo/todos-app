import AddTodo from "@/components/AddTodo";
import DayColumn from "@/components/composite/DayColumn";

export default async function Home() {
	return (
		<main className="max-w-[120rem] mx-auto pt-24">
			<div className="max-w-4xl mx-auto pb-16">
				<AddTodo />
			</div>

			<div className="grid grid-cols-6 gap-4 h-[50rem]">
				<DayColumn day="Unscheduled" />
				<DayColumn day="Monday" />
				<DayColumn day="Tuesday" />
				<DayColumn day="Wednesday" />
				<DayColumn day="Thursday" />
				<DayColumn day="Friday" />
			</div>
		</main>
	);
}
