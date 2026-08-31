export default function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-ink/70 flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} Your Mark. All rights reserved.</p>
        <p>Gold and silver prices update automatically with the daily market rate.</p>
      </div>
    </footer>
  );
}
