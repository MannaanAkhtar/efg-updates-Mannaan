import { redirect } from "next/navigation";
import { getConnectSession } from "@/lib/connect/server";

export default async function ConnectIndex() {
  const { user } = await getConnectSession();
  if (user) {
    redirect("/connect/dashboard");
  }
  redirect("/connect/login");
}
