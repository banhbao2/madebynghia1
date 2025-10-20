interface TrustSignalProps {
  variant: 'data-protection' | 'secure-payment' | 'privacy' | 'no-spam' | 'local-restaurant'
  className?: string
  size?: 'sm' | 'md'
}

const trustMessages = {
  'data-protection': {
    icon: '🔒',
    text: 'Ihre Daten werden verschlüsselt und nie weitergegeben',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  'secure-payment': {
    icon: '✓',
    text: 'SSL-verschlüsselte Datenübertragung',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  'privacy': {
    icon: '🛡️',
    text: 'DSGVO-konform • Keine Daten an Dritte',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  'no-spam': {
    icon: '📧',
    text: 'Kein Spam • Nur wichtige Bestellupdates',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  },
  'local-restaurant': {
    icon: '🏪',
    text: 'Familiengeführtes Restaurant • Seit 2020 in Berlin',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
}

export default function TrustSignal({ variant, className = '', size = 'md' }: TrustSignalProps) {
  const config = trustMessages[variant]

  const sizeClasses = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-3 px-4'
  }

  return (
    <div className={`
      flex items-center gap-2 rounded-lg border
      ${config.bgColor} ${config.borderColor} ${sizeClasses[size]}
      ${className}
    `}>
      <span className="text-lg flex-shrink-0" role="img" aria-hidden="true">
        {config.icon}
      </span>
      <span className={`font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  )
}
