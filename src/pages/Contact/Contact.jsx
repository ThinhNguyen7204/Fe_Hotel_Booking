import React from "react";
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaGlobe, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter 
} from "react-icons/fa";

const Contact = () => {
  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-black py-28 min-h-screen flex items-center">
      <div className="container mx-auto px-6 lg:px-0">
        <div className="text-center mb-16">
          <span className="font-tertiary uppercase text-xs text-accent tracking-[6px] font-semibold">Get In Touch</span>
          <h3 className="font-primary text-4xl lg:text-5xl text-white mt-2 relative inline-block pb-4">
            Contact Us
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-accent/60"></span>
          </h3>
          <p className="text-center text-slate-400 font-secondary max-w-md mx-auto mt-6 text-sm leading-relaxed">
            We're here to help! If you have any questions or need assistance, feel
            free to reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl">
            <h4 className="font-primary text-2xl text-white mb-6 font-semibold">Get in Touch</h4>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div>
                <label className="block text-slate-300 font-tertiary text-xs uppercase tracking-wider font-bold mb-1.5">Name</label>
                <input
                  type="text"
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-sm"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-tertiary text-xs uppercase tracking-wider font-bold mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-sm"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-tertiary text-xs uppercase tracking-wider font-bold mb-1.5">Message</label>
                <textarea
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-sm"
                  rows="4"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-accent text-white font-tertiary uppercase text-xs tracking-[2px] rounded-xl font-semibold hover:bg-accent-hover transition-all duration-300 active:scale-98 shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <h4 className="font-primary text-2xl text-white mb-6 font-semibold">Contact Information</h4>
              
              <div className="space-y-6 text-slate-300">
                <div className="flex items-start gap-x-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                    <FaMapMarkerAlt className="text-base" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-450 font-tertiary font-bold">Address</div>
                    <p className="text-sm font-medium mt-0.5 text-slate-200">123 Hotel St, City, Country</p>
                  </div>
                </div>

                <div className="flex items-start gap-x-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                    <FaPhoneAlt className="text-base" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-455 font-tertiary font-bold">Phone</div>
                    <p className="text-sm font-medium mt-0.5 text-slate-200">(123) 456-7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-x-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                    <FaEnvelope className="text-base" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-460 font-tertiary font-bold">Email</div>
                    <p className="text-sm font-medium mt-0.5 text-slate-200">info@yourhotel.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-x-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                    <FaGlobe className="text-base" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-465 font-tertiary font-bold">Website</div>
                    <p className="text-sm font-medium mt-0.5 text-slate-200">www.yourhotel.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-tertiary font-bold mb-3">
                Follow us on social media
              </p>
              <div className="flex gap-x-3">
                <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-accent hover:text-white transition-all duration-300">
                  <FaFacebook className="text-sm" />
                </a>
                <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-accent hover:text-white transition-all duration-300">
                  <FaInstagram className="text-sm" />
                </a>
                <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-accent hover:text-white transition-all duration-300">
                  <FaTwitter className="text-sm" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
