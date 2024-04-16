interface TodoPageProps {
	params: { id: string };
}
export default function TodoPage({ params: { id } }: TodoPageProps) {
	return <div>TodoPage - {id}</div>;
}
