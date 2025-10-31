'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SimulationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solar Güç Simulasyonu</h1>
        <p className="text-gray-700 mb-10">Hesaplama formüllerini birlikte tanımladıktan sonra buraya hesaplama formu eklenecek.</p>
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
          Hesaplama formu yakında burada olacak.
        </div>
      </main>
      <Footer />
    </div>
  );
}


