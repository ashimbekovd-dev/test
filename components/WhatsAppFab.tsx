import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={waLink("Здравствуйте! Хочу проконсультироваться по уходу.")}
      target="_blank"
      rel="noopener"
      aria-label="Написать в WhatsApp"
      className="fixed bottom-5 right-4 z-30 grid size-14 place-items-center rounded-full bg-sage-deep text-milk shadow-[0_8px_24px_-8px_rgba(44,43,48,.45)] md:hidden"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
