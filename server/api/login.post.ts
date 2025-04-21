import { loginSchema } from "~/schemas";
import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, loginSchema.parse);

  // Implement login logic
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !(await verifyPassword(user.password, password))) {
    throw createError({
      statusCode: 401,
      message: "Bad credentials",
    });
  }

  // Set the user session in the cookie
  await setUserSession(event, {
    user: {
      name: user.name,
      email: user.email,
      id: user.id,
    },
  });
  return {};
});
