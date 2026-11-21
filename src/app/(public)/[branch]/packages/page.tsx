import { notFound, permanentRedirect } from 'next/navigation'
import { isValidBranch } from '@/lib/branches'

export default async function BranchPackagesPage({
  params,
}: {
  params: Promise<{ branch: string }>
}) {
  const { branch } = await params
  if (!isValidBranch(branch)) {
    notFound()
  }

  permanentRedirect(`/${branch}/facilities?tab=packages`)
}
