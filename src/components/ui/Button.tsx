import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "ghost" | "whatsapp";

interface Base {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
}

type AsLink = Base & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;
type AsButton = Base & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

function Arrow({ icon }: { icon?: ReactNode }) {
  const i = icon ?? <ArrowUpRight strokeWidth={1.6} aria-hidden />;
  return (
    <span className="btn__arrow" aria-hidden>
      {i}
      {i}
    </span>
  );
}

/** Botão/link com preenchimento no hover e seta dupla animada. */
export function Button(props: AsLink | AsButton) {
  const { children, variant = "ghost", icon, className, ...rest } = props;
  const cls = ["btn", `btn--${variant}`, className].filter(Boolean).join(" ");
  if (props.href !== undefined) {
    const { href, ...a } = rest as AsLink;
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={cls}
        data-cursor="cta"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...a}
      >
        <span>{children}</span>
        <Arrow icon={icon} />
      </a>
    );
  }
  const b = rest as AsButton;
  return (
    <button type="button" className={cls} data-cursor="cta" {...b}>
      <span>{children}</span>
      <Arrow icon={icon} />
    </button>
  );
}
