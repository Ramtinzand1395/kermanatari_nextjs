export async function sendSMS({
  bodyId,
  to,
  args,
}: {
  bodyId: number;
  to: string;
  args: string[];
}) {
  const url =
    "https://console.melipayamak.com/api/send/shared/cba17fa6705a4348b2e2d10279cf3fb9";
  const payload = { bodyId, to, args };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}
