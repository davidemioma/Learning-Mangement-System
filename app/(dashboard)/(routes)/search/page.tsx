import prismadb from "@/lib/prismadb";
import Categories from "./_components/Categories";
import SearchInput from "@/components/SearchInput";

export default async function Search() {
  const categories = await prismadb.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <div className="block px-6 pt-6 md:hidden md:mb-0">
        <SearchInput />
      </div>

      <div className="p-6">
        <Categories items={categories} />
      </div>
    </>
  );
}
