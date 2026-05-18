import React from 'react';
import { 
  FaceSmileIcon, 
  GlobeAltIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
// If you have your logo in assets:
import logo from '../../assets/Logo.png';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerData: FooterSection[] = [
  {
    title: "Support",
    links: [
      { label: "Hjälpcenter", href: "#" },
      { label: "RentCover", href: "#" },
      { label: "Anti-diskriminering", href: "#" },
      { label: "Stöd vid funktionsnedsättning", href: "#" },
    ],
  },
  {
    title: "Värdskap",
    links: [
      { label: "Hyr ut din bostad", href: "#" },
      { label: "RentRight för värdar", href: "#" },
      { label: "Ansvarsfullt värdskap", href: "#" },
      { label: "Forum för värdar", href: "#" },
    ],
  },
  {
    title: "RentRight",
    links: [
      { label: "Nyhetsrum", href: "#" },
      { label: "Nya funktioner", href: "#" },
      { label: "Karriär", href: "#" },
      { label: "Investerare", href: "#" },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <img src={logo} alt="RentRight Logo" className="h-8 mb-4" />
            <p className="text-gray-500 text-sm leading-relaxed">
              Hitta ditt nästa drömboende med RentRight. Vi gör det enkelt, 
              säkert och personligt att hyra bostad i hela Sverige.
            </p>
          </div>

          {/* Dynamic Sections */}
          {footerData.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span>© 2026 RentRight AB</span>
            <span className="hidden md:inline">·</span>
            {/* <a href="#" className="hover:underline">Sekretess</a> */}
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Villkor</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Webbplatsöversikt</a>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition">
              <GlobeAltIcon className="h-5 w-5" />
              Svenska (SE)
            </button>
            <div className="flex items-center gap-4 text-gray-700">
               {/* Replace with your social icons */}
               <ChatBubbleLeftRightIcon className="h-5 w-5 cursor-pointer hover:text-indigo-600" />
               <FaceSmileIcon className="h-5 w-5 cursor-pointer hover:text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;