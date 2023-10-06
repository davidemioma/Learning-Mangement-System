export default async function Chapter({
  params,
}: {
  params: { chapterId: string };
}) {
  const { chapterId } = params;

  return <div>Chapter {chapterId}</div>;
}
