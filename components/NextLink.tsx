import Link, { LinkProps } from "next/link";
import React, { FC } from "react";

type NextLinkProps = LinkProps & {
  href: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Standard way of using the Next's `Link` tag together with the `a` tag
 */
const NextLink: FC<NextLinkProps> = ({
  href,
  className,
  children,
  ...rest
}) => (
  <Link href={href} {...rest} legacyBehavior>
    <a href={href} className={className}>
      {children}
    </a>
  </Link>
);

NextLink.defaultProps = {
  className: "",
};

export default NextLink;
