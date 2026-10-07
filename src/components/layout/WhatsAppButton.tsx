const WA_PATH =
  'M16 3C8.8 3 3 8.7 3 15.8c0 2.3.6 4.5 1.8 6.4L3 29l7-1.8c1.8 1 3.9 1.5 6 1.5 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6C5.3 10 10.1 5.3 16 5.3S26.7 10 26.7 15.8 21.9 26.4 16 26.4zm5.9-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2s0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.1 1.4 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z'

export const whatsappHref = (number: string, text = 'Namaste! I would like to enquire about a stay.') =>
  `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d={WA_PATH} />
    </svg>
  )
}

/** Floating chat button (tablet/desktop — phones get it inside the bottom book bar). */
export function WhatsAppButton({ number }: { number?: string | null }) {
  if (!number) return null
  return (
    <a
      href={whatsappHref(number)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-6 bottom-6 z-40 hidden items-center gap-3 rounded-full bg-[#1f8f4e] py-3 pr-3 pl-3 text-ivory shadow-lg transition-[padding] duration-500 ease-luxe hover:pl-5 md:flex"
    >
      <span className="eyebrow hidden text-[0.6rem] group-hover:inline">Chat with us</span>
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  )
}
