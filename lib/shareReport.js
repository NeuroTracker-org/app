// lib/shareReport.js

export async function createShareLink(report, ttl = 3600) {
  const res = await fetch("/api/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: report, ttl }),
  });

  if (!res.ok) throw new Error("Failed to create share link");

  const { id } = await res.json();
  return `${window.location.origin}/reports/${id}`;
}

export async function fetchSharedReport(id) {
  const res = await fetch(`/api/share?id=${id}`);
  if (!res.ok) throw new Error("Report not found or expired");

  const { data } = await res.json();
  return data;
}
