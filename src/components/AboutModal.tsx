
import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';

interface AboutModalProps {
  onClose: () => void;
}

function AboutModal({ onClose }: AboutModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Open the modal and restore focus when it closes
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement;

    dialog.showModal();
    closeButtonRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, []);

  // Close when clicking outside the content
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="about-modal"
      aria-labelledby="about-title"
      aria-describedby="about-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={handleBackdropClick}
    >
      <div className="about-modal-content">
        <div className="about-modal-header">
          <div className="about-modal-heading">
            <span className="about-modal-logo" aria-hidden="true">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3c-3 2.5-4.5 5.5-4.5 9s1.5 6.5 4.5 9" />
                <path d="M12 3c3 2.5 4.5 5.5 4.5 9s-1.5 6.5-4.5 9" />
              </svg>
            </span>

            <h2 id="about-title">About IPTracker</h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="about-modal-close"
            onClick={onClose}
            aria-label="Close About dialog"
          >
            ×
          </button>
        </div>

        <p id="about-description" className="about-modal-description">
          A simple way to explore IP addresses and domains.
        </p>

        <section className="about-modal-section">
          <h3>What you can do</h3>

          <ul className="about-modal-features">
            <li>Look up IP addresses and domains</li>
            <li>Explore approximate locations on a map</li>
            <li>View ISP, timezone and network information</li>
            <li>Revisit your recent searches</li>
          </ul>
        </section>

        <div className="about-modal-note">
          <strong>Good to know</strong>
          <p>
            IP geolocation is approximate and does not reveal
            someone's precise GPS location.
          </p>
        </div>

        <div className="about-modal-footer">
          <a
            href="https://github.com/quhtrang-cloud/ip-address-tracker"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub ↗
          </a>

          <button
            type="button"
            className="about-modal-done"
            onClick={onClose}
          >
            Got it
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default AboutModal;
