import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative flex items-center transition-opacity hover:opacity-90"
      aria-label="UrbanBuild home"
    >
      <Image
        src="/assets/logo.svg"
        width={230}
        height={48}
        alt="UrbanBuild"
        loading="eager"
        className="h-8 w-auto md:h-12"
      />
    </Link>
  );
};
