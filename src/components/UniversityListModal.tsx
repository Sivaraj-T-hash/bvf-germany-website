import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, GraduationCap } from 'lucide-react';
import { getSiteSettings, type SiteSettings } from '@/lib/siteContentStore';
import { buildWhatsappHref } from '@/lib/whatsapp';

export default function UniversityListModal() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let active = true;
    const init = async () => {
      const nextSettings = await getSiteSettings();
      if (active) {
        setSettings(nextSettings);
      }
    };
    void init();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('universityModalSeen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('universityModalSeen', 'true');
    setShow(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDismiss();
    
    // Construct WhatsApp Redirect URL
    const message = [
      'Hi BVF Germany! I want to know more about studying in Germany',
      '',
      "I'd like to get the FREE Germany University List.",
      `Name: ${name}`,
      `Email: ${email}`,
      `WhatsApp Number: ${whatsapp}`,
    ].join('\n');
    const waUrl = buildWhatsappHref(settings, message);
    
    window.open(waUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-2xl"
          >
            <div className="absolute right-4 top-4 z-10">
              <button
                type="button"
                onClick={handleDismiss}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-black/60 transition-colors hover:bg-black/20 hover:text-black"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-primary to-primary/80 px-8 py-10 text-center text-white relative overflow-hidden">
               <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />
               <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-black/10 blur-2xl pointer-events-none" />
               
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/20 shadow-inner backdrop-blur-md">
                 <GraduationCap className="h-8 w-8 text-white relative z-10" />
               </div>
               
               <h2 className="text-2xl font-black md:text-3xl tracking-tight leading-tight relative z-10 text-white">
                 Get FREE Germany University List
               </h2>
               <p className="mt-3 text-[14px] md:text-[15px] font-medium text-white/90 relative z-10 uppercase tracking-widest leading-relaxed">
                 30+ Public Universities <span className="opacity-50 mx-1">|</span> Tuition-Free <span className="opacity-50 mx-1">|</span> 2025 Intake
               </p>
            </div>

            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="modal-name" className="mb-1.5 block text-[13px] font-bold text-foreground">Name</label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-border/80 bg-muted/30 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="modal-whatsapp" className="mb-1.5 block text-[13px] font-bold text-foreground">WhatsApp Number</label>
                  <input
                    id="modal-whatsapp"
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full rounded-2xl border border-border/80 bg-muted/30 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="+91 ...."
                  />
                </div>
                <div>
                  <label htmlFor="modal-email" className="mb-1.5 block text-[13px] font-bold text-foreground">Email</label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-border/80 bg-muted/30 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-[15px] font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#20bd5a] hover:shadow-[#25D366]/30"
                  >
                    Send Me the List — FREE
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                <p className="text-center text-[11px] text-muted-foreground mt-4 font-medium">We respect your privacy. No spam.</p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
