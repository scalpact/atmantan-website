// All site content lives here. Edit, then run:  node build/build.js
const SITE = {
  url: 'https://atmantanholistic.com',            // change to the real domain before going live
  domainLive: false,                               // set true once the site is live, so WhatsApp messages include the session link
  name: 'Atmantan Holistic',
  tagline: 'Healing & Tarot Centre',
  centreName: 'Atmantan Reiki Healing & Meditation Centre',
  person: 'Dr. Sheetal Vala',
  personShort: 'Sheetal',
  years: '10+',
  // Optional. Add a 10-digit mobile number (e.g. '9876543210') to show Call and WhatsApp buttons everywhere.
  phone: '9712928125',
  email: '',
  address: ['102, Sachi Arcade', 'Near Prajapati Petrol Pump, Prajapati Ashram', 'Navsari, Gujarat 396445'],
  mapQuery: 'Sachi Arcade, Prajapati Ashram, Navsari 396445',
  instagram: 'https://www.instagram.com/healwithsheetal/',
  igHandle: '@healwithsheetal',
  igDM: 'https://ig.me/m/healwithsheetal',
  facebook: 'https://www.facebook.com/sheetalv1',
  exly: 'https://atmantanholistic.exlyapp.com/',
  waCommunity: 'https://tinyurl.com/4nkdt9p7'
};

const SERVICES = [
  { id: 'tarot', ask: 'My question / area for the reading (love, career, family, money, a decision):', modes: 'Phone call / Video call / Chat', name: 'Tarot Reading', img: 'tarot-table', icon: 'ph:cards-fill',
    short: 'Clear, honest guidance on love, career, family and the decisions you are stuck on.',
    long: 'A one-to-one reading for the question that is weighing on you. I lay out the cards, explain what they show and how they connect, and we talk through what you can do next. You leave with clarity, not fear.',
    good: ['Relationship confusion', 'Career and money decisions', 'Feeling stuck or lost'], mode: 'Phone, chat or video' },
  { id: 'reiki', ask: 'What I am going through (stress, sleep, pain, emotional heaviness, other):', modes: 'At the Navsari centre / Distance healing', name: 'Reiki Healing', img: 'reiki', icon: 'solar:hand-stars-bold-duotone',
    short: 'Deep, gentle energy healing for stress, tiredness and emotional heaviness.',
    long: 'As a Reiki Grandmaster I channel universal life-force energy to wherever your body and mind need it. Sessions are calm and restful. Most people feel lighter and sleep better after the first one.',
    good: ['Stress and anxiety', 'Poor sleep', 'Grief and emotional pain'], mode: 'At the centre or distance healing' },
  { id: 'pranic', ask: 'The concern I want to work on (physical, emotional, a habit, other):', modes: 'At the Navsari centre / Distance healing', name: 'Pranic Healing', img: 'pranic', icon: 'solar:wind-bold-duotone',
    short: 'No-touch healing that cleans and recharges specific areas of your energy body.',
    long: 'I scan your aura, clear congested energy and fill depleted areas with fresh prana. Pranic psychotherapy is used for stubborn emotional patterns such as anger, fear, phobias and addictive habits.',
    good: ['Specific physical concerns', 'Anger, fear and habits', 'Clearing heavy energy'], mode: 'At the centre or distance healing' },
  { id: 'chakra', ask: 'What I have been feeling lately (low energy, overthinking, low confidence, other):', modes: 'At the Navsari centre / Distance healing', name: 'Chakra Balancing', img: 'chakra', icon: 'solar:stars-bold-duotone',
    short: 'Clear and realign all seven energy centres so you feel steady and whole again.',
    long: 'Using Reiki, pranic healing and crystals together, I find which chakras are blocked or overactive and bring them back into balance. You also get a simple daily practice to keep the balance at home.',
    good: ['Feeling "off" for no clear reason', 'Low confidence', 'Overthinking'], mode: 'At the centre or distance healing' },
  { id: 'manifestation', ask: 'The goal I want to manifest (money, career, love, health, other):', modes: 'Phone call / Video call', name: 'Manifestation Coaching', img: 'manifest', icon: 'solar:magic-stick-3-bold-duotone',
    short: 'Find the belief that is holding you back and build a daily routine that moves you forward.',
    long: 'We get clear on what you want, use tarot to show what is blocking it, clear that block with healing, and set you up with affirmations, mantras and small daily actions that suit your life.',
    good: ['Money and career goals', 'Love and relationships', 'Breaking old patterns'], mode: 'Phone or video' },
  { id: 'support', ask: 'Who the healing is for and their condition (I am continuing medical treatment):', modes: 'At the Navsari centre / Distance healing', name: 'Chronic Illness & Cancer Support', img: 'support', icon: 'solar:heart-pulse-bold-duotone',
    short: 'Calm, caring energy healing alongside medical treatment, for patients and caregivers.',
    long: 'Gentle Reiki and pranic healing to ease fear, stress and exhaustion during long illness or cancer treatment. This is complementary care. It works alongside your doctor’s treatment and never replaces it.',
    good: ['Anxiety around treatment', 'Rest and sleep', 'Support for caregivers'], mode: 'At the centre or distance healing' }
];

