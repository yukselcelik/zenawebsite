"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ApiService from "../../../../lib/api";

const PERFORMANCE_CRITERIA = [
  { id: 1, name: "İş Ahlakı" },
  { id: 2, name: "Disiplin" },
  { id: 3, name: "Nitelik" },
  { id: 4, name: "Davranış" },
  { id: 5, name: "Gelişim" },
];

export default function PerformansDegerlendirmePage() {
  const router = useRouter();
  const [isManager, setIsManager] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    adiSoyadi: "",
    gorevi: "",
    kimlikNumarasi: "",
    iseBaslamaTarihi: "",
    degerlendirmeTarihi: "",
  });
  const [criteriaData, setCriteriaData] = useState(
    PERFORMANCE_CRITERIA.map((criterion) => ({
      criterionId: criterion.id,
      criterionName: criterion.name,
      yoneticiNotu: "",
      puanlama: "",
    }))
  );
  const [yoneticiGorusu, setYoneticiGorusu] = useState("");
  const [yoneticiAdiSoyadi, setYoneticiAdiSoyadi] = useState("");
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    checkUserRole();
    loadEmployees();
  }, []);

  useEffect(() => {
    // Seçilen çalışan değiştiğinde form verilerini güncelle
    if (selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        adiSoyadi: `${selectedEmployee.name || ""} ${selectedEmployee.surname || ""}`.trim(),
        gorevi: selectedEmployee.role || "",
        kimlikNumarasi: selectedEmployee.tcNo || "",
        iseBaslamaTarihi: selectedEmployee.birthDate ? new Date(selectedEmployee.birthDate).toISOString().split('T')[0] : "",
      }));
    }
  }, [selectedEmployee]);

  useEffect(() => {
    // Puanları topla
    const total = criteriaData.reduce((sum, item) => {
      const score = parseInt(item.puanlama) || 0;
      return sum + score;
    }, 0);
    setTotalScore(total);
  }, [criteriaData]);

  const checkUserRole = async () => {
    try {
      const profileData = await ApiService.getProfile();
      if (profileData?.data) {
        const isManagerRole = profileData.data.role === "Manager";
        setIsManager(isManagerRole);

        // Yönetici değilse raporlar sayfasına yönlendir
        if (!isManagerRole) {
          router.push("/panel/raporlar");
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      router.push("/panel/raporlar");
    }
  };

  const loadEmployees = async () => {
    try {
      // Tüm personeli çek (sayfalama ile)
      const result = await ApiService.getPersonnelList(1, 1000);
      if (result?.data?.items) {
        // Sadece çalışanları filtrele (yöneticileri hariç tut)
        const employeeList = result.data.items.filter(
          (user) => user.role !== "Manager"
        );
        setEmployees(employeeList);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const handleEmployeeSelect = async (employeeId) => {
    setSelectedEmployeeId(employeeId);
    if (employeeId) {
      try {
        // Seçilen çalışanın detaylarını çek
        const employeeDetail = await ApiService.getUserDetail(parseInt(employeeId));
        if (employeeDetail?.data) {
          setSelectedEmployee(employeeDetail.data);
        } else {
          // Eğer detay yoksa, listeden bul
          const employee = employees.find((emp) => emp.id === parseInt(employeeId));
          if (employee) {
            setSelectedEmployee(employee);
          }
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        // Hata durumunda listeden bul
        const employee = employees.find((emp) => emp.id === parseInt(employeeId));
        if (employee) {
          setSelectedEmployee(employee);
        }
      }
    } else {
      setSelectedEmployee(null);
      setFormData({
        adiSoyadi: "",
        gorevi: "",
        kimlikNumarasi: "",
        iseBaslamaTarihi: "",
        degerlendirmeTarihi: formData.degerlendirmeTarihi, // Değerlendirme tarihini koru
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCriteriaChange = (index, field, value) => {
    setCriteriaData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleSave = () => {
    // TODO: Backend API'ye kaydet
    const reportData = {
      formData,
      criteriaData,
      yoneticiGorusu,
      yoneticiAdiSoyadi,
      totalScore,
    };
    console.log("Performance Report Data:", reportData);
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
            Performans Değerlendirme Raporu
          </h1>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
        {/* Üst Bilgiler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Adı Soyadı
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Çalışan Seçiniz...</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} {employee.surname}
                </option>
              ))}
            </select>
            {selectedEmployee && (
              <p className="text-xs text-gray-400 mt-1">
                Seçilen: {formData.adiSoyadi}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Görevi
            </label>
            <input
              type="text"
              value={formData.gorevi}
              onChange={(e) => handleInputChange("gorevi", e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kimlik Numarası
            </label>
            <input
              type="text"
              value={formData.kimlikNumarasi}
              onChange={(e) =>
                handleInputChange("kimlikNumarasi", e.target.value)
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              İşe Başlama Tarihi
            </label>
            <input
              type="date"
              value={formData.iseBaslamaTarihi}
              onChange={(e) =>
                handleInputChange("iseBaslamaTarihi", e.target.value)
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Değerlendirme Tarihi
            </label>
            <input
              type="date"
              value={formData.degerlendirmeTarihi}
              onChange={(e) =>
                handleInputChange("degerlendirmeTarihi", e.target.value)
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Performans Değerlendirme Tablosu */}
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Performans Değerlendirme
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white border border-gray-600">
                    Performans Değerlendirme Kriterleri
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white border border-gray-600">
                    Yönetici Notu
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white border border-gray-600 w-32">
                    Puanlama
                  </th>
                </tr>
              </thead>
              <tbody>
                {criteriaData.map((item, index) => (
                  <tr
                    key={item.criterionId}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-white border border-gray-600 bg-gray-750">
                      {item.criterionName}
                    </td>
                    <td className="px-4 py-3 border border-gray-600">
                      <textarea
                        value={item.yoneticiNotu}
                        onChange={(e) =>
                          handleCriteriaChange(
                            index,
                            "yoneticiNotu",
                            e.target.value
                          )
                        }
                        rows={2}
                        disabled={!isManager}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed resize-none"
                        placeholder={isManager ? "Not giriniz..." : "Sadece yönetici not girebilir"}
                      />
                    </td>
                    <td className="px-4 py-3 border border-gray-600">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={item.puanlama}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 10)) {
                            handleCriteriaChange(index, "puanlama", value);
                          }
                        }}
                        disabled={!isManager}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
                        placeholder="0-10"
                      />
                    </td>
                  </tr>
                ))}
                {/* Toplam Satırı */}
                <tr className="bg-gray-700/70 font-semibold">
                  <td className="px-4 py-3 text-white border border-gray-600">
                    Toplam
                  </td>
                  <td className="px-4 py-3 border border-gray-600"></td>
                  <td className="px-4 py-3 text-white text-center border border-gray-600">
                    {totalScore}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Yönetici Görüşü ve Adı Soyadı */}
        <div className="border-t border-gray-700 pt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Yöneticinin Görüşü
            </label>
            <textarea
              value={yoneticiGorusu}
              onChange={(e) => setYoneticiGorusu(e.target.value)}
              rows={5}
              disabled={!isManager}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed resize-none"
              placeholder={isManager ? "Yönetici görüşünü buraya yazınız..." : "Sadece yönetici görüş girebilir"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Yöneticinin Adı Soyadı
            </label>
            <input
              type="text"
              value={yoneticiAdiSoyadi}
              onChange={(e) => setYoneticiAdiSoyadi(e.target.value)}
              disabled={!isManager}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder={isManager ? "Yönetici adı soyadı" : "Sadece yönetici girebilir"}
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
            disabled={!isManager}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
