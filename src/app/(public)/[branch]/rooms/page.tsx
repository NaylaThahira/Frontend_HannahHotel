import { notFound } from 'next/navigation'
import RoomsListing from '@/components/RoomsListing'
import { isValidBranch } from '@/lib/branches'

export default async function BranchRoomsPage({
  params,
}: {
  params: Promise<{ branch: string }>
}) {
  const { branch } = await params
  if (!isValidBranch(branch)) {
    notFound()
  }
  return <RoomsListing location={branch} />
}
