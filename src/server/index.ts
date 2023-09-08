import { todos_router } from "./todo";
import { router } from "./trpc";

export const appRouter = router({
	todos: todos_router,
});

export type AppRouter = typeof appRouter;
