import { motion } from "framer-motion";
import { Sun } from "lucide-react";
import Link from "next/link";
const Navbar = () => (<motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="fixed top-0 left-0 right-0 z-50 glass">
    <div className="container mx-auto flex items-center justify-between h-16 px-6">
      <Link href="/" className="flex items-center gap-2">
        <Sun className="w-7 h-7 text-primary"/>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Caeli<span className="text-primary">Fi</span>
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#problem" className="hover:text-foreground transition-colors">Solution</a>
        <a href="#scenarios" className="hover:text-foreground transition-colors">How It Works</a>
        <a href="#calculator" className="hover:text-foreground transition-colors">Savings</a>
        <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          Dashboard
        </Link>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          Admin
        </Link>
        <a href="#contact" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all active:scale-[0.97]">
          Request Demo
        </a>
      </div>
    </div>
  </motion.nav>);
export default Navbar;
