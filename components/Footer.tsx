'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'

export default function Footer() {
  const locale = useLocale()
  const tNav = useTranslations('nav')
  const tFooter = useTranslations('footer')
  
  return (
    <footer className="bg-jk-imperial-green text-jk-cream py-16 relative z-30 shadow-[0_-10px_50px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo-justine-kems.png"
                alt="Justine Kem's"
                width={160}
                height={80}
                className="object-contain"
              />
            </div>
            <p className="italic text-jk-royal-gold mb-4 font-display">{tFooter('tagline')}</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {tFooter('descShort')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-wider text-jk-royal-gold">{tFooter('navigation')}</h4>
            <ul className="space-y-3">
              {[
                { href: `/${locale}/a-propos`, label: tNav('about') },
                { href: `/${locale}/services`, label: tNav('services') },
                { href: `/${locale}/catalogue`, label: tNav('catalogue') },
                { href: `/${locale}/formations`, label: tNav('formations') },
                { href: `/${locale}/modeles`, label: tNav('models') },
                { href: `/${locale}/blog`, label: tNav('blog') },
                { href: `/${locale}/contact`, label: tNav('contact') },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-jk-royal-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-wider text-jk-royal-gold">{tFooter('contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <svg className="w-5 h-5 mt-0.5 shrink-0 text-jk-royal-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <div>
                  <a href="tel:+237677463484" className="hover:text-jk-royal-gold transition-colors block">+237 677 463 484</a>
                  <span className="text-xs text-gray-400">{tFooter('whatsappAvailable')}</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <svg className="w-5 h-5 mt-0.5 shrink-0 text-jk-royal-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div>
                  <p className="hover:text-jk-royal-gold transition-colors">{tFooter('addressMain')}</p>
                  <p className="text-xs text-gray-400">{tFooter('addressSub')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <svg className="w-5 h-5 mt-0.5 shrink-0 text-jk-royal-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <p className="text-sm">{tFooter('hoursWeek')}</p>
                  <p className="text-xs text-jk-royal-gold mt-1 font-semibold">{tFooter('appointmentOnly')}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-wider text-jk-royal-gold">{tFooter('followUs')}</h4>
            <div className="flex gap-4 mb-8">
              <a href="https://facebook.com/justinekems" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-jk-royal-gold hover:bg-jk-royal-gold hover:text-black transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com/justinekems" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-jk-royal-gold hover:bg-jk-royal-gold hover:text-black transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://wa.me/237677463484" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-jk-royal-gold hover:bg-[#25D366] hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
            </div>
            {/* Repères */}
            <div className="bg-white/5 rounded-xl p-4 border border-jk-royal-gold/20">
              <h5 className="text-[10px] font-bold text-jk-royal-gold uppercase tracking-widest mb-2">{tFooter('proximityTitle')}</h5>
              <p className="text-[10px] text-gray-400">{tFooter('proximityDesc')}</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-jk-royal-gold/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>{tFooter('copyright', { year: new Date().getFullYear() })}</p>
          <p className="text-gray-500 italic">{tFooter('poweredBy')} <span className="text-jk-royal-gold font-semibold uppercase tracking-widest px-1">NHR_Ethical_Hackers</span></p>
          <div className="flex gap-4">
            <Link href={`/${locale}/mentions-legales`} className="hover:text-jk-royal-gold transition-colors">{tFooter('legal')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
