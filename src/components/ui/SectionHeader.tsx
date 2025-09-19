import React from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon, actions }) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        {icon && <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg">{icon}</div>}
        <div>
          <h2 className="headline text-2xl text-white">{title}</h2>
          {subtitle && <p className="subtle text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export default SectionHeader


