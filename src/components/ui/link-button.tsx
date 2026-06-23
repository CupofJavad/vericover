import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type LinkButtonProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    external?: boolean;
  };

export function LinkButton({
  className,
  variant,
  size,
  external,
  href,
  children,
  ...props
}: LinkButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (external || (typeof href === "string" && (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")))) {
    const isHttp = typeof href === "string" && href.startsWith("http");
    return (
      <a
        href={href as string}
        className={classes}
        {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(props as React.ComponentProps<"a">)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}