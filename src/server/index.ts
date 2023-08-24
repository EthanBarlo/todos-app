import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { z } from "zod";

import { publicProcedure, router } from "./trpc";

import { todos } from "@/db/schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
	getTodos: publicProcedure.query(async () => {
		return await db.select().from(todos).all();
	}),
	addTodo: publicProcedure
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
	deleteTodo: publicProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
		await db.delete(todos).where(eq(todos.id, input)).run();
		return true;
	}),
	setDone: publicProcedure
		.input(
			z.object({
				id: z.number(),
				done: z.number(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			await db.update(todos).set({ done: input.done }).where(eq(todos.id, input.id)).run();
			return true;
		}),
});

export type AppRouter = typeof appRouter;
