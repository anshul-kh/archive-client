import Sidebar from '@/components/base-ui/sidebar'
import React from 'react'

function RootPageLayout({ children , className}: { children: React.ReactNode, className ?: string }) {
    return (
        <div className={`h-[100dvh] ${className}`}>
            <Sidebar/>
            {children}
        </div>
    )
}

export default RootPageLayout
