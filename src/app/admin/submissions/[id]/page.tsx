import SubmissionDetailEditor from './SubmissionDetailEditor';

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SubmissionDetailEditor id={id} />;
}
