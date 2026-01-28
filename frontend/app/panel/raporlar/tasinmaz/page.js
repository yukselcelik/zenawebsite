"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ApiService from "../../../../lib/api";

const PROPERTY_OPTIONS = [
  "Fenerbahçe Ofis",
  "Çengelköy Ofis",
  "Sivas Ofis",
  "Teknopark Ofis",
  "Teknokent Ofis",
];

const EQUIPMENT_OPTIONS = [
  "Dizüstü Bilgisayar 1",
  "Dizüstü Bilgisayar 2",
  "Dizüstü Bilgisayar 3",
];

const SUB_SECTIONS = [
  { id: 1, name: "Taşınmaz Listesi" },
  { id: 2, name: "Ekipman/Demirbaş Listesi" },
  { id: 3, name: "Temizlik Raporu" },
];

export default function TasinmazRaporuPage() {
  const router = useRouter();
  const [isManager, setIsManager] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [formData, setFormData] = useState({
    tasinmazNumarasi: "",
    tasinmazTuru: "",
    adres: "",
    ilce: "",
    il: "",
    mulkiyet: "",
    kullanim: "",
    tapuDurumu: "",
    alan: "",
    guncelDeger: "",
    gelirGiderDurumu: "",
    notlar: "",
  });
  const [equipmentFormData, setEquipmentFormData] = useState({
    demirbasNumarasi: "",
    markaModel: "",
    kategori: "",
    lokasyonBirim: "",
    kullaniciSorumlu: "",
    teminTarihi: "",
    teminSekli: "",
    garantiBitisTarihi: "",
    durum: "",
    sonBakimKontrolTarihi: "",
    tahminiDeger: "",
    seriNumarasi: "",
    notlar: "",
  });
  const [documents, setDocuments] = useState([]);
  const [equipmentDocuments, setEquipmentDocuments] = useState([]);
  const [cleaningFormData, setCleaningFormData] = useState({
    tarih: "",
    tasinmazNumarasi: "",
    tasinmazAdi: "",
    tapuAdresBilgileri: "",
    temizlikDurumu: "",
    temizlikSikligi: "",
    sorumluKisi: "",
    notlar: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEquipmentInputChange = (field, value) => {
    setEquipmentFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleEquipmentFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setEquipmentDocuments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleRemoveDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveEquipmentDocument = (index) => {
    setEquipmentDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCleaningInputChange = (field, value) => {
    setCleaningFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Backend API'ye kaydet
    if (activeSubSection === 1) {
      console.log("Property Form Data:", formData);
      console.log("Selected Property:", selectedProperty);
      console.log("Documents:", documents);
    } else if (activeSubSection === 2) {
      console.log("Equipment Form Data:", equipmentFormData);
      console.log("Selected Equipment:", selectedEquipment);
      console.log("Equipment Documents:", equipmentDocuments);
    } else if (activeSubSection === 3) {
      console.log("Cleaning Form Data:", cleaningFormData);
    }
    alert("Kayıt işlemi yakında eklenecek");
  };

  // Sayfaya sadece admin (yönetici) erişebilsin
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const profileData = await ApiService.getProfile();
        if (profileData?.data?.role === "Manager") {
          setIsManager(true);
        } else {
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
          <h1 className="text-3xl font-bold text-white">Taşınmaz Raporu</h1>
        </div>
      </div>

      {/* Alt Başlıklar */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex gap-4">
          {SUB_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSubSection(section.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeSubSection === section.id
                  ? "bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>

      {/* Taşınmaz Listesi İçeriği */}
      {activeSubSection === 1 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Taşınmaz Adı
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Seçiniz...</option>
              {PROPERTY_OPTIONS.map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
            </select>
          </div>

          {selectedProperty && (
            <div className="space-y-6 border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold text-white">
                Taşınmaz Raporu
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Taşınmaz Numarası
                  </label>
                  <input
                    type="text"
                    value={formData.tasinmazNumarasi}
                    onChange={(e) =>
                      handleInputChange("tasinmazNumarasi", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Taşınmaz Türü
                  </label>
                  <input
                    type="text"
                    value={formData.tasinmazTuru}
                    onChange={(e) =>
                      handleInputChange("tasinmazTuru", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Adres
                  </label>
                  <input
                    type="text"
                    value={formData.adres}
                    onChange={(e) => handleInputChange("adres", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    İlçe
                  </label>
                  <input
                    type="text"
                    value={formData.ilce}
                    onChange={(e) => handleInputChange("ilce", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    İl
                  </label>
                  <input
                    type="text"
                    value={formData.il}
                    onChange={(e) => handleInputChange("il", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mülkiyet
                  </label>
                  <input
                    type="text"
                    value={formData.mulkiyet}
                    onChange={(e) =>
                      handleInputChange("mulkiyet", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kullanım
                  </label>
                  <input
                    type="text"
                    value={formData.kullanim}
                    onChange={(e) =>
                      handleInputChange("kullanim", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tapu Durumu
                  </label>
                  <input
                    type="text"
                    value={formData.tapuDurumu}
                    onChange={(e) =>
                      handleInputChange("tapuDurumu", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Alan
                  </label>
                  <input
                    type="text"
                    value={formData.alan}
                    onChange={(e) => handleInputChange("alan", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Güncel Değer
                  </label>
                  <input
                    type="text"
                    value={formData.guncelDeger}
                    onChange={(e) =>
                      handleInputChange("guncelDeger", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gelir/Gider Durumu
                  </label>
                  <input
                    type="text"
                    value={formData.gelirGiderDurumu}
                    onChange={(e) =>
                      handleInputChange("gelirGiderDurumu", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notlar
                  </label>
                  <textarea
                    value={formData.notlar}
                    onChange={(e) => handleInputChange("notlar", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tapu/Diğer Belgeler
                  </label>
                  <div className="space-y-3">
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                        <svg
                          className="w-10 h-10 text-gray-500 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-gray-400 text-sm">
                          Dosya Yükle (PDF, JPG, PNG)
                        </span>
                      </div>
                    </label>

                    {documents.length > 0 && (
                      <div className="space-y-2">
                        {documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                          >
                            <span className="text-sm text-gray-300 truncate flex-1">
                              {doc.name}
                            </span>
                            <button
                              onClick={() => handleRemoveDocument(index)}
                              className="ml-2 text-red-400 hover:text-red-300"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
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
          )}
        </div>
      )}

      {/* Ekipman/Demirbaş Listesi İçeriği */}
      {activeSubSection === 2 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ekipman Adı
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Seçiniz...</option>
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
          </div>

          {selectedEquipment && (
            <div className="space-y-6 border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold text-white">
                Ekipman/Demirbaş Raporu
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Demirbaş Numarası
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.demirbasNumarasi}
                    onChange={(e) =>
                      handleEquipmentInputChange("demirbasNumarasi", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Marka/Model
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.markaModel}
                    onChange={(e) =>
                      handleEquipmentInputChange("markaModel", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.kategori}
                    onChange={(e) =>
                      handleEquipmentInputChange("kategori", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Lokasyon/Birim
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.lokasyonBirim}
                    onChange={(e) =>
                      handleEquipmentInputChange("lokasyonBirim", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kullanıcı/Sorumlu
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.kullaniciSorumlu}
                    onChange={(e) =>
                      handleEquipmentInputChange("kullaniciSorumlu", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Temin Tarihi
                  </label>
                  <input
                    type="date"
                    value={equipmentFormData.teminTarihi}
                    onChange={(e) =>
                      handleEquipmentInputChange("teminTarihi", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Temin Şekli
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.teminSekli}
                    onChange={(e) =>
                      handleEquipmentInputChange("teminSekli", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Garanti Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={equipmentFormData.garantiBitisTarihi}
                    onChange={(e) =>
                      handleEquipmentInputChange("garantiBitisTarihi", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Durum
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.durum}
                    onChange={(e) =>
                      handleEquipmentInputChange("durum", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Son Bakım/Kontrol Tarihi
                  </label>
                  <input
                    type="date"
                    value={equipmentFormData.sonBakimKontrolTarihi}
                    onChange={(e) =>
                      handleEquipmentInputChange("sonBakimKontrolTarihi", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tahmini Değer
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.tahminiDeger}
                    onChange={(e) =>
                      handleEquipmentInputChange("tahminiDeger", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Seri Numarası
                  </label>
                  <input
                    type="text"
                    value={equipmentFormData.seriNumarasi}
                    onChange={(e) =>
                      handleEquipmentInputChange("seriNumarasi", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notlar
                  </label>
                  <textarea
                    value={equipmentFormData.notlar}
                    onChange={(e) =>
                      handleEquipmentInputChange("notlar", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fiş/Fatura/Belge
                  </label>
                  <div className="space-y-3">
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleEquipmentFileUpload}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                        <svg
                          className="w-10 h-10 text-gray-500 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-gray-400 text-sm">
                          Dosya Yükle (PDF, JPG, PNG)
                        </span>
                      </div>
                    </label>

                    {equipmentDocuments.length > 0 && (
                      <div className="space-y-2">
                        {equipmentDocuments.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                          >
                            <span className="text-sm text-gray-300 truncate flex-1">
                              {doc.name}
                            </span>
                            <button
                              onClick={() => handleRemoveEquipmentDocument(index)}
                              className="ml-2 text-red-400 hover:text-red-300"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
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
          )}
        </div>
      )}

      {/* Temizlik Raporu İçeriği */}
      {activeSubSection === 3 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-white">
            Temizlik Raporu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tarih
              </label>
              <input
                type="date"
                value={cleaningFormData.tarih}
                onChange={(e) =>
                  handleCleaningInputChange("tarih", e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Taşınmaz Numarası
              </label>
              <input
                type="text"
                value={cleaningFormData.tasinmazNumarasi}
                onChange={(e) =>
                  handleCleaningInputChange("tasinmazNumarasi", e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Taşınmaz Adı
              </label>
              <input
                type="text"
                value={cleaningFormData.tasinmazAdi}
                onChange={(e) =>
                  handleCleaningInputChange("tasinmazAdi", e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Temizlik Durumu
              </label>
              <input
                type="text"
                value={cleaningFormData.temizlikDurumu}
                onChange={(e) =>
                  handleCleaningInputChange("temizlikDurumu", e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Temizlik Sıklığı
              </label>
              <input
                type="text"
                value={cleaningFormData.temizlikSikligi}
                onChange={(e) =>
                  handleCleaningInputChange("temizlikSikligi", e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sorumlu Kişi
              </label>
              <input
                type="text"
                value={cleaningFormData.sorumluKisi}
                onChange={(e) =>
                  handleCleaningInputChange("sorumluKisi", e.target.value)
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tapu/Adres Bilgileri
              </label>
              <textarea
                value={cleaningFormData.tapuAdresBilgileri}
                onChange={(e) =>
                  handleCleaningInputChange("tapuAdresBilgileri", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notlar
              </label>
              <textarea
                value={cleaningFormData.notlar}
                onChange={(e) =>
                  handleCleaningInputChange("notlar", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
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
      )}
    </div>
  );
}
