// Setup script: creates settings doc + ensures admin user role
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUcuUSkSQJy7tTpD7kn_n8HIY40nPRcbU",
  authDomain: "hixx-8e032.firebaseapp.com",
  projectId: "hixx-8e032",
  storageBucket: "hixx-8e032.firebasestorage.app",
  messagingSenderId: "439140631415",
  appId: "1:439140631415:web:44d8305bb0412529171772",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setup() {
  console.log('[SETUP] Signing in as admin...');
  
  try {
    const cred = await signInWithEmailAndPassword(auth, 'hixx@playz.com', 'hixx@2026');
    const uid = cred.user.uid;
    console.log('[SETUP] ✓ Signed in — UID:', uid);

    // Set admin role
    await setDoc(doc(db, 'users', uid), {
      email: 'hixx@playz.com',
      role: 'admin',
      created_at: new Date().toISOString(),
    }, { merge: true });
    console.log('[SETUP] ✓ Admin role set in users/' + uid);

    // Create settings document
    await setDoc(doc(db, 'settings', 'main'), {
      site_name: 'HIx playz',
      hero_title: 'HIx playz',
      hero_description: 'Official portfolio of HIx playz, the legendary immortal from demi gods. Explore uploads, custom gaming packages, and media from the demigods clan.',
      hero_eyebrow: 'Immortal from Demi Gods - Demigods Clan Leader',
      about_text: 'HIx playz is a prominent gaming portfolio and custom asset creator representing the legendary immortal demi gods / demigods clan.',
      instagram: '[]',
      twitter: '[]',
      youtube: '[]',
      github: '[]',
      discord: '[]',
      discord_id: '',
      discord_bio: '',
      bg_music_url: '/bg-music.mp3',
      seo_logo_url: '',
      announcement_text: '',
      announcement_active: false,
    }, { merge: true });
    console.log('[SETUP] ✓ Settings document created/updated');

    console.log('\n══════════════════════════════════════');
    console.log('  SETUP COMPLETE!');
    console.log('  Login: hixx@playz.com / hixx@2026');
    console.log('══════════════════════════════════════\n');
    
    setTimeout(() => process.exit(0), 1000);
  } catch (err) {
    console.error('[SETUP] Error:', err.message);
    setTimeout(() => process.exit(1), 1000);
  }
}

setup();
