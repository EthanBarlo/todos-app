import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
	id: integer("id").primaryKey(),
	name: text("name"),
	content: text("content"),
	done: integer("done"),
});
