"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

type AssignableRole = "customer" | "staff";

const PASSWORD_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

function generateTempPassword(length = 12) {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += PASSWORD_CHARSET[bytes[i] % PASSWORD_CHARSET.length];
  }
  return out;
}

export async function createUser(input: {
  fullName: string;
  phone: string;
  email: string;
  role: AssignableRole;
}) {
  const user = await getCurrentUser();
  if (!user || user.profile.role !== "owner") {
    return { error: "Not authorized.", password: null };
  }

  const password = generateTempPassword();
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: input.fullName },
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Could not create user.", password: null };
  }

  const supabase = await createClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: input.role, phone: input.phone })
    .eq("id", data.user.id);

  if (profileError) {
    return { error: profileError.message, password: null };
  }

  revalidatePath("/admin/users");
  return { error: null, password };
}

export async function updateUserRole(userId: string, role: AssignableRole) {
  const user = await getCurrentUser();
  if (!user || user.profile.role !== "owner") {
    return { error: "Not authorized." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { error: null };
}