const CERTS = [
  ['Reiki Grandmaster', 'Shree Sai Yog & Reiki Healing Centre', '2025'],
  ['Crystal Reiki', 'Shree Sai Yog & Reiki Healing Centre', '2025'],
  ['Certified Tarot Professional', 'MySoul School', '2024'],
  ['Advanced Pranic Healing', 'World Pranic Healing Foundation', '2014'],
  ['Pranic Psychotherapy', 'World Pranic Healing Foundation', '2014']
];

// Client words, shared on the current site and on Instagram.
const REVIEWS = [
  { name: 'Ridhhei Parmar', tag: 'Tarot reading', text: 'Your reading is up to the mark. I got more clarity in life and I know what to do now. You explained everything clearly and our conversation left me feeling positive.' },
  { name: 'Kaushika Patel', tag: 'Reiki healing', text: 'After my Reiki healing sessions with you I feel much more relaxed, tolerant and loving, and it is a lot easier to cope with daily stress.' },
  { name: 'Vaishali', tag: 'Tarot reading', text: 'Your guidance and expertise helped me gain clarity and perspective on my journey. Your gift is truly invaluable, and I am thankful for the time and energy you shared with me.' },
  { name: 'Aarohi B.', tag: 'Tarot reading', text: 'Today’s session was very enlightening and it gave me clarity on how to move forward. It all came full circle and made so much sense.' },
  { name: 'Nishika Joshi', tag: 'Manifestation', text: 'The affirmations and mantras you shared have been incredibly helpful. I am already seeing such positive changes in my life.' },
  { name: 'Dimi Timugpi', tag: 'Tarot reading', text: 'After my reading I got much-needed clarity. Your reels gave me proper guidance too. I practised the affirmations you gave me every day.' },
  { name: 'Happy client', tag: 'Tarot reading', text: 'Great session. I got all the answers I had been seeking for a long time. You are a true, genuine tarot reader.' }
];

const FAQ = [
  ['Do I need to come to the centre?', 'No. Tarot readings and manifestation coaching happen on phone, chat or video. Reiki and pranic healing can be done at the Navsari centre or as distance healing wherever you are.'],
  ['How do I book?', 'Send a message on Instagram or WhatsApp with the session you want. The first consultation is free. We will fix a time that suits you.'],
  ['Is distance healing really effective?', 'Energy is not limited by distance. In a distance session you rest at home at the agreed time while I send the healing. Most clients feel it the same way they feel an in-person session.'],
  ['Will you tell me my future is fixed?', 'No. Tarot shows the energy around a situation and the choices open to you. Your decisions and actions shape what happens next.'],
  ['Can healing replace my medicine?', 'No. Reiki and pranic healing are complementary. Please continue any treatment your doctor has given you.'],
  ['Is what I share kept private?', 'Yes. Everything you share in a session stays between us.']
];

module.exports = { SITE, SERVICES, CERTS, REVIEWS, FAQ };
