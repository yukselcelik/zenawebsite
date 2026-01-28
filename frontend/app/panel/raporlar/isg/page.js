"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ApiService from "../../../../lib/api";

export default function ISGRaporuPage() {
  const router = useRouter();
  const [isManager, setIsManager] = useState(false);

  // 1. Genel Durum
  const [generalData, setGeneralData] = useState({
    donem: "",
    incelenenSahaSayisi: "",
    denetimSayisi: "",
    uygunsuzlukSayisi: "",
    giderilenUygunsuzluk: "",
    devamEdenAksiyon: "",
    egitimSayisi: "",
    katilimOrani: "",
    kaza: "",
    olasiKazaBildirimi: "",
    riskAnaliziGuncelleme: "",
  });

  // 2. Saha Kontrolleri
  const [siteInspections, setSiteInspections] = useState([
    {
      id: 1,
      tarih: "",
      sahaAdi: "",
      denetimKonusu: "",
      tespitEdilenUygunsuzluk: "",
      alinanAksiyon: "",
      sorumluCalisan: "",
      gorevi: "",
      durum: "",
    },
  ]);

  // 3. Eğitimler
  const [trainings, setTrainings] = useState([
    {
      id: 1,
      tarih: "",
      calisanAdi: "",
      egitimBasligi: "",
      katilimciSayisi: "",
      katilimOrani: "",
      egitmen: "",
      egitimTuru: "",
      not: "",
    },
  ]);

  // 4. Risk Analizi
  const [riskAnalyses, setRiskAnalyses] = useState([
    {
      id: 1,
      sonGuncelleme: "",
      alanSaha: "",
      riskNumarasi: "",
      riskTuru: "",
      riskKonusu: "",
      riskinKaynagi: "",
      olasiSonuc: "",
      alinanOnlem: "",
      onlemTarihi: "",
      sorumluCalisan: "",
      gorevi: "",
      durum: "",
    },
  ]);

  // 5. Öneriler
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      tarih: "",
      alanSaha: "",
      konu: "",
      gozlem: "",
      oneri: "",
      sorumluCalisan: "",
      notlar: "",
    },
  ]);

  const handleGeneralDataChange = (field, value) => {
    setGeneralData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSiteInspectionChange = (index, field, value) => {
    setSiteInspections((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const addSiteInspection = () => {
    setSiteInspections((prev) => [
      ...prev,
      {
        id: Date.now(),
        tarih: "",
        sahaAdi: "",
        denetimKonusu: "",
        tespitEdilenUygunsuzluk: "",
        alinanAksiyon: "",
        sorumluCalisan: "",
        gorevi: "",
        durum: "",
      },
    ]);
  };

  const removeSiteInspection = (id) => {
    if (siteInspections.length > 1) {
      setSiteInspections((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleTrainingChange = (index, field, value) => {
    setTrainings((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const addTraining = () => {
    setTrainings((prev) => [
      ...prev,
      {
        id: Date.now(),
        tarih: "",
        calisanAdi: "",
        egitimBasligi: "",
        katilimciSayisi: "",
        katilimOrani: "",
        egitmen: "",
        egitimTuru: "",
        not: "",
      },
    ]);
  };

  const removeTraining = (id) => {
    if (trainings.length > 1) {
      setTrainings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleRiskAnalysisChange = (index, field, value) => {
    setRiskAnalyses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const addRiskAnalysis = () => {
    setRiskAnalyses((prev) => [
      ...prev,
      {
        id: Date.now(),
        sonGuncelleme: "",
        alanSaha: "",
        riskNumarasi: "",
        riskTuru: "",
        riskKonusu: "",
        riskinKaynagi: "",
        olasiSonuc: "",
        alinanOnlem: "",
        onlemTarihi: "",
        sorumluCalisan: "",
        gorevi: "",
        durum: "",
      },
    ]);
  };

  const removeRiskAnalysis = (id) => {
    if (riskAnalyses.length > 1) {
      setRiskAnalyses((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleRecommendationChange = (index, field, value) => {
    setRecommendations((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const addRecommendation = () => {
    setRecommendations((prev) => [
      ...prev,
      {
        id: Date.now(),
        tarih: "",
        alanSaha: "",
        konu: "",
        gozlem: "",
        oneri: "",
        sorumluCalisan: "",
        notlar: "",
      },
    ]);
  };

  const removeRecommendation = (id) => {
    if (recommendations.length > 1) {
      setRecommendations((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSave = () => {
    const reportData = {
      generalData,
      siteInspections,
      trainings,
      riskAnalyses,
      recommendations,
      totalRiskCount: riskAnalyses.length,
    };
    console.log("ISG Report Data:", reportData);
    alert("Kayıt işlemi yakında eklenecek");
  };

  // Sayfaya sadece admin (yönetici) erişebilsin
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const profileData = await ApiService.getProfile();
        const isManagerRole = profileData?.data?.role === "Manager";
        setIsManager(isManagerRole);
        if (!isManagerRole) {
          router.push("/panel/raporlar");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        router.push("/panel/raporlar");
      }
    };

    checkUserRole();
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-white">
            İş Sağlığı ve Güvenliği Raporu
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. İş Sağlığı ve Güvenliği Genel Durum */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            1. İş Sağlığı ve Güvenliği Genel Durum
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dönem
              </label>
              <input
                type="text"
                value={generalData.donem}
                onChange={(e) => handleGeneralDataChange("donem", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                İncelenen Saha Sayısı
              </label>
              <input
                type="number"
                value={generalData.incelenenSahaSayisi}
                onChange={(e) => handleGeneralDataChange("incelenenSahaSayisi", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Denetim Sayısı
              </label>
              <input
                type="number"
                value={generalData.denetimSayisi}
                onChange={(e) => handleGeneralDataChange("denetimSayisi", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Uygunsuzluk Sayısı
              </label>
              <input
                type="number"
                value={generalData.uygunsuzlukSayisi}
                onChange={(e) => handleGeneralDataChange("uygunsuzlukSayisi", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Giderilen Uygunsuzluk
              </label>
              <input
                type="number"
                value={generalData.giderilenUygunsuzluk}
                onChange={(e) => handleGeneralDataChange("giderilenUygunsuzluk", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Devam Eden Aksiyon
              </label>
              <input
                type="number"
                value={generalData.devamEdenAksiyon}
                onChange={(e) => handleGeneralDataChange("devamEdenAksiyon", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Eğitim Sayısı
              </label>
              <input
                type="number"
                value={generalData.egitimSayisi}
                onChange={(e) => handleGeneralDataChange("egitimSayisi", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Katılım Oranı
              </label>
              <input
                type="text"
                value={generalData.katilimOrani}
                onChange={(e) => handleGeneralDataChange("katilimOrani", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kaza
              </label>
              <input
                type="text"
                value={generalData.kaza}
                onChange={(e) => handleGeneralDataChange("kaza", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Olası Kaza Bildirimi
              </label>
              <input
                type="text"
                value={generalData.olasiKazaBildirimi}
                onChange={(e) => handleGeneralDataChange("olasiKazaBildirimi", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Risk Analizi Güncelleme
              </label>
              <input
                type="text"
                value={generalData.riskAnaliziGuncelleme}
                onChange={(e) => handleGeneralDataChange("riskAnaliziGuncelleme", e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Saha Kontrolleri */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              2. Saha Kontrolleri
            </h2>
            <button
              onClick={addSiteInspection}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ekle
            </button>
          </div>
          <div className="space-y-6">
            {siteInspections.map((inspection, index) => (
              <div key={inspection.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Saha Kontrolü {index + 1}</h3>
                  {siteInspections.length > 1 && (
                    <button
                      onClick={() => removeSiteInspection(inspection.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tarih</label>
                    <input
                      type="date"
                      value={inspection.tarih}
                      onChange={(e) => handleSiteInspectionChange(index, "tarih", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Saha Adı</label>
                    <input
                      type="text"
                      value={inspection.sahaAdi}
                      onChange={(e) => handleSiteInspectionChange(index, "sahaAdi", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Denetim Konusu</label>
                    <input
                      type="text"
                      value={inspection.denetimKonusu}
                      onChange={(e) => handleSiteInspectionChange(index, "denetimKonusu", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sorumlu Çalışan</label>
                    <input
                      type="text"
                      value={inspection.sorumluCalisan}
                      onChange={(e) => handleSiteInspectionChange(index, "sorumluCalisan", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Görevi</label>
                    <input
                      type="text"
                      value={inspection.gorevi}
                      onChange={(e) => handleSiteInspectionChange(index, "gorevi", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Durum</label>
                    <input
                      type="text"
                      value={inspection.durum}
                      onChange={(e) => handleSiteInspectionChange(index, "durum", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tespit Edilen Uygunsuzluk</label>
                    <textarea
                      value={inspection.tespitEdilenUygunsuzluk}
                      onChange={(e) => handleSiteInspectionChange(index, "tespitEdilenUygunsuzluk", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alınan Aksiyon</label>
                    <textarea
                      value={inspection.alinanAksiyon}
                      onChange={(e) => handleSiteInspectionChange(index, "alinanAksiyon", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Eğitimler */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">3. Eğitimler</h2>
            <button
              onClick={addTraining}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ekle
            </button>
          </div>
          <div className="space-y-6">
            {trainings.map((training, index) => (
              <div key={training.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Eğitim {index + 1}</h3>
                  {trainings.length > 1 && (
                    <button
                      onClick={() => removeTraining(training.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tarih</label>
                    <input
                      type="date"
                      value={training.tarih}
                      onChange={(e) => handleTrainingChange(index, "tarih", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Çalışan Adı</label>
                    <input
                      type="text"
                      value={training.calisanAdi}
                      onChange={(e) => handleTrainingChange(index, "calisanAdi", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Eğitim Başlığı</label>
                    <input
                      type="text"
                      value={training.egitimBasligi}
                      onChange={(e) => handleTrainingChange(index, "egitimBasligi", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Katılımcı Sayısı</label>
                    <input
                      type="number"
                      value={training.katilimciSayisi}
                      onChange={(e) => handleTrainingChange(index, "katilimciSayisi", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Katılım Oranı</label>
                    <input
                      type="text"
                      value={training.katilimOrani}
                      onChange={(e) => handleTrainingChange(index, "katilimOrani", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Eğitmen</label>
                    <input
                      type="text"
                      value={training.egitmen}
                      onChange={(e) => handleTrainingChange(index, "egitmen", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Eğitim Türü</label>
                    <input
                      type="text"
                      value={training.egitimTuru}
                      onChange={(e) => handleTrainingChange(index, "egitimTuru", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Not</label>
                    <textarea
                      value={training.not}
                      onChange={(e) => handleTrainingChange(index, "not", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Risk Analizi */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">4. Risk Analizi</h2>
            <button
              onClick={addRiskAnalysis}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ekle
            </button>
          </div>
          <div className="space-y-6">
            {riskAnalyses.map((risk, index) => (
              <div key={risk.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Risk Analizi {index + 1}</h3>
                  {riskAnalyses.length > 1 && (
                    <button
                      onClick={() => removeRiskAnalysis(risk.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Son Güncelleme</label>
                    <input
                      type="date"
                      value={risk.sonGuncelleme}
                      onChange={(e) => handleRiskAnalysisChange(index, "sonGuncelleme", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alan/Saha</label>
                    <input
                      type="text"
                      value={risk.alanSaha}
                      onChange={(e) => handleRiskAnalysisChange(index, "alanSaha", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Risk Numarası</label>
                    <input
                      type="text"
                      value={risk.riskNumarasi}
                      onChange={(e) => handleRiskAnalysisChange(index, "riskNumarasi", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Risk Türü</label>
                    <input
                      type="text"
                      value={risk.riskTuru}
                      onChange={(e) => handleRiskAnalysisChange(index, "riskTuru", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Yüksek, Orta, Düşük"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Risk Konusu</label>
                    <input
                      type="text"
                      value={risk.riskKonusu}
                      onChange={(e) => handleRiskAnalysisChange(index, "riskKonusu", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sorumlu Çalışan</label>
                    <input
                      type="text"
                      value={risk.sorumluCalisan}
                      onChange={(e) => handleRiskAnalysisChange(index, "sorumluCalisan", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Görevi</label>
                    <input
                      type="text"
                      value={risk.gorevi}
                      onChange={(e) => handleRiskAnalysisChange(index, "gorevi", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Durum</label>
                    <input
                      type="text"
                      value={risk.durum}
                      onChange={(e) => handleRiskAnalysisChange(index, "durum", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Riskin Kaynağı</label>
                    <textarea
                      value={risk.riskinKaynagi}
                      onChange={(e) => handleRiskAnalysisChange(index, "riskinKaynagi", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Olası Sonuç</label>
                    <textarea
                      value={risk.olasiSonuc}
                      onChange={(e) => handleRiskAnalysisChange(index, "olasiSonuc", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alınan Önlem</label>
                    <textarea
                      value={risk.alinanOnlem}
                      onChange={(e) => handleRiskAnalysisChange(index, "alinanOnlem", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Önlem Tarihi</label>
                    <input
                      type="date"
                      value={risk.onlemTarihi}
                      onChange={(e) => handleRiskAnalysisChange(index, "onlemTarihi", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            {/* Toplam Risk Sayısı */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
              <div className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold">
                Toplam Risk Sayısı
              </div>
              <div className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold">
                {riskAnalyses.length}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Öneriler */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">5. Öneriler</h2>
            <button
              onClick={addRecommendation}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ekle
            </button>
          </div>
          <div className="space-y-6">
            {recommendations.map((recommendation, index) => (
              <div key={recommendation.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Öneri {index + 1}</h3>
                  {recommendations.length > 1 && (
                    <button
                      onClick={() => removeRecommendation(recommendation.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tarih</label>
                    <input
                      type="date"
                      value={recommendation.tarih}
                      onChange={(e) => handleRecommendationChange(index, "tarih", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alan/Saha</label>
                    <input
                      type="text"
                      value={recommendation.alanSaha}
                      onChange={(e) => handleRecommendationChange(index, "alanSaha", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Konu</label>
                    <input
                      type="text"
                      value={recommendation.konu}
                      onChange={(e) => handleRecommendationChange(index, "konu", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sorumlu Çalışan</label>
                    <input
                      type="text"
                      value={recommendation.sorumluCalisan}
                      onChange={(e) => handleRecommendationChange(index, "sorumluCalisan", e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gözlem</label>
                    <textarea
                      value={recommendation.gozlem}
                      onChange={(e) => handleRecommendationChange(index, "gozlem", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Öneri</label>
                    <textarea
                      value={recommendation.oneri}
                      onChange={(e) => handleRecommendationChange(index, "oneri", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Notlar</label>
                    <textarea
                      value={recommendation.notlar}
                      onChange={(e) => handleRecommendationChange(index, "notlar", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kaydet ve İptal Butonları */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
