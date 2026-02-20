import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function Contact() {
    return (
        <section className="min-h-[80vh] py-24 px-6 relative flex items-center justify-center bg-[#020202] overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] -translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] -translate-y-1/2" />

            <div className="w-full max-w-3xl z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass p-10 md:p-14 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold mb-4">Let's Connect</h2>
                        <p className="text-gray-400">Have a project in mind or just want to chat?</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400 ml-1">Name</label>
                                <input
                                    type="text"
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-white"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400 ml-1">Email</label>
                                <input
                                    type="email"
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-white"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400 ml-1">Message</label>
                            <textarea
                                rows="5"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-white resize-none"
                                placeholder="What's on your mind?"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-shadow"
                        >
                            Send Message <Send className="w-4 h-4" />
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} Siluna Nusal. All rights reserved.
            </div>
        </section>
    );
}
