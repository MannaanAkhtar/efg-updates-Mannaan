"use server";

import { revalidatePath } from "next/cache";
import { requireConnectAdmin } from "@/lib/connect/server";

export async function approveAttendee(attendeeId: string) {
  const { admin, user } = await requireConnectAdmin();
  const { error } = await admin
    .from("connect_attendees")
    .update({ approved_at: new Date().toISOString(), approved_by: user.id })
    .eq("id", attendeeId);
  if (error) {
    return { ok: false as const, error: error.message };
  }
  revalidatePath("/admin/connect/attendees");
  revalidatePath("/admin/connect");
  return { ok: true as const };
}

export async function unapproveAttendee(attendeeId: string) {
  const { admin } = await requireConnectAdmin();
  const { error } = await admin
    .from("connect_attendees")
    .update({ approved_at: null, approved_by: null })
    .eq("id", attendeeId);
  if (error) {
    return { ok: false as const, error: error.message };
  }
  revalidatePath("/admin/connect/attendees");
  revalidatePath("/admin/connect");
  return { ok: true as const };
}

export async function bulkApprove(attendeeIds: string[]) {
  if (attendeeIds.length === 0) return { ok: true as const, count: 0 };
  const { admin, user } = await requireConnectAdmin();
  const { error, count } = await admin
    .from("connect_attendees")
    .update({ approved_at: new Date().toISOString(), approved_by: user.id }, { count: "exact" })
    .in("id", attendeeIds)
    .is("approved_at", null);
  if (error) {
    return { ok: false as const, error: error.message };
  }
  revalidatePath("/admin/connect/attendees");
  revalidatePath("/admin/connect");
  return { ok: true as const, count: count ?? 0 };
}
