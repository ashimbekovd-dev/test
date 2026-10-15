import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFab() {
  return (
    <a
      href={waLink("Здравствуйте! У меня вопрос по косметике PIYOL'.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Написать в WhatsApp"
      className="wa-fab fixed bottom-4 right-4 z-40 grid size-14 place-items-center rounded-full bg-moss text-white shadow-[0_8px_24px_-8px_rgba(68,87,63,0.6)] md:hidden"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
