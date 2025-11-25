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
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/6.jpg"
            alt="Solar background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/65" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-white">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-[0.35em] mb-3">SOLAR GÜÇ HESAPLAMA</h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-8 h-1 rounded-full bg-white/30" />
              <span className="w-14 h-1 rounded-full bg-amber-400" />
              <span className="w-8 h-1 rounded-full bg-white/30" />
            </div>
            <p className="text-white/85 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Güneş enerjisi kurulumunuzu planlamak için aşağıdaki adımları izleyerek abone
              türünüzü, bulunduğunuz şehri ve elektrik fatura bilgilerinizi girin.
            </p>
          </div>

          <div className="space-y-6">
            {/* Subscriber type */}
            <div className="bg-gradient-to-br from-orange-800/85 to-amber-700/85 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur">
              <h2 className="text-center text-lg md:text-xl font-semibold mb-4">Abone Türünü Seçiniz</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {subscriberTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSubscriberType(type.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-5 font-semibold transition-all ${
                      subscriberType === type.id
                        ? 'bg-white text-orange-900 border-white shadow-lg'
                        : 'border-white/30 text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-3xl">{type.icon}</span>
                    <span className="tracking-wide">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Installation area and size */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-gradient-to-br from-orange-800/85 to-amber-700/85 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur">
                <h2 className="text-center text-lg md:text-xl font-semibold mb-4">Kurulum Sahasını Seçiniz</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {installationAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setInstallationArea(area.id)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 py-5 font-semibold transition-all ${
                        installationArea === area.id
                          ? 'bg-white text-orange-900 border-white shadow-lg'
                          : 'border-white/30 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-3xl">{area.icon}</span>
                      <span className="tracking-wide">{area.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-800/85 to-amber-700/85 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-center backdrop-blur">
                <h2 className="text-center text-lg md:text-xl font-semibold mb-4">Çatı veya Arazi Alanını Giriniz</h2>
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="number"
                    min={0}
                    value={areaSize}
                    placeholder="m²"
                    onChange={(e) => setAreaSize(e.target.value)}
                    className="w-32 rounded-full px-4 py-2 text-center text-gray-900 font-semibold placeholder:text-gray-400"
                  />
                  <span className="text-lg font-medium">m²</span>
                </div>
              </div>
            </div>

            {/* City and bill */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gradient-to-br from-orange-800/85 to-amber-700/85 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col backdrop-blur">
                <h2 className="text-center text-lg md:text-xl font-semibold mb-4">Bulunduğunuz Şehri Seçiniz</h2>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl bg-white text-gray-900 font-semibold px-4 py-2 text-center text-sm"
                >
                  <option value="" disabled>
                    Şehir seçiniz
                  </option>
                  {cities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gradient-to-br from-orange-800/85 to-amber-700/85 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col backdrop-blur">
                <h2 className="text-center text-lg md:text-xl font-semibold mb-4">Elektrik Fatura Tutarını Giriniz</h2>
                <input
                  type="range"
                  min={0}
                  max={20000}
                  step={500}
                  value={billValue}
                  onChange={(e) => setBillValue(Number(e.target.value))}
                  className="w-full accent-white"
                />
                <div className="text-center mt-3 text-xl font-bold">
                  {billValue ? `${billValue.toLocaleString('tr-TR')} ₺` : '---'}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:opacity-90 text-white font-semibold tracking-wider px-8 py-3 rounded-full shadow-2xl text-base transition-transform hover:scale-105"
              >
                HESAPLAMAK İÇİN TIKLAYIN...
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
