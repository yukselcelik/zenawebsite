"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Navbar({ userData, onLogout, isManager }) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const getTitle = () => {
    if (pathname?.includes("/dashboard")) return "Dashboard";
    if (pathname?.includes("/profilim")) return "Profilim";
    if (pathname?.includes("/izin-talepleri/yeni")) return "Yeni İzin Talebi";
    if (pathname?.includes("/izin-talepleri")) return "İzin Talepleri";
    if (pathname?.includes("/hak-ve-alacaklar")) return "Hak ve Alacaklar";
    if (pathname?.includes("/taleplerim")) return "Taleplerim";
    if (pathname?.includes("/talep-et")) return "Talep Et";
    if (pathname?.includes("/masraf-talep-et")) return "Masraf Talep Et";
    if (pathname?.includes("/masraf-taleplerim")) return "Masraf Taleplerim";
    if (pathname?.includes("/talepleri-incele")) return "Talepleri İncele";
    if (pathname?.includes("/masraf-talepleri")) return "Masraf Talepleri";
    if (pathname?.includes("/odeme-takip")) return "Ödeme Takip";
    if (
      pathname?.includes("/personeller") &&
      pathname?.match(/\/personeller\/\d+/)
    )
      return "Çalışan Detayı";
    if (pathname?.includes("/personeller")) return "Çalışanlar";
    if (pathname?.includes("/is-basvurulari")) return "İş/Staj Başvuruları";
    if (pathname?.includes("/arsiv")) return "Arşiv Yönetimi";
    return "Panel";
  };

  const roleLabel = isManager ? "Yönetici" : "Çalışan";

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const onPointerDown = (e) => {
      const root = userMenuRef.current;
      if (!root) return;
      if (root.contains(e.target)) return;
      setIsUserMenuOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isUserMenuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60"
    >
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-3">
          <h1 className="truncate text-lg font-semibold text-white">
            {getTitle()}
          </h1>
          <span
            className={`hidden sm:inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
              isManager
                ? "border-orange-700/60 bg-orange-900/20 text-orange-200"
                : "border-blue-700/60 bg-blue-900/20 text-blue-200"
            }`}
          >
            {roleLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
            title="Ana Sayfa"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9.5l9-7 9 7V20a2 2 0 01-2 2h-4a1 1 0 01-1-1v-6H10v6a1 1 0 01-1 1H5a2 2 0 01-2-2V9.5z"
              />
            </svg>
            <span className="hidden sm:inline">Ana Sayfa</span>
          </Link>

          {/* User menu (kurumsal pattern) */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              className="inline-flex h-10 items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-3 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {userData?.photoPath ? (
                <img
                  src={userData.photoPath}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-600"
                  alt="Profil"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center ring-1 ring-gray-600">
                  <span className="text-white text-xs font-semibold">
                    {userData?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}

              <div className="hidden md:block text-left leading-tight">
                <p className="text-sm font-semibold text-white truncate max-w-[180px]">
                  {userData?.name} {userData?.surname}
                </p>
              </div>

              <svg
                className="h-4 w-4 text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-xl"
              >
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-sm font-semibold text-white">
                    {userData?.name} {userData?.surname}
                  </p>
                  <p className="text-xs text-gray-400">{userData?.email}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        isManager
                          ? "border-orange-700/60 bg-orange-900/20 text-orange-200"
                          : "border-blue-700/60 bg-blue-900/20 text-blue-200"
                      }`}
                    >
                      {roleLabel}
                    </span>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    href="/panel/profilim"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 11a4 4 0 100-8 4 4 0 000 8z"
                      />
                    </svg>
                    Profilim
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-200 hover:bg-red-900/20 transition-colors cursor-pointer"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                      />
                    </svg>
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
