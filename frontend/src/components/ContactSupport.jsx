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
  const mailtoUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <>
      {/* ── Floating Action Trigger (Bottom-Right) ── */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-sm group"
          title="Contact Support"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
          </span>
          <span className="text-lg">💬</span>
          <span>Contact Us</span>
        </button>
      </div>

      {/* ── Modal Dialog ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                  🤝
                </div>
                <div>
                  <h3 className="text-xl font-bold">Contact Support</h3>
                  <p className="text-blue-100 text-xs">We are here to help you</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
                If your school is not listed or you encounter any issue, please feel free to contact us:
              </p>

              {/* Contact Options */}
              <div className="space-y-3">
                {/* Phone Call */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-lg">
                      📞
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
                      {copiedType === 'phone' ? '✓' : '📋'}
                    </button>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 hover:border-green-400 hover:bg-green-50/30 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-lg">
                      💬
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
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                      ✉️
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
                      {copiedType === 'email' ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
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
