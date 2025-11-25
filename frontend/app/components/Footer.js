// Footer bileşeni - Web sitesinin alt kısmındaki bilgi alanını içerir
// Bu bileşen tüm sayfalarda ortak olarak kullanılacak

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Zena Enerji - Sol kolon */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-1 h-8 bg-green-500 mr-3"></div>
              <h3 className="text-2xl font-bold text-white">Zena Enerji</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Zena Enerji, 2015 yılında deneyimli paydaşlar tarafından kurulmuş, yenilenebilir enerji sektöründe faaliyet gösteren bir Türk firmasıdır. Firmamız, Yapay Zeka (AI), Gelişmiş Analitik ve Büyük Veri kullanarak güneş PV tesislerinin dijitalleşmesini iyileştirerek, proje geliştirme, imar uygulamaları, saha kurulumları ve güneş enerjisi endüstrisinin genel gelişimi için çalışmaktadır.
            </p>
          </div>

          {/* İLETİŞİM - İkinci kolon */}
          <div className="col-span-1">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-12 h-0.5 bg-green-500 mr-2"></div>
                <div className="flex-1 h-0.5 bg-gray-600"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mt-2">İLETİŞİM</h3>
            </div>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                Fenerbahçe Mahallesi<br />
                Bağdat Caddesi No:200/6<br />
                Kadıköy/İstanbul Türkiye
              </p>
              <p>Telefon: <a href="tel:+902166064458" className="hover:text-green-500 transition-colors">+90 (216) 606 44 58</a></p>
              <p>Email: <a href="mailto:info@zenaenerji.com" className="hover:text-green-500 transition-colors">info@zenaenerji.com</a></p>
              
              {/* Sosyal medya ikonları */}
              <div className="flex items-center gap-3 mt-4">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.5 6.18a2.86 2.86 0 00-2-2C19.42 4 12 4 12 4s-7.42 0-9.5.18a2.86 2.86 0 00-2 2A29.94 29.94 0 000 12a29.94 29.94 0 00.5 5.82 2.86 2.86 0 002 2C2.58 20 12 20 12 20s7.42 0 9.5-.18a2.86 2.86 0 002-2A29.94 29.94 0 0024 12a29.94 29.94 0 00-.5-5.82zM9.75 15.02V8.98L15.5 12z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452H17.2v-5.569c0-1.328-.026-3.036-1.852-3.036-1.853 0-2.136 1.447-2.136 2.94v5.665H9.964V9.001h3.1v1.561h.044c.432-.818 1.49-1.68 3.064-1.68 3.276 0 3.883 2.157 3.883 4.963v6.607zM5.337 7.433a2.063 2.063 0 110-4.126 2.063 2.063 0 010 4.126zM6.916 20.452H3.758V9h3.158v11.452z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ÇALIŞMA SAATLERİMİZ - Dördüncü kolon */}
          <div className="col-span-1">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-12 h-0.5 bg-green-500 mr-2"></div>
                <div className="flex-1 h-0.5 bg-gray-600"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mt-2">ÇALIŞMA SAATLERİMİZ</h3>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Pazartesi 08:00-18:00</li>
              <li>Salı 08:00-18:00</li>
              <li>Çarşamba 08:00-18:00</li>
              <li>Perşembe 08:00-18:00</li>
              <li>Cuma 08:00-18:00</li>
              <li>Cumartesi Kapalı</li>
              <li>Pazar Kapalı</li>
            </ul>
          </div>
        </div>
        
        {/* Alt çizgi - Telif hakkı bilgisi */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © Copyright Zena Enerji. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>

      {/* Scroll to top butonu */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50"
          aria-label="Yukarı çık"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </footer>
  );
}
