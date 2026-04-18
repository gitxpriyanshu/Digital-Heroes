import React from 'react';
import Link from 'next/link';
import { Trophy, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#0f4c35] rounded-lg flex items-center justify-center">
                <Trophy className="text-[#d4a947] w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tighter text-white">Digital Heroes</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Changing the game of golf, one round at a time. Play for the impact, win for the thrill.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Facebook size={18} />} />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="/prizes" className="hover:text-white transition-colors">Prize Pool</Link></li>
              <li><Link href="/charities" className="hover:text-white transition-colors">Our Partners</Link></li>
              <li><Link href="/subscribe" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Impact Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/rules" className="hover:text-white transition-colors">Competition Rules</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-white/20 text-xs">
            © 2024 Digital Heroes Platform. All rights reserved. Registered UK Charity Partner #123456.
          </p>
          <div className="flex gap-8 opacity-20 grayscale">
            {/* Charity Logos Placeholder */}
            <span className="text-[10px] font-black uppercase tracking-widest">Fairway Trust</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Impact Golf</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Green Hearts</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
      {icon}
    </a>
  );
}
