export default function PaymentPartners() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Payment Partners
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We partner with trusted payment providers to ensure secure and convenient transactions
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-12">
          <div className="flex items-center justify-center gap-16 flex-wrap">
            <div className="group">
              <img 
                src="/BKash-Logo.wine.svg" 
                alt="bKash - Mobile Banking Partner" 
                className="h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 transform hover:scale-110"
              />
              <p className="text-center text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition">
                Mobile Banking
              </p>
            </div>

            <div className="group">
              <img 
                src="/Nagad-logo.svg" 
                alt="Nagad - Digital Payment Partner" 
                className="h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 transform hover:scale-110"
              />
              <p className="text-center text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition">
                Digital Wallet
              </p>
            </div>

            <div className="group">
              <img 
                src="/512px-Visa_Inc._logo.svg.png" 
                alt="Visa - Card Payment Partner" 
                className="h-14 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 transform hover:scale-110"
              />
              <p className="text-center text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition">
                Credit/Debit Cards
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              🔒 Secure payments • 256-bit SSL encryption • PCI DSS compliant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


