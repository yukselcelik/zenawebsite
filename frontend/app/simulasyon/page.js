'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const subscriberTypes = [
  { id: 'home', label: 'Ev', icon: '🏠' },
  { id: 'business', label: 'İşyeri', icon: '🏢' },
  { id: 'industry', label: 'Sanayi', icon: '🏭' },
];

const installationAreas = [
  { id: 'roof', label: 'Çatı', icon: '🏡' },
  { id: 'land', label: 'Arazi', icon: '⛰️' },
];

const cities = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Bingöl', 'Diyarbakır', 'Adana', 'Antalya',
];

export default function SimulationPage() {
  const [subscriberType, setSubscriberType] = useState(null);
  const [installationArea, setInstallationArea] = useState(null);
  const [areaSize, setAreaSize] = useState('');
  const [billValue, setBillValue] = useState(0);
  const [city, setCity] = useState('');

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="relative min-h-screen">
        {/* gradient background */}
        <div className="absolute inset-0">
          <img src="/6.jpg" alt="Solar background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#04001b]/90 via-[#1c0437]/80 to-[#02132d]/90" />
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-pink-500/40 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/30 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
          <div className="bg-white/10 border border-white/20 rounded-[32px] shadow-[0_10px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl px-6 sm:px-10 py-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.25em]">SOLAR GÜÇ HESAPLAMA</h1>
              <p className="text-white/80 text-sm md:text-base mt-2">
                Kurulum senaryonuzu seçin, şehir ve fatura bilgilerinizi girin. Size en uygun güneş enerjisi çözümünü
                birlikte hesaplayalım.
              </p>
            </div>

            <div className="space-y-6">
              {/* Subscriber type */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-white/70 mb-3">
                  Abone Türünü Seçiniz
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {subscriberTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSubscriberType(type.id)}
                      className={`flex flex-col items-center gap-1 rounded-2xl py-4 border text-sm font-semibold transition-all ${
                        subscriberType === type.id
                          ? 'bg-pink-500 text-white border-pink-400 shadow-lg'
                          : 'border-white/30 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Installation area */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-white/70 mb-3">
                  Kurulum Sahasını Seçiniz
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {installationAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setInstallationArea(area.id)}
                      className={`flex items-center justify-center gap-2 rounded-2xl py-4 border text-sm font-semibold transition-all ${
                        installationArea === area.id
                          ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg'
                          : 'border-white/30 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl">{area.icon}</span>
                      <span>{area.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Area input */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-white/70 mb-2">
                  Çatı veya Arazi Alanını Giriniz
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={areaSize}
                    placeholder="m²"
                    onChange={(e) => setAreaSize(e.target.value)}
                    className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-pink-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-sm">m²</span>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-white/70 mb-2">
                  Bulunduğunuz Şehri Seçiniz
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-white/30 bg-white/5 px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">Şehir seçiniz</option>
                  {cities.map((cityName) => (
                    <option key={cityName} value={cityName} className="text-gray-900">
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bill slider */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-white/70 mb-4">
                  Elektrik Fatura Tutarını Giriniz
                </label>
                <input
                  type="range"
                  min={0}
                  max={20000}
                  step={500}
                  value={billValue}
                  onChange={(e) => setBillValue(Number(e.target.value))}
                  className="w-full accent-pink-400"
                />
                <div className="text-right mt-2 text-lg font-bold text-white">
                  {billValue ? `${billValue.toLocaleString('tr-TR')} ₺` : '---'}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-10 py-3 text-white font-semibold tracking-wider shadow-lg hover:opacity-90 transition"
                >
                  Hesaplamak için tıklayın
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
