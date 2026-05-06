import { mockUsers } from "@/lib/mockData";
import { clearAuthCookie, getStoredSession, setAuthCookie } from "@/lib/utils";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function login(email, password) {
  await delay(650);
  const user = mockUsers.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const session = { token: "mock-jwt-token", user: safeUser };

  if (typeof window !== "undefined") {
    localStorage.setItem("cbs_auth", JSON.stringify(session));
    setAuthCookie(session);
  }

  return session;
}

export async function logout() {
  await delay(200);
  if (typeof window !== "undefined") {
    localStorage.removeItem("cbs_auth");
    clearAuthCookie();
  }
  return true;
}

export async function getMe() {
  await delay(250);
  const session = getStoredSession();
  if (!session?.user) {
    throw new Error("No active session");
  }
  return session.user;
}
