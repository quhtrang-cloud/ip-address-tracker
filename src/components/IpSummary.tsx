
import { useState } from 'react';
import type { ReactNode } from 'react';

interface IpSummaryProps {
  ip: string;
  location: string;
  country: string;
  timezone: string;
  utcOffset: string;
  isp: string;
  asn: string;
}

function IpSummary({
  ip,
  location,
  country,
  timezone,
  utcOffset,
  isp,
  asn
}: IpSummaryProps) {
  const [copied, setCopied] = useState(false);

  // Match each result with its label, details and icon
  const items: {
    label: string;
    value: string;
    detail?: string;
    icon: ReactNode;
  }[] = [
    {
      label: 'IP Address',
      value: ip,
      icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>
    },
    {
      label: 'Location',
      value: location,
      detail: country,
      icon: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>
    },
    {
      label: 'Timezone',
      value: utcOffset,
      detail: timezone,
      icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>
    },
    {
      label: 'ISP',
      value: isp,
      detail: asn,
      icon: <><path d="M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 15a5 5 0 0 1 6 0" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" /></>
    }
  ];

  // Copy the IP address
  async function copyIp() {
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="ip-summary" aria-label="IP lookup summary">
      {items.map((item) => (
        <div className="summary-card" key={item.label}>
          <div className="summary-heading">
            <span className="summary-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
            </span>
            <span className="summary-label">{item.label}</span>
          </div>
          <div className="summary-content">
            <p className="summary-value">{item.value}</p>
            {item.label === 'IP Address' && (
              <button
                type="button"
                className="copy-button"
                onClick={copyIp}
                aria-label="Copy IP address"
                title="Copy IP address"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          {item.detail && (
            <p className="summary-detail">{item.detail}</p>
          )}
        </div>
      ))}
    </section>
  );
}

export default IpSummary;
