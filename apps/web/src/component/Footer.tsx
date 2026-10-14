import { HeartHand } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

const footerNavList = [
  { label: "Catalog", href: "/catalog" },
  { label: "Planner", href: "/planner" },
  { label: "Inventory", href: "/inventory" },
  { label: "Help", href: "/help" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-secondary bg-brand-section py-12">
      <div className="mx-auto max-w-container px-4 md:px-8">
        <div className="flex flex-col justify-between lg:flex-row lg:items-center">
          <div className="lg:w-40">
            <HeartHand className="size-5" aria-hidden="true" />
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-[repeat(6,max-content)] lg:mt-0">
            {footerNavList.map((item) => (
              <li key={item.label} className="flex">
                <Button
                  className="max-h-5 text-footer-button-fg hover:text-footer-button-fg_hover"
                  color="link-color"
                  size="md"
                  href={item.href}
                >
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-sm text-quaternary_on-brand lg:mt-0 lg:w-40 lg:text-right">
            © {new Date().getFullYear()} Artem Kuchmambetov.
            <span className="ml-1 md:hidden">All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
