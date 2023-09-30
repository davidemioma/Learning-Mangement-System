//Run on Console - node scripts/seed.ts

const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Photography" },
        { name: "Filming" },
      ],
    });

    console.log("success");
  } catch (err) {
    console.log("Error seeding the database categories", err);
  } finally {
    await database.$disconnect();
  }
}

main();
