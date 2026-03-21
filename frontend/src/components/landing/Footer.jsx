import { Sun } from "lucide-react";
const Footer = () => (<footer id="contact" className="py-16 border-t border-border">
    <div className="container mx-auto px-6">
      <div className="grid sm:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-6 h-6 text-primary"/>
            <span className="text-lg font-bold">Caeli<span className="text-primary">Fi</span></span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Intelligent Solar-DG Synchronization. Save fuel, protect generators, maximize solar.
          </p>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-4 text-sm">Product</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#problem" className="hover:text-foreground transition-colors">How it Works</a></li>
            <li><a href="#scenarios" className="hover:text-foreground transition-colors">Scenarios</a></li>
            <li><a href="#calculator" className="hover:text-foreground transition-colors">Savings Calculator</a></li>
            <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-foreground mb-4 text-sm">Contact</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>hello@caelifi.com</li>
            <li>+91 98765 43210</li>
            <li>Bhubaneswar, Odisha, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© 2026 CaeliFi. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
        </div>
      </div>
    </div>
  </footer>);
export default Footer;
