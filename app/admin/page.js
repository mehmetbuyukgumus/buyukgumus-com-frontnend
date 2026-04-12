import { redirect } from 'next/navigation'

const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || 'panel-k9x3m7vw2q'

export default function AdminPage() {
  redirect(`/${adminPath}/dashboard`)
}
