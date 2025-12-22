// Hakkımızda sayfası - Zena Enerji hakkında detaylı bilgiler
// Bu sayfa şirketin misyonu, vizyonu, değerleri ve ekibi hakkında bilgi içerir

import Header from '../components/Header'; // Header bileşenini import ediyoruz
import Footer from '../components/Footer'; // Footer bileşenini import ediyoruz

export default function Hakkimizda() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header bileşeni */}
      <Header />
      
      {/* Hero Section - Header arkasında küçük banner */}
      <section className="relative h-[300px] overflow-hidden -mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80)` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-orange-500">
              Hakkımızda
            </h1>
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Zena Enerji olarak, sürdürülebilir bir gelecek için yenilenebilir enerji çözümleri sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Şirket tanıtım metni */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Sol taraf - Metin */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Zena Enerji ile Tam Hizmet
              </h2>
              <div className="space-y-3 text-sm font-medium text-gray-600 leading-normal">
                <p>
                  Zena Enerji, sürdürülebilir bir gelecek için yenilenebilir enerji çözümlerinin geliştiricisi ve uygulayıcısıdır. Solar Güç Santrali (GES) projeleri için proje geliştirme, saha seçimi, mühendislik, kurulum ve devreye alma dahil olmak üzere uçtan uca hizmetler sunmaktadır.
                </p>
                <p>
                  Profesyonel ekip tarafından yürütülen bu hizmetler, 2015 yılında yenilenebilir enerji alanında 15 yıllık deneyime sahip ortaklar tarafından kurulmuş Türk şirketi Zena Enerji tarafından gerçekleştirilmektedir.
                </p>
                <p>
                  Yapay Zeka (AI), Gelişmiş Analitik ve Büyük Veri kullanarak Solar PV santrallerinin dijitalleştirilmesini artırarak, proje geliştirme, imar uygulamaları, saha kurulumları ve güneş enerjisi endüstrisinin genel ilerlemesine katkıda bulunmaktadır.
                </p>
                <p>
                  Gelişmiş teknoloji altyapısı sayesinde sadece enerji üretimini değil, aynı zamanda verimliliği ve çevresel etkileri de ölçebilir ve raporlayabiliriz. AI destekli analizler, İHA'lar ile gerçekleştirilen termal incelemeler ve çeşitli dijital çözümler, müşterilerimiz için hızlı, güvenilir ve ekonomik enerji dönüşümü sağlamaktadır.
                </p>
                <p>
                  Megavat ölçeğindeki projelerin başarıyla tamamlanmasından gurur duyuyoruz. Her yatırım, binlerce ağacın kurtarılmasına ve karbon emisyonlarının önemli ölçüde azaltılmasına katkıda bulunmaktadır.
                </p>
              </div>
            </div>

            {/* Sağ taraf - Görsel */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img 
                  src="/1111.jfif" 
                  alt="Zena Enerji ile Tam Hizmet" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misyon ve Vizyon Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Misyon */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Misyonumuz
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed text-center">
                Yasa, yönetmelik ve ilgili mevzuatlara uygun olarak, şirket değerleri doğrultusunda, bilginin güç olduğu bilinciyle, teknolojik gelişmeleri takip etmenin başarının ön koşullarından olduğu anlayışıyla çalışarak yatırımlardan daha fazla katma değer elde etmeyi amaçlarız.
              </p>
            </div>
          </div>

          {/* Vizyon */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Vizyonumuz
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed text-center">
                2015 yılından itibaren yurt içinde tamamladığımız projelerle ve yenilikçi yönetim anlayışımızla ulusal alanda akla gelen ilk marka olmak ve aynı zamanda uluslararası alanda da güçlü, saygın ve sürdürülebilir bir marka kimliği kazanmaktır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Değerlerimiz Bölümü */}
      <section className="py-20 relative overflow-hidden">
        {/* Arka plan görseli */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/chat.png)` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Güneşten İlham Alan Değerlerimiz
            </h2>
            <p className="text-xs text-white/90 max-w-3xl mx-auto">
              Türkiye'de güneş enerjisi santrallerinin kurulması, ülkemizin güneş ışınım potansiyelinin değerlendirilmesi açısından büyük önem taşımaktadır. Zena Enerji'nin ana hedefi, yenilenebilir enerji sistemleri ile Türkiye'nin enerji bağımsızlığını sağlamaktır.
            </p>
          </div>

          {/* Değerler listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Değer 1 */}
            <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Güneş Enerjisi Potansiyeli</h3>
                <p className="text-xs text-gray-600">
                  Türkiye'nin güçlü güneş ışınımı ve güneş enerjisi santrallerinin önemi, sürdürülebilir enerji geleceğimizin temel taşıdır.
                </p>
              </div>
            </div>

            {/* Değer 2 */}
            <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Enerji Bağımsızlığı</h3>
                <p className="text-xs text-gray-600">
                  Türkiye'nin enerji bağımsızlığına katkıda bulunmak, ticari hedefimizin temel amacıdır.
                </p>
              </div>
            </div>

            {/* Değer 3 */}
            <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Yenilenebilir Enerji Odaklılık</h3>
                <p className="text-xs text-gray-600">
                  Yenilenebilir enerji sistemlerinin kurulması, enerji bağımsızlığını sağlamanın en etkili yoludur.
                </p>
              </div>
            </div>

            {/* Değer 4 */}
            <div className="flex space-x-2 bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Uzman Kadro ve Yenilikçilik</h3>
                <p className="text-xs text-gray-600">
                  Nitelikli Türk mühendisleri ve uzman kadromuzla bilimsel ve teknik gelişmelerden yararlanarak orijinal ve yenilikçi projeler üretmeye devam ediyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ekibimiz Bölümü */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ekibimiz
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Sol taraf - Görsel */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Our team" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Sağ taraf - Metin ve buton */}
            <div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Enerji sektöründe birlikte çalışmaya, öğrenmeye ve gelişime açık adaylarla tanışmaktan büyük bir memnuniyet duyarız. Ekip ruhuna değer veren, sorumluluk bilinci yüksek ve geleceğe katkı sunmayı hedefleyen çalışma arkadaşlarının başvurularını bekliyoruz.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-300">
                Bize Katılın
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer bileşeni */}
      <Footer />
    </div>
  );
}
