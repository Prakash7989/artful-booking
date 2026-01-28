import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      {/* Main Footer Content */}
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-saffron">
                <span className="font-display text-xl font-bold text-primary-foreground">K</span>
              </div>
              <span className="font-display text-xl font-semibold tracking-tight">
                Kala<span className="text-primary">Booking</span>
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/80">
              Connecting you with authentic Indian folk and classical artists from every corner of India.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-secondary-foreground/60 transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-foreground/60 transition-colors hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-display text-lg font-semibold">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/states" className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary">
                  Browse by State
                </Link>
              </li>
              <li>
                <Link to="/artists" className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary">
                  All Artists
                </Link>
              </li>
              <li>
                <Link to="/art-forms" className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary">
                  Art Forms
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary">
                  Featured Artists
                </Link>
              </li>
            </ul>
          </div>

          {/* For Artists */}
          <div>
            <h4 className="mb-4 font-display text-lg font-semibold">For Artists</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/join" className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary">
                  Join as Artist
                </Link>
              </li>
              <li>
                <Link to="/artisan/login" className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary">
                  Artist Login
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-display text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm text-secondary-foreground/80">
                  Mumbai, Maharashtra, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-secondary-foreground/80">
                  +91 98765 43210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-secondary-foreground/80">
                  hello@kalabooking.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-center text-sm text-secondary-foreground/60">
            © 2024 KalaBooking. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-secondary-foreground/60 transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-secondary-foreground/60 transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
