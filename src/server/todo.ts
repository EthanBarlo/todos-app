import { insertTodoSchema, todos } from "@/db/schema";
import { db } from "./db";
import { router, publicProcedure } from "./trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const todos_router = router({
	getAll: publicProcedure.query(async () => {
		return await db.select().from(todos).all();
	}),
	getAllByDay: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
		return await db.select().from(todos).where(eq(todos.scheduledDay, input)).all();
	}),
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
				content: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			await db.insert(todos).values({ name: input.name, content: input.content, done: 0 }).run();
			return true;
		}),
	delete: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
		await db.delete(todos).where(eq(todos.id, input)).run();
		return true;
	}),
	update: publicProcedure
		.input(
			insertTodoSchema.extend({
				id: z.number(), // We extend so that the id is required
			})
		)
		.mutation(async ({ input, ctx }) => {
			const result = await db.update(todos).set(input).where(eq(todos.id, input.id)).run();
			return true;
		}),
});
