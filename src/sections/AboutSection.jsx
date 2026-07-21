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

  return (
    <section className="about about--spotlight" id="about">
      <div className="about__inner">
        <motion.div 
          className="about__content-centered"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="about__identity-block">
            <motion.span 
              className="section-label"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              The Identity
            </motion.span>
            <motion.h2 
              className="about__title-large"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              About <span className="text-accent">Immortal</span>
            </motion.h2>
          </div>

          <div className="about__text-block">
            {aboutText ? aboutText.split('\n').map((paragraph, index) => (
              <motion.p 
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                {paragraph}
              </motion.p>
            )) : <p>The legend of Immortal continues to unfold...</p>}
          </div>

          <motion.div 
            className="about__discord-wrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <DiscordStatus discordId={discordId} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
