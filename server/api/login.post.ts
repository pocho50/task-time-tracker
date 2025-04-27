import { loginSchema } from "~/schemas";
import { LoginService } from "../services/login";

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, loginSchema.parse);
  const loginService = new LoginService();
  return await loginService.execute(
    { email, password },
    setUserSession,
    event
  );
});
