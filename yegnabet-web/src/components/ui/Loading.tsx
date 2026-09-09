import { AppShell } from "../layout/AppShell"

const Loading = () => {
  return (
    <AppShell>
        <div className="flex items-center justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
        </div>
    </AppShell>
  )
}

export default Loading