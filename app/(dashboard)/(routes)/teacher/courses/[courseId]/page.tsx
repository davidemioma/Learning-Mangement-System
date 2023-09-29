export default function CoursePage({
  params,
}: {
  params: {
    courseId: string;
  };
}) {
  const { courseId } = params;

  return <div className="p-6">{courseId}</div>;
}
