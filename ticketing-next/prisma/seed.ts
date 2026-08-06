import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000);

async function main() {
  await prisma.activity.deleteMany();
  await prisma.ticket.deleteMany();

  const seed = [
    {
      ref: "TKT-1042", title: "Login page throws 500 after SSO redirect",
      description: "Users with @acme.test accounts hit a 500 right after the SSO callback. Started this morning.",
      requester: "Priya Menon", category: "Bug", priority: "Urgent", status: "In progress",
      owner: "Arjun R.", region: "North America", language: "English", createdAt: hoursAgo(6),
      activity: [{ text: "Status → In progress", at: hoursAgo(1) }, { text: "Picked up by Arjun R.", at: hoursAgo(3) }, { text: "Ticket raised", at: hoursAgo(6) }],
    },
    {
      ref: "TKT-1041", title: "Export to CSV missing the last row",
      description: "The CSV export drops the final record in tables longer than one page.",
      requester: "Sam Okonkwo", category: "Bug", priority: "High", status: "Picked up",
      owner: "Meera K.", region: "Asia-Pacific", language: "English", createdAt: hoursAgo(52),
      activity: [{ text: "Picked up by Meera K.", at: hoursAgo(20) }, { text: "Ticket raised", at: hoursAgo(52) }],
    },
    {
      ref: "TKT-1040", title: "Can't reset my API key",
      description: "The 'Regenerate key' button spins forever and nothing happens.",
      requester: "Devansh Gupta", category: "Account / Access", priority: "Normal", status: "Raised",
      owner: null, region: "South Asia", language: "Hindi", createdAt: hoursAgo(29),
      activity: [{ text: "Ticket raised", at: hoursAgo(29) }],
    },
    {
      ref: "TKT-1039", title: "Add dark mode to the dashboard",
      description: "Would love a dark theme for late-night on-call work.",
      requester: "Lena Fischer", category: "Feature request", priority: "Low", status: "Raised",
      owner: null, region: "Europe", language: "German", createdAt: hoursAgo(24 * 21),
      activity: [{ text: "Ticket raised", at: hoursAgo(24 * 21) }],
    },
    {
      ref: "TKT-1038", title: "Invoice shows wrong tax rate",
      description: "August invoice applied 18% instead of our contracted 12%.",
      requester: "Priya Menon", category: "Billing", priority: "High", status: "Resolved",
      owner: "Arjun R.", region: "Latin America", language: "Portuguese", createdAt: hoursAgo(96),
      activity: [{ text: "Status → Resolved", at: hoursAgo(30) }, { text: "Status → In progress", at: hoursAgo(70) }, { text: "Picked up by Arjun R.", at: hoursAgo(80) }, { text: "Ticket raised", at: hoursAgo(96) }],
    },
    {
      ref: "TKT-1037", title: "Onboarding email links point to staging",
      description: "New signups get emails whose links go to staging.acme.test instead of production.",
      requester: "Yuki Tanaka", category: "Bug", priority: "Urgent", status: "Raised",
      owner: null, region: "Asia-Pacific", language: "Japanese", createdAt: hoursAgo(11),
      activity: [{ text: "Ticket raised", at: hoursAgo(11) }],
    },
  ];

  for (const t of seed) {
    const { activity, ...data } = t;
    await prisma.ticket.create({
      data: { ...data, updatedAt: data.createdAt, activity: { create: activity } },
    });
  }
  console.log(`Seeded ${seed.length} tickets.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
