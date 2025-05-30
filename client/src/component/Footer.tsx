function Footer() {
  return (
    <footer className="flex items-center w-full justify-center mt-auto">
      <div className="container border-t-0 border-zinc-900 py-12 flex flex-row justify-between items-center">
        <div className="flex flex-row items-center space-x-4">
          <a
            href="https://www.linkedin.com/in/artem-kuchmambetov-b60ab220a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/linkedIn.svg" alt="GitHub icon" />
          </a>
          <a
            href="https://github.com/a-kuchmambetov/Food_helper/tree/main"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/github.svg" alt="GitHub icon" />
          </a>
        </div>
        <div className="text-white text-sm text-zinc-400">
          © 2025 Food Helper. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
