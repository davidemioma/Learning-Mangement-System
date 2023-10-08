import prismadb from "@/lib/prismadb";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += purchase.course.price || 0;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    if (!userId) {
      return {
        data: [],
        totalRevenue: 0,
        totalSales: 0,
      };
    }

    const purchases = await prismadb.purchase.findMany({
      where: {
        course: {
          userId: userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchases);

    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);

    return {
      data,
      totalRevenue,
      totalSales: purchases.length,
    };
  } catch (err) {
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
