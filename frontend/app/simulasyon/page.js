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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="relative min-h-screen py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-[32px] shadow-lg px-6 sm:px-10 py-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-[0.25em] text-gray-900">SOLAR GÜÇ HESAPLAMA</h1>
              <p className="text-gray-600 text-sm md:text-base mt-2">
                Kurulum senaryonuzu seçin, şehir ve fatura bilgilerinizi girin. Size en uygun güneş enerjisi çözümünü
                birlikte hesaplayalım.
              </p>
            </div>

            <div className="space-y-6">
              {/* Subscriber type */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">
                  Abone Türünü Seçiniz
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {subscriberTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSubscriberType(type.id)}
                      className={`flex flex-col items-center gap-1 rounded-2xl py-4 border text-sm font-semibold transition-all ${
                        subscriberType === type.id
                          ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
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
                <label className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">
                  Kurulum Sahasını Seçiniz
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {installationAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setInstallationArea(area.id)}
                      className={`flex items-center justify-center gap-2 rounded-2xl py-4 border text-sm font-semibold transition-all ${
                        installationArea === area.id
                          ? 'bg-green-500 text-white border-green-400 shadow-lg'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
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
                <label className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-2">
                  Çatı veya Arazi Alanını Giriniz
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={areaSize}
                    placeholder="m²"
                    onChange={(e) => setAreaSize(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">m²</span>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-2">
                  Bulunduğunuz Şehri Seçiniz
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200"
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
                <label className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-4">
                  Elektrik Fatura Tutarını Giriniz
                </label>
                <input
                  type="range"
                  min={0}
                  max={20000}
                  step={500}
                  value={billValue}
                  onChange={(e) => setBillValue(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="text-right mt-2 text-lg font-bold text-gray-900">
                  {billValue ? `${billValue.toLocaleString('tr-TR')} ₺` : '---'}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-10 py-3 text-white font-semibold tracking-wider shadow-lg hover:from-orange-600 hover:to-orange-700 transition"
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
