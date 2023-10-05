export default function Course({ params }: { params: { courseId: string } }) {
  const { courseId } = params;

  return <div>Course {courseId}</div>;
}
