import { useState } from 'react';

const CONTACT_INFO = {
  phone: '0775768610',
  formattedPhone: '+94 77 576 8610',
  whatsapp: '94775768610',
  email: 'pearlwaves2004@gmail.com',
};

function ContactSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedType, setCopiedType] = useState(null);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    'Hi, I would like to report an issue or request adding a school on TransferLK.'
  );

  const emailSubject = 'TransferLK Support - School Request or Issue';
  const emailBody = `Hi TransferLK Team,

I would like to report an issue or request adding a school:

• School Name: 
• Province: 
• District: 
• Details: 

Thank you!`;

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_INFO.email}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <>
      {/* ── Floating Action Trigger (Bottom-Right) ── */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-xs sm:text-sm group"
          title="Contact Support"
        >
          <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-400"></span>
          </span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Contact Us</span>
        </button>
      </div>

      {/* ── Modal Dialog ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 animate-fade"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-4 sm:p-6 relative shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Contact Support</h3>
                  <p className="text-blue-100 text-xs">We are here to help you</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-blue-50/70 p-3 sm:p-3.5 rounded-2xl border border-blue-100">
                If your school is not listed or you encounter any issue, please feel free to contact us:
              </p>

              {/* Contact Options */}
              <div className="space-y-3">
                {/* Phone Call */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Phone</p>
                      <a
                        href={`tel:${CONTACT_INFO.phone}`}
                        className="text-sm font-bold text-gray-800 hover:text-blue-600 transition"
                      >
                        {CONTACT_INFO.formattedPhone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-xl text-xs font-semibold hover:bg-green-700 transition"
                    >
                      Call
                    </a>
                    <button
                      onClick={() => handleCopy(CONTACT_INFO.phone, 'phone')}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg text-xs"
                      title="Copy phone"
                    >
                      {copiedType === 'phone' ? '✓' : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-green-400 hover:bg-green-50/30 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-10.416c-4.408 0-7.99 3.582-7.99 7.99 0 1.408.366 2.73 1.006 3.879l-1.07 3.909 3.997-1.049c1.106.604 2.373.951 3.723.951 4.408 0 7.99-3.582 7.99-7.99 0-4.408-3.582-7.89-7.656-7.69z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">WhatsApp</p>
                      <p className="text-sm font-bold text-gray-800">Chat with us</p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-green-500 text-white rounded-xl text-xs font-semibold hover:bg-green-600 transition flex items-center gap-1"
                  >
                    Chat →
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Email</p>
                      <a
                        href={gmailComposeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-gray-800 hover:text-blue-600 transition truncate max-w-[160px] sm:max-w-none block"
                        title="Click to compose email"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
                      title="Send email"
                    >
                      Email
                    </a>
                    <button
                      onClick={() => handleCopy(CONTACT_INFO.email, 'email')}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg text-xs"
                      title="Copy email address"
                    >
                      {copiedType === 'email' ? '✓' : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ContactSupport;
