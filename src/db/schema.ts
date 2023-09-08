import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const todos = sqliteTable("todos", {
	id: integer("id").primaryKey(),
	name: text("name"),
	content: text("content"),
	done: integer("done"),
	scheduledDay: text("scheduledDay").default("Unscheduled"),
});
const selectTodoSchema = createSelectSchema(todos);
export const insertTodoSchema = createInsertSchema(todos);
export type Todo = z.infer<typeof selectTodoSchema>;
