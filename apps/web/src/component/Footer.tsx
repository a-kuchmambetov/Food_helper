"use client";

import Image from "next/image";

function Footer() {
  return (
    <footer className="mt-auto flex w-full items-center justify-center">
      <div className="container flex flex-row items-center justify-between border-t-0 border-zinc-900 py-12">
        <div className="flex flex-row items-center space-x-4">
          <a
            href="https://www.linkedin.com/in/artem-kuchmambetov-b60ab220a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/linkedIn.svg"
              alt="LinkedIn icon"
              width={24}
              height={24}
            />
          </a>
          <a
            href="https://github.com/a-kuchmambetov/Food_helper/tree/main"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/github.svg"
              alt="GitHub icon"
              width={24}
              height={24}
            />
          </a>
        </div>
        <div className="text-sm text-white text-zinc-400">
          © 2025 Food Helper. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
