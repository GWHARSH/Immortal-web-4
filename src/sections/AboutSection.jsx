import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import DiscordStatus from '../components/DiscordStatus';

export default function AboutSection() {
  const { settings } = useSettings();
  const [style, setStyle] = useState(1);
  const aboutText = settings?.about_text || "";
  const discordId = settings?.discord_id || "";

  useEffect(() => {
    const saved = localStorage.getItem('about_design_style');
    if (saved) {
      setStyle(parseInt(saved, 10));
    }
  }, []);

  const designs = [
    { id: 1, name: 'Bento Grid', className: '' },
    { id: 2, name: 'Spotlight', className: 'about--spotlight' },
    { id: 3, name: 'Timeline', className: 'about--timeline' },
    { id: 4, name: 'Magazine', className: 'about--magazine' },
    { id: 5, name: 'Split Screen', className: 'about--split' },
  ];

  const activeDesign = designs.find(d => d.id === style) || designs[0];

  return (
    <section className={`about ${activeDesign.className}`} id="about">
      <div className="about__inner">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '56px' }}>
          <motion.div
            className="about__header"
            style={{ textAlign: 'center', marginBottom: '24px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label">Identity</span>
            <h2 className="section-title" style={{ margin: 0 }}>About <span className="text-accent">Me</span></h2>
          </motion.div>

          {/* Interactive Layout Switcher */}
          <motion.div
            className="sec-switcher"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ margin: 0 }}
          >
            <span className="sec-switcher__label">Layout:</span>
            {designs.map((item) => (
              <button
                key={item.id}
                className={`sec-switcher__btn ${style === item.id ? 'sec-switcher__btn--active' : ''}`}
                onClick={() => {
                  setStyle(item.id);
                  localStorage.setItem('about_design_style', String(item.id));
                }}
              >
                <span className="sec-switcher__num">0{item.id}</span>
                <span className="sec-switcher__name">{item.name}</span>
              </button>
            ))}
          </motion.div>
        </div>

        <div className="about__bento">
          {/* Bio Card */}
          <motion.div
            className="bento-card bento-card--bio"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="about__text-block">
              {aboutText ? aboutText.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              )) : <p>Loading biography...</p>}
            </div>
          </motion.div>

          {/* Discord Card */}
          <motion.div
            className="bento-card bento-card--discord"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <DiscordStatus discordId={discordId} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
