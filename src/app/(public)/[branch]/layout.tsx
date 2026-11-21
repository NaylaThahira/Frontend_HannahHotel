import { notFound } from 'next/navigation'
import { isValidBranch } from '@/lib/branches'

export function generateStaticParams() {
  return [{ branch: 'padang' }, { branch: 'painan' }]
}

export default async function BranchLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ branch: string }>
}) {
  const { branch } = await params
  if (!isValidBranch(branch)) {
    notFound()
  }

  return <>{children}</>
}
