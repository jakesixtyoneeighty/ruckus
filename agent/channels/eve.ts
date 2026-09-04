import { eveChannel } from "eve/channels/eve";
import { type AuthFn, localDev, vercelOidc } from "eve/channels/auth";
import { verifySupabaseToken } from "../../lib/supabase/verify-token.js";

function supabaseAuth(): AuthFn<Request> {
  return async (request) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.slice(7);
    const user = await verifySupabaseToken(token);
    if (!user) return null;

    return {
      principalId: user.id,
      principalType: "user",
      attributes: { email: user.email ?? "" },
      authenticator: "supabase",
    };
  };
}

export default eveChannel({
  auth: [
    // Authenticate production users via Supabase Bearer token
    supabaseAuth(),
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
    // Lets the eve TUI and your Vercel deployments reach the deployed agent.
    vercelOidc(),
  ],
});
