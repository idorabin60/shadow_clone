import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', service: '', message: '' });
            setIsSubmitting(false);
            
            // Reset status after 3 seconds
            setTimeout(() => setSubmitStatus('idle'), 3000);
        }, 1000);
    };

    const contactInfo = [
        {
            icon: Phone,
            title: 'טלפון',
            value: '03-123-4567',
            href: 'tel:+972123456789',
        },
        {
            icon: Mail,
            title: 'דוא"ל',
            value: 'info@rozengarage.co.il',
            href: 'mailto:info@rozengarage.co.il',
        },
        {
            icon: MapPin,
            title: 'כתובת',
            value: 'רחוב הטכנולוגיה 10, תל אביב',
            href: '#',
        },
        {
            icon: Clock,
            title: 'שעות פתיחה',
            value: 'ראשון-חמישי: 08:00-18:00',
            href: '#',
        },
    ];

    const services = [
        'בחר שירות',
        'תיקון כללי',
        'מערכות חשמל',
        'בדיקות בטיחות',
        'כיוונון מנוע',
        'החלפת נוזלים',
        'תחזוקה תקופתית',
    ];

    return (
        <section id="contact" className="section-padding bg-white">
            <div className="container-max">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
                        צור קשר איתנו
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        יש לך שאלה? אנחנו כאן כדי לעזור
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-bold text-neutral-900 mb-8">
                            פרטי התקשרות
                        </h3>

                        <div className="space-y-6 mb-12">
                            {contactInfo.map((info, idx) => {
                                const Icon = info.icon;
                                return (
                                    <motion.a
                                        key={idx}
                                        href={info.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center flex-shrink-0">
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-neutral-900 mb-1">
                                                {info.title}
                                            </h4>
                                            <p className="text-neutral-600">
                                                {info.value}
                                            </p>
                                        </div>
                                    </motion.a>
                                );
                            })}
                        </div>

                        {/* Map Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="w-full h-64 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-cyan/10 flex items-center justify-center border border-neutral-200"
                        >
                            <div className="text-center">
                                <div className="text-5xl mb-2">📍</div>
                                <p className="text-neutral-600 font-semibold">מוסך רוזן PRO</p>
                                <p className="text-sm text-neutral-500">תל אביב</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2">
                                    שם מלא
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-brand-blue focus:outline-none transition-colors duration-300"
                                    placeholder="הכנס את שמך"
                                />
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 mb-2">
                                    דוא&quot;ל
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-brand-blue focus:outline-none transition-colors duration-300"
                                    placeholder="הכנס את דוא&quot;לך"
                                />
                            </motion.div>

                            {/* Phone */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <label htmlFor="phone" className="block text-sm font-semibold text-neutral-900 mb-2">
                                    טלפון
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-brand-blue focus:outline-none transition-colors duration-300"
                                    placeholder="הכנס את מספר הטלפון שלך"
                                />
                            </motion.div>

                            {/* Service */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <label htmlFor="service" className="block text-sm font-semibold text-neutral-900 mb-2">
                                    בחר שירות
                                </label>
                                <select
                                    id="service"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-brand-blue focus:outline-none transition-colors duration-300"
                                >
                                    {services.map((service, idx) => (
                                        <option key={idx} value={service}>
                                            {service}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>

                            {/* Message */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <label htmlFor="message" className="block text-sm font-semibold text-neutral-900 mb-2">
                                    הודעה
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-brand-blue focus:outline-none transition-colors duration-300 resize-none"
                                    placeholder="ספר לנו על הבעיה שלך"
                                ></textarea>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                viewport={{ once: true }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                                {isSubmitting ? 'שליחה...' : 'שלח הודעה'}
                            </motion.button>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg bg-green-100 text-green-800 text-center font-semibold"
                                >
                                    ✓ ההודעה נשלחה בהצלחה! נחזור אליך בקרוב.
                                </motion.div>
                            )}

                            {submitStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg bg-red-100 text-red-800 text-center font-semibold"
                                >
                                    ✗ אירעה שגיאה. אנא נסה שוב.
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
