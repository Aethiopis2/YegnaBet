import React from 'react'

const AppShell = ({children}:any) => {
  return (
    <div className='min-h-screen bg-gray-50'>
        <header className="sticky top-0 bg-white border-b z-10">
            <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
                <div className="font-bold text-lg text-emerald-700">Yegna Bet</div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    🏠
                </div>
            </div>
        </header>

        <main className="max-w-md mx-auto p-4">
            {children}
        </main>
    </div>
  )
}

export default AppShell