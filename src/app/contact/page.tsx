"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
    type: 'demo' as 'demo' | 'pilot' | 'general'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Thank you! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        organization: '',
        message: '',
        type: 'demo'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="pt-8 pb-20 md:pt-5 md:pb-10"
        style={{ background: "radial-gradient(ellipse 200% 100% at bottom left, #183EC2, #EAEEFE 100%)" }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center pt-20 pb-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight">
              Ready to make your funding proof-based? Let's talk about how Veritrax can help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-10 border border-[#F1F1F1] shadow-[0_7px_14px_#EAEAEA]"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-black/80 mb-2">
                    I'm interested in
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#F1F1F1] rounded-lg focus:ring-2 focus:ring-[#183EC2] focus:border-transparent outline-none transition"
                  >
                    <option value="demo">Booking a demo</option>
                    <option value="pilot">Joining as a pilot partner</option>
                    <option value="general">General inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black/80 mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#F1F1F1] rounded-lg focus:ring-2 focus:ring-[#183EC2] focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black/80 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#F1F1F1] rounded-lg focus:ring-2 focus:ring-[#183EC2] focus:border-transparent outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-black/80 mb-2">
                    Organization (Optional)
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#F1F1F1] rounded-lg focus:ring-2 focus:ring-[#183EC2] focus:border-transparent outline-none transition"
                    placeholder="Your Organization"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black/80 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-[#F1F1F1] rounded-lg focus:ring-2 focus:ring-[#183EC2] focus:border-transparent outline-none transition resize-none"
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Direct Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 text-center"
            >
              <h3 className="text-2xl font-bold text-black/80 mb-4">Or reach out directly</h3>
              <div className="space-y-3">
                <p className="text-[#010D3E]/60">
                  <a href="mailto:vighnesh0291@gmail.com" className="text-[#183EC2] hover:underline font-medium">
                    vighnesh0291@gmail.com
                  </a>
                </p>
                <p className="text-sm text-[#010D3E]/60">
                  Vighnesh Bhati, Arsh Maheshwari, Dhruv Parihar
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
