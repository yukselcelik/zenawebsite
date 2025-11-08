'use client';

import { useState, useEffect } from 'react';
import ApiService from '../../../../lib/api';

export default function InternshipApplications() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [pagination.pageNumber]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getAllInternshipApplications(pagination.pageNumber, pagination.pageSize);
      setApplications(data.data?.items || []);
      setPagination({
        pageNumber: data.data?.pageNumber || 1,
        pageSize: data.data?.pageSize || 10,
        totalCount: data.data?.totalCount || 0,
        totalPages: data.data?.totalPages || 0
      });
    } catch (error) {
      console.error('Error fetching internship applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Staj Başvuruları</h2>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz staj başvurusu bulunmamaktadır.</p>
          ) : (
            applications.map((application) => (
              <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {application.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">E-posta:</span> {application.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Telefon:</span> {application.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Okul:</span> {application.school}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Bölüm:</span> {application.department}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Sınıf:</span> {application.year}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Mesaj:</span> {application.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Başvuru Tarihi: {new Date(application.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Toplam {pagination.totalCount} kayıttan {((pagination.pageNumber - 1) * pagination.pageSize) + 1} ile {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} arası gösteriliyor
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination({ ...pagination, pageNumber: pagination.pageNumber - 1 })}
                disabled={pagination.pageNumber === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Önceki
              </button>
              <button
                onClick={() => setPagination({ ...pagination, pageNumber: pagination.pageNumber + 1 })}
                disabled={pagination.pageNumber >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

