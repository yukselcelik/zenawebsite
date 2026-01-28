"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ApiService from "../../../../lib/api";

export default function CalisanDevamTakipPage() {
  const router = useRouter();
  const [isManager, setIsManager] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    tarih: "",
    adiSoyadi: "",
    pozisyon: "",
    girisSaati: "",
    cikisSaati: "",
    molaSaati: "",
    toplamCalismaSaati: "",
    gecikmeDurumu: "Yok",
    devamsizlikDurumu: "",
    izinTuru: "",
    gorevli: "",
    gorevYeri: "",
    notlar: "",
  });

  useEffect(() => {
    checkUserRole();
    loadAllUsers();
  }, []);

  useEffect(() => {
    // Seçilen kullanıcı değiştiğinde form verilerini güncelle
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        adiSoyadi: `${selectedUser.name || ""} ${selectedUser.surname || ""}`.trim(),
        pozisyon: selectedUser.role || "",
      }));
    }
  }, [selectedUser]);

  useEffect(() => {
    // Toplam çalışma saatini hesapla
    if (formData.girisSaati && formData.cikisSaati) {
      calculateTotalWorkHours();
    } else {
      setFormData((prev) => ({
        ...prev,
        toplamCalismaSaati: "",
      }));
    }
  }, [formData.girisSaati, formData.cikisSaati, formData.molaSaati]);

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

  const loadAllUsers = async () => {
    try {
      // Tüm personeli çek (hem çalışan hem yönetici)
      const result = await ApiService.getPersonnelList(1, 1000);
      if (result?.data?.items) {
        setAllUsers(result.data.items);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleUserSelect = async (userId) => {
    setSelectedUserId(userId);
    if (userId) {
      try {
        // Seçilen kullanıcının detaylarını çek
        const userDetail = await ApiService.getUserDetail(parseInt(userId));
        if (userDetail?.data) {
          setSelectedUser(userDetail.data);
        } else {
          // Eğer detay yoksa, listeden bul
          const user = allUsers.find((u) => u.id === parseInt(userId));
          if (user) {
            setSelectedUser(user);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Hata durumunda listeden bul
        const user = allUsers.find((u) => u.id === parseInt(userId));
        if (user) {
          setSelectedUser(user);
        }
      }
    } else {
      setSelectedUser(null);
      setFormData((prev) => ({
        ...prev,
        adiSoyadi: "",
        pozisyon: "",
      }));
    }
  };

  const calculateTotalWorkHours = () => {
    try {
      const giris = formData.girisSaati.split(":");
      const cikis = formData.cikisSaati.split(":");
      const mola = formData.molaSaati ? formData.molaSaati.split(":") : [0, 0];

      const girisMinutes = parseInt(giris[0]) * 60 + parseInt(giris[1]);
      const cikisMinutes = parseInt(cikis[0]) * 60 + parseInt(cikis[1]);
      const molaMinutes = parseInt(mola[0]) * 60 + parseInt(mola[1]);

      let totalMinutes = cikisMinutes - girisMinutes - molaMinutes;

      // Eğer çıkış saati giriş saatinden küçükse (gece vardiyası)
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60; // 24 saat ekle
      }

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setFormData((prev) => ({
        ...prev,
        toplamCalismaSaati: `${hours}:${minutes.toString().padStart(2, "0")}`,
      }));
    } catch (error) {
      console.error("Error calculating work hours:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Backend API'ye kaydet
    console.log("Attendance Report Data:", formData);
    alert("Kayıt işlemi yakında eklenecek");
  };

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
            Çalışan Devam Takip Raporu
          </h1>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tarih
            </label>
            <input
              type="date"
              value={formData.tarih}
              onChange={(e) => handleInputChange("tarih", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Adı Soyadı
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Kişi Seçiniz...</option>
              {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.surname} ({user.role === "Manager" ? "Yönetici" : "Çalışan"})
                </option>
              ))}
            </select>
            {selectedUser && (
              <p className="text-xs text-gray-400 mt-1">
                Seçilen: {formData.adiSoyadi}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pozisyon
            </label>
            <input
              type="text"
              value={formData.pozisyon}
              onChange={(e) => handleInputChange("pozisyon", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Giriş Saati
            </label>
            <input
              type="time"
              value={formData.girisSaati}
              onChange={(e) => handleInputChange("girisSaati", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Çıkış Saati
            </label>
            <input
              type="time"
              value={formData.cikisSaati}
              onChange={(e) => handleInputChange("cikisSaati", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mola Saati
            </label>
            <input
              type="time"
              value={formData.molaSaati}
              onChange={(e) => handleInputChange("molaSaati", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="00:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Toplam Çalışma Saati
            </label>
            <input
              type="text"
              value={formData.toplamCalismaSaati}
              readOnly
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white cursor-not-allowed"
              placeholder="Otomatik hesaplanır"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gecikme Durumu
            </label>
            <input
              type="text"
              value={formData.gecikmeDurumu}
              onChange={(e) => handleInputChange("gecikmeDurumu", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Yok (Var ise: 3 saat, 15 dakika vs.)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Devamsızlık Durumu
            </label>
            <input
              type="text"
              value={formData.devamsizlikDurumu}
              onChange={(e) => handleInputChange("devamsizlikDurumu", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              İzin Türü
            </label>
            <input
              type="text"
              value={formData.izinTuru}
              onChange={(e) => handleInputChange("izinTuru", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Görevli
            </label>
            <select
              value={formData.gorevli}
              onChange={(e) => handleInputChange("gorevli", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Seçiniz...</option>
              <option value="Evet">Evet</option>
              <option value="Hayır">Hayır</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Görev Yeri
            </label>
            <input
              type="text"
              value={formData.gorevYeri}
              onChange={(e) => handleInputChange("gorevYeri", e.target.value)}
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
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
        </div>

        {/* Kaydet ve İptal Butonları */}
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
    </div>
  );
}
