"use server";

import { signOut, signIn } from "./auth";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { db } from "./db";
import { Role } from "@/lib/constants";

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function signInWithGoogle(callbackUrl?: string) {
  await signIn("google", { redirectTo: callbackUrl || "/dashboard" });
}

export async function signInWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export async function createProject(data: {
  name: string;
  description?: string;
  colorId: string;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.create({
    data: {
      name: data.name,
      description: data.description || null,
      colorId: data.colorId,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: Role.OWNER,
        },
      },
    },
  });

  return project;
}
