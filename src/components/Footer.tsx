export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} 10X Shop. All rights reserved.</p>
        <p>Built with React, TypeScript &amp; Tailwind CSS v4</p>
      </div>
    </footer>
  );
}
