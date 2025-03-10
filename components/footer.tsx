export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 ">
      <div className=" text-center text-sm text-muted-foreground">
        <p>© {currentYear} Shishir Bhurtel. All rights reserved.</p>
      </div>
    </footer>
  );
}
