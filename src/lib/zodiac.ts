import type { Locale } from '@/lib/i18n';

export interface ZodiacSign {
  name: string;
  nameJa: string;
  symbol: string;
  dateRange: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  energy: string;
  energyDescription: string;
  crystals: CrystalRecommendation[];
}

export interface CrystalRecommendation {
  name: string;
  reason: string;
  productSlug?: string;
}

// ── Multilingual lookup tables ──────────────────────────────────

/** Zodiac sign names per locale (keyed by English name) */
const ZODIAC_NAME_I18N: Record<string, Record<Locale, string>> = {
  Aries:       { en: 'Aries',       ja: '牡羊座',  ko: '양자리',  zh: '白羊座' },
  Taurus:      { en: 'Taurus',      ja: '牡牛座',  ko: '황소자리', zh: '金牛座' },
  Gemini:      { en: 'Gemini',      ja: '双子座',  ko: '쌍둥이자리', zh: '双子座' },
  Cancer:      { en: 'Cancer',      ja: '蟹座',    ko: '게자리',  zh: '巨蟹座' },
  Leo:         { en: 'Leo',         ja: '獅子座',  ko: '사자자리', zh: '狮子座' },
  Virgo:       { en: 'Virgo',       ja: '乙女座',  ko: '처녀자리', zh: '处女座' },
  Libra:       { en: 'Libra',       ja: '天秤座',  ko: '천칭자리', zh: '天秤座' },
  Scorpio:     { en: 'Scorpio',     ja: '蠍座',    ko: '전갈자리', zh: '天蝎座' },
  Sagittarius: { en: 'Sagittarius', ja: '射手座',  ko: '궁수자리', zh: '射手座' },
  Capricorn:   { en: 'Capricorn',   ja: '山羊座',  ko: '염소자리', zh: '摩羯座' },
  Aquarius:    { en: 'Aquarius',    ja: '水瓶座',  ko: '물병자리', zh: '水瓶座' },
  Pisces:      { en: 'Pisces',      ja: '魚座',    ko: '물고기자리', zh: '双鱼座' },
};

/** Element translations */
const ELEMENT_I18N: Record<string, Record<Locale, string>> = {
  Fire:  { en: 'Fire',  ja: '火',  ko: '불', zh: '火' },
  Earth: { en: 'Earth', ja: '地',  ko: '흙', zh: '土' },
  Air:   { en: 'Air',   ja: '風',  ko: '바람', zh: '风' },
  Water: { en: 'Water', ja: '水',  ko: '물', zh: '水' },
};

/** Energy name translations (keyed by English energy name) */
const ENERGY_I18N: Record<string, Record<Locale, string>> = {
  'Warrior Spirit':     { en: 'Warrior Spirit',     ja: '戦士の魂',       ko: '전사의 영혼',     zh: '战士之魂' },
  'Grounded Abundance': { en: 'Grounded Abundance', ja: '大地の豊穣',     ko: '풍요의 대지',     zh: '丰饶大地' },
  'Dual Radiance':      { en: 'Dual Radiance',      ja: '双子の輝き',     ko: '쌍둥이의 빛',     zh: '双子光辉' },
  'Lunar Nurture':      { en: 'Lunar Nurture',      ja: '月の慈愛',       ko: '달의 자애',       zh: '月之慈爱' },
  'Solar Sovereignty':  { en: 'Solar Sovereignty',  ja: '太陽の王権',     ko: '태양의 왕권',     zh: '太阳王权' },
  'Sacred Precision':   { en: 'Sacred Precision',   ja: '聖なる精密',     ko: '신성한 정밀',     zh: '神圣精准' },
  'Harmonic Balance':   { en: 'Harmonic Balance',   ja: '調和の均衡',     ko: '조화의 균형',     zh: '和谐平衡' },
  'Phoenix Depth':      { en: 'Phoenix Depth',      ja: '不死鳥の深淵',   ko: '불사조의 심연',   zh: '凤凰深渊' },
  'Cosmic Wanderer':    { en: 'Cosmic Wanderer',    ja: '宇宙の旅人',     ko: '우주의 방랑자',   zh: '宇宙旅人' },
  'Mountain Wisdom':    { en: 'Mountain Wisdom',    ja: '山の叡智',       ko: '산의 지혜',       zh: '山之智慧' },
  'Visionary Current':  { en: 'Visionary Current',  ja: '先見の潮流',     ko: '선견의 흐름',     zh: '远见之流' },
  'Mystic Flow':        { en: 'Mystic Flow',        ja: '神秘の流れ',     ko: '신비의 흐름',     zh: '神秘之流' },
};

/** Energy descriptions per zodiac sign */
const ENERGY_DESC_I18N: Record<string, Record<Locale, string>> = {
  Aries: {
    en: 'Bold, passionate, and driven by courageous fire energy. You thrive when channeling your inner strength into decisive action.',
    ja: '大胆で情熱的、勇敢な火のエネルギーに導かれています。内なる強さを果敢な行動に注ぐとき、あなたは最も輝きます。',
    ko: '대담하고 열정적이며 용감한 불의 에너지로 이끌립니다. 내면의 힘을 결단력 있는 행동으로 발휘할 때 빛을 발합니다.',
    zh: '大胆、热情，由勇敢的火焰能量驱动。当你将内在力量化为果断行动时，便是你最闪耀的时刻。',
  },
  Taurus: {
    en: 'Steady, sensual, and deeply connected to earthly beauty. Your energy attracts luxury and lasting comfort through patience.',
    ja: '安定感があり、感覚的で大地の美と深くつながっています。あなたのエネルギーは忍耐を通じて豊かさと安らぎを引き寄せます。',
    ko: '안정적이고 감각적이며 대지의 아름다움과 깊이 연결되어 있습니다. 인내를 통해 풍요와 안락함을 끌어당깁니다.',
    zh: '稳重、感性，与大地之美深深相连。你的能量通过耐心吸引丰裕与持久的安适。',
  },
  Gemini: {
    en: 'Curious, expressive, and intellectually luminous. Your energy dances between worlds, finding connections others miss.',
    ja: '好奇心旺盛で表現力豊か、知性に溢れています。あなたのエネルギーは世界を行き来し、他の人が見逃すつながりを見つけます。',
    ko: '호기심이 많고 표현력이 풍부하며 지적으로 빛납니다. 다른 사람이 놓치는 연결고리를 찾아내는 에너지를 가지고 있습니다.',
    zh: '充满好奇、表达力丰富、智慧闪耀。你的能量在世界间穿梭，发现他人忽略的联系。',
  },
  Cancer: {
    en: 'Intuitive, protective, and emotionally deep. Ruled by the Moon, your energy flows with tides of compassion and care.',
    ja: '直感的で守護的、感情の深みを持っています。月に支配され、あなたのエネルギーは慈悲と思いやりの潮流と共に流れます。',
    ko: '직관적이고 보호적이며 감정의 깊이가 있습니다. 달의 지배를 받아 자비와 돌봄의 조류와 함께 흐릅니다.',
    zh: '直觉敏锐、保护心强、情感深邃。受月亮主宰，你的能量随慈悲与关爱的潮汐而流动。',
  },
  Leo: {
    en: 'Radiant, generous, and magnetically creative. Your energy commands attention and inspires others to shine.',
    ja: '輝かしく寛大で、磁力的な創造力を持っています。あなたのエネルギーは注目を集め、他の人にも輝くよう刺激を与えます。',
    ko: '빛나고 관대하며 자석처럼 끌리는 창의력을 가지고 있습니다. 주목을 받고 다른 사람도 빛나도록 영감을 줍니다.',
    zh: '光芒四射、慷慨大方、创造力如磁石般吸引。你的能量令人瞩目，激励他人一同闪耀。',
  },
  Virgo: {
    en: 'Analytical, devoted, and gracefully meticulous. Your energy refines and heals through attention to detail and service.',
    ja: '分析的で献身的、優美なほど丁寧です。あなたのエネルギーは細部への気配りと奉仕を通じて洗練し、癒します。',
    ko: '분석적이고 헌신적이며 우아할 정도로 꼼꼼합니다. 디테일에 대한 관심과 봉사를 통해 정제하고 치유합니다.',
    zh: '善于分析、忠诚奉献、优雅而细致。你的能量通过对细节的关注与服务来净化和疗愈。',
  },
  Libra: {
    en: 'Graceful, diplomatic, and aesthetically attuned. Your energy seeks beauty and equilibrium in all things.',
    ja: '優雅で外交的、美的感覚に優れています。あなたのエネルギーはすべてのものに美と均衡を求めます。',
    ko: '우아하고 외교적이며 미적 감각이 뛰어납니다. 모든 것에서 아름다움과 균형을 추구합니다.',
    zh: '优雅、善于外交、审美敏锐。你的能量在万物中寻求美与平衡。',
  },
  Scorpio: {
    en: 'Intense, transformative, and magnetically mysterious. Your energy pierces illusions and emerges stronger from every rebirth.',
    ja: '強烈で変容的、磁力的な神秘性を秘めています。あなたのエネルギーは幻影を貫き、再生するたびにより強くなります。',
    ko: '강렬하고 변혁적이며 자석처럼 끌리는 신비로움을 가지고 있습니다. 환상을 꿰뚫고 매번 부활할 때마다 더 강해집니다.',
    zh: '强烈、蜕变、神秘如磁。你的能量穿透幻象，每次重生都变得更加强大。',
  },
  Sagittarius: {
    en: 'Adventurous, philosophical, and eternally optimistic. Your energy seeks truth across horizons and cultures.',
    ja: '冒険心に満ち、哲学的で永遠に楽観的です。あなたのエネルギーは地平線と文化を超えて真実を追い求めます。',
    ko: '모험심이 넘치고 철학적이며 영원히 낙관적입니다. 지평선과 문화를 넘어 진실을 추구합니다.',
    zh: '冒险、哲思、永远乐观。你的能量跨越地平线与文化，追寻真理。',
  },
  Capricorn: {
    en: 'Disciplined, ambitious, and quietly powerful. Your energy climbs steadily toward mastery, guided by ancient patience.',
    ja: '規律正しく野心的で、静かな力を持っています。あなたのエネルギーは古来の忍耐に導かれ、着実に頂点を目指します。',
    ko: '규율 있고 야심차며 조용한 힘을 가지고 있습니다. 오래된 인내에 이끌려 꾸준히 정상을 향해 나아갑니다.',
    zh: '自律、进取、沉静而有力。你的能量在古老的耐心引导下稳步攀向巅峰。',
  },
  Aquarius: {
    en: 'Innovative, humanitarian, and beautifully unconventional. Your energy disrupts the ordinary and envisions new possibilities.',
    ja: '革新的で博愛的、美しく型破りです。あなたのエネルギーは日常を打ち破り、新たな可能性を見出します。',
    ko: '혁신적이고 인도주의적이며 아름답게 파격적입니다. 일상을 깨뜨리고 새로운 가능성을 그려냅니다.',
    zh: '创新、博爱、美丽而不拘一格。你的能量打破平凡，展望新的可能。',
  },
  Pisces: {
    en: 'Dreamy, empathic, and spiritually boundless. Your energy dissolves barriers between worlds, channeling art and compassion.',
    ja: '夢想的で共感力に満ち、精神的に無限の広がりを持っています。あなたのエネルギーは世界の壁を溶かし、芸術と慈悲を導きます。',
    ko: '몽환적이고 공감 능력이 뛰어나며 영적으로 무한합니다. 세계 사이의 장벽을 녹이고 예술과 자비를 이끌어냅니다.',
    zh: '梦幻、共情、灵性无限。你的能量消融世界间的壁垒，引导艺术与慈悲。',
  },
};

/** Crystal reason translations (keyed by zodiac name + crystal name) */
const CRYSTAL_REASON_I18N: Record<string, Record<Locale, string>> = {
  // Aries
  'Aries:Carnelian': {
    en: 'Ignites your warrior spirit with unstoppable motivation and the vitality to conquer any challenge.',
    ja: '止められないモチベーションと活力であなたの戦士の魂に火をつけ、あらゆる挑戦を制します。',
    ko: '멈출 수 없는 동기부여와 활력으로 전사의 영혼에 불을 붙여 모든 도전을 정복합니다.',
    zh: '用势不可挡的动力和活力点燃你的战士之魂，征服一切挑战。',
  },
  'Aries:Citrine': {
    en: 'Channels your ambitious drive into manifested abundance and career success.',
    ja: 'あなたの野心を現実の豊かさとキャリアの成功へと導きます。',
    ko: '야심찬 추진력을 풍요와 커리어 성공으로 이끕니다.',
    zh: '将你的雄心化为丰盛的现实与事业成功。',
  },
  'Aries:Smoky Quartz': {
    en: 'Grounds your intense fire energy and shields you from negativity during bold pursuits.',
    ja: '強烈な火のエネルギーを大地に根付かせ、果敢な挑戦の中でネガティブなものから守ります。',
    ko: '강렬한 불의 에너지를 안정시키고 대담한 도전 중 부정적인 것으로부터 보호합니다.',
    zh: '让你强烈的火焰能量扎根大地，在大胆追求中抵御负能量。',
  },
  // Taurus
  'Taurus:Rose Quartz': {
    en: 'Nurtures your deep capacity for love and enhances your natural self-worth.',
    ja: '深い愛の力を育み、自然な自己価値を高めます。',
    ko: '깊은 사랑의 능력을 키우고 자연스러운 자기가치를 높입니다.',
    zh: '滋养你深厚的爱的能力，提升你天生的自我价值。',
  },
  'Taurus:Citrine': {
    en: 'Aligns with your innate connection to prosperity and material abundance.',
    ja: '繁栄と物質的豊かさへの生来のつながりと調和します。',
    ko: '번영과 물질적 풍요에 대한 타고난 연결과 조화를 이룹니다.',
    zh: '与你与生俱来的繁荣和物质丰裕之连接相协调。',
  },
  'Taurus:Smoky Quartz': {
    en: 'Grounds your steady energy and eases stress on the patient path to lasting comfort.',
    ja: '安定したエネルギーを大地に根付かせ、持続的な安らぎへの忍耐の道でストレスを和らげます。',
    ko: '안정된 에너지를 안정시키고 지속적인 편안함으로의 인내의 길에서 스트레스를 줄입니다.',
    zh: '让你稳定的能量扎根，在通往持久安适的耐心之路上缓解压力。',
  },
  // Gemini
  'Gemini:Aquamarine': {
    en: 'Enhances your gift for communication and brings emotional balance to your expressive energy.',
    ja: 'コミュニケーションの才能を高め、表現豊かなエネルギーに感情的なバランスをもたらします。',
    ko: '소통의 재능을 강화하고 풍부한 표현 에너지에 감정적 균형을 가져옵니다.',
    zh: '增强你的沟通天赋，为你丰富的表达能量带来情感平衡。',
  },
  'Gemini:Green Fluorite': {
    en: 'Sharpens your already brilliant mind and clears mental clutter across your many interests.',
    ja: 'すでに優秀な頭脳をさらに研ぎ澄まし、多くの興味の中で思考の混乱を取り除きます。',
    ko: '이미 뛰어난 두뇌를 더욱 날카롭게 하고 다양한 관심사 속 정신적 혼란을 정리합니다.',
    zh: '让你本已出色的头脑更加锐利，清除众多兴趣中的思维杂乱。',
  },
  'Gemini:Carnelian': {
    en: 'Fuels your creative spark and keeps your vitality high as you explore new ideas.',
    ja: '創造力の火花を燃やし、新しいアイデアを探求しながら活力を保ちます。',
    ko: '창의적 영감에 불을 붙이고 새로운 아이디어를 탐구하며 활력을 유지합니다.',
    zh: '点燃你的创意火花，在探索新想法时保持充沛活力。',
  },
  // Cancer
  'Cancer:Rose Quartz': {
    en: 'Amplifies your boundless capacity for nurturing love and opens the heart to compassion.',
    ja: '無限の慈愛の力を増幅し、心を慈悲に開きます。',
    ko: '무한한 돌봄의 사랑을 증폭시키고 마음을 자비로 엽니다.',
    zh: '放大你无限的关爱能力，敞开心扉迎接慈悲。',
  },
  'Cancer:Amethyst': {
    en: 'Deepens your lunar intuition, promotes restful sleep, and purifies your sensitive aura.',
    ja: '月の直感を深め、安らかな眠りを促し、敏感なオーラを浄化します。',
    ko: '달의 직관을 깊게 하고 편안한 수면을 촉진하며 민감한 오라를 정화합니다.',
    zh: '加深你的月亮直觉，促进安眠，净化你敏感的气场。',
  },
  'Cancer:Aquamarine': {
    en: 'Resonates with your water element, calming your mind with oceanic tranquility.',
    ja: '水のエレメントと共鳴し、海の静けさで心を落ち着けます。',
    ko: '물의 원소와 공명하여 바다의 고요함으로 마음을 진정시킵니다.',
    zh: '与你的水元素共鸣，以海洋般的宁静平复你的心灵。',
  },
  // Leo
  'Leo:Citrine': {
    en: 'Mirrors your solar energy, attracting abundance and fueling your natural magnetism.',
    ja: '太陽のエネルギーを映し出し、豊かさを引き寄せ、生まれ持ったカリスマを燃やします。',
    ko: '태양 에너지를 반영하여 풍요를 끌어당기고 타고난 매력에 불을 붙입니다.',
    zh: '映射你的太阳能量，吸引丰盛，为你天生的魅力加油。',
  },
  'Leo:Carnelian': {
    en: 'Boosts your creative vitality and keeps your passionate fire burning with ambition.',
    ja: '創造的な活力を高め、野心とともに情熱の炎を燃やし続けます。',
    ko: '창의적 활력을 높이고 야망의 열정적인 불꽃을 유지합니다.',
    zh: '激发你的创造活力，让热情之火与雄心一同燃烧。',
  },
  'Leo:Black Obsidian': {
    en: 'Provides powerful protection for your radiant energy and grounds your regal spirit.',
    ja: '輝くエネルギーに強力な保護を与え、高貴な精神を大地に根付かせます。',
    ko: '빛나는 에너지에 강력한 보호를 제공하고 고귀한 정신을 안정시킵니다.',
    zh: '为你璀璨的能量提供强大保护，让你高贵的精神扎根。',
  },
  // Virgo
  'Virgo:Green Fluorite': {
    en: 'Enhances your analytical focus and clears mental clutter for purposeful action.',
    ja: '分析力を高め、目的ある行動のために思考の混乱を取り除きます。',
    ko: '분석적 집중력을 높이고 목적 있는 행동을 위해 정신적 혼란을 정리합니다.',
    zh: '增强你的分析专注力，清除思维杂乱以实现有目的的行动。',
  },
  'Virgo:Amethyst': {
    en: 'Promotes restful sleep after devoted service and purifies your aura from absorbed stress.',
    ja: '献身的な奉仕の後に安らかな眠りを促し、蓄積されたストレスからオーラを浄化します。',
    ko: '헌신적인 봉사 후 편안한 수면을 촉진하고 쌓인 스트레스에서 오라를 정화합니다.',
    zh: '在奉献服务后促进安眠，净化你吸收的压力气场。',
  },
  'Virgo:Smoky Quartz': {
    en: 'Grounds your energy and shields against absorbing others\' negativity while you serve.',
    ja: 'エネルギーを安定させ、奉仕中に他者のネガティブなエネルギーを吸収するのを防ぎます。',
    ko: '에너지를 안정시키고 봉사하는 동안 다른 사람의 부정적 에너지 흡수를 방지합니다.',
    zh: '稳定你的能量，在服务时抵御他人负能量的侵入。',
  },
  // Libra
  'Libra:Rose Quartz': {
    en: 'Deepens your gift for love, nurtures self-worth, and harmonizes relationships.',
    ja: '愛の才能を深め、自己価値を育み、人間関係を調和させます。',
    ko: '사랑의 재능을 깊게 하고 자기가치를 키우며 관계를 조화롭게 합니다.',
    zh: '加深你的爱之天赋，培育自我价值，和谐人际关系。',
  },
  'Libra:Aquamarine': {
    en: 'Calms your diplomatic mind and brings emotional balance to your pursuit of fairness.',
    ja: '外交的な心を落ち着かせ、公正さの追求に感情的なバランスをもたらします。',
    ko: '외교적인 마음을 진정시키고 공정함의 추구에 감정적 균형을 가져옵니다.',
    zh: '平息你善于外交的心灵，为追求公正带来情感平衡。',
  },
  'Libra:Amethyst': {
    en: 'Enhances your intuition for reading others and purifies the energy around you.',
    ja: '他者を読み取る直感を高め、周囲のエネルギーを浄化します。',
    ko: '타인을 읽는 직관을 높이고 주변의 에너지를 정화합니다.',
    zh: '增强你洞察他人的直觉，净化周围的能量。',
  },
  // Scorpio
  'Scorpio:Black Obsidian': {
    en: 'Resonates with your shadow-work mastery, clearing negative energy and grounding your spirit.',
    ja: 'シャドーワークの達人として共鳴し、ネガティブなエネルギーを浄化して精神を安定させます。',
    ko: '그림자 작업의 달인으로서 공명하여 부정적 에너지를 정화하고 정신을 안정시킵니다.',
    zh: '与你的阴影工作修行共鸣，清除负能量，让精神扎根。',
  },
  'Scorpio:Amethyst': {
    en: 'Supports your transformative power with deep intuition and aura purification.',
    ja: '深い直感とオーラの浄化で、あなたの変容の力をサポートします。',
    ko: '깊은 직관과 오라 정화로 변혁의 힘을 지원합니다.',
    zh: '以深邃直觉和气场净化支持你的蜕变之力。',
  },
  'Scorpio:Smoky Quartz': {
    en: 'Channels your passionate intensity into grounded power, shielding against negativity.',
    ja: '情熱的な強さを大地に根付いた力へと導き、ネガティブなものから守ります。',
    ko: '열정적인 강렬함을 안정된 힘으로 이끌고 부정적인 것으로부터 보호합니다.',
    zh: '将你热烈的激情化为扎根大地的力量，抵御负能量。',
  },
  // Sagittarius
  'Sagittarius:Citrine': {
    en: 'Amplifies your optimistic spirit and attracts prosperity on your adventurous journeys.',
    ja: '楽観的な精神を増幅し、冒険の旅路に繁栄を引き寄せます。',
    ko: '낙관적인 정신을 증폭시키고 모험의 여정에 번영을 끌어당깁니다.',
    zh: '放大你的乐观精神，在冒险旅途中吸引繁荣。',
  },
  'Sagittarius:Carnelian': {
    en: 'Fuels your motivation and vitality to explore uncharted territories with ambition.',
    ja: '野心を持って未知の領域を探索するモチベーションと活力を燃やします。',
    ko: '야망을 가지고 미지의 영역을 탐험할 동기부여와 활력을 불태웁니다.',
    zh: '为你探索未知领域的动力和活力加油，带着雄心前行。',
  },
  'Sagittarius:Green Fluorite': {
    en: 'Expands your philosophical vision with mental clarity and supports spiritual growth.',
    ja: '思考の明晰さで哲学的なビジョンを広げ、精神的な成長をサポートします。',
    ko: '정신적 명료함으로 철학적 비전을 넓히고 영적 성장을 지원합니다.',
    zh: '以思维清晰拓展你的哲学视野，支持灵性成长。',
  },
  // Capricorn
  'Capricorn:Smoky Quartz': {
    en: 'Grounds your ambition in the earth and eases stress on the climb to your summit.',
    ja: '大地に野心を根付かせ、頂上への道でストレスを和らげます。',
    ko: '대지에 야망을 뿌리내리게 하고 정상으로의 길에서 스트레스를 줄입니다.',
    zh: '将你的雄心扎根大地，在攀登顶峰的路上缓解压力。',
  },
  'Capricorn:Black Obsidian': {
    en: 'Provides powerful protection and clears negative energy on the path to mastery.',
    ja: '強力な保護を与え、成熟への道でネガティブなエネルギーを浄化します。',
    ko: '강력한 보호를 제공하고 숙달로의 길에서 부정적 에너지를 정화합니다.',
    zh: '提供强大保护，在通往大师之路上清除负能量。',
  },
  'Capricorn:Carnelian': {
    en: 'Ignites the motivation and ambition to keep climbing when the path grows steep.',
    ja: '道が険しくなっても登り続けるモチベーションと野心に火をつけます。',
    ko: '길이 가팔라질 때도 계속 오를 동기부여와 야망에 불을 붙입니다.',
    zh: '在道路陡峭时点燃继续攀登的动力与雄心。',
  },
  // Aquarius
  'Aquarius:Amethyst': {
    en: 'Celebrates your visionary spirit and strengthens your intuitive genius.',
    ja: '先見の精神を讃え、直感的な天才性を強化します。',
    ko: '선견지명의 정신을 기리고 직관적 천재성을 강화합니다.',
    zh: '赞颂你的远见精神，强化你直觉的天赋。',
  },
  'Aquarius:Aquamarine': {
    en: 'Deepens your connection to collective truth and boosts humanitarian communication.',
    ja: '集合的な真実とのつながりを深め、人道的なコミュニケーションを高めます。',
    ko: '집단적 진실과의 연결을 깊게 하고 인도주의적 소통을 강화합니다.',
    zh: '加深你与集体真理的连接，提升人道主义沟通。',
  },
  'Aquarius:Green Fluorite': {
    en: 'Balances your innovative energy with focused clarity, turning visions into reality.',
    ja: '革新的なエネルギーに集中した明晰さでバランスを与え、ビジョンを現実にします。',
    ko: '혁신적 에너지에 집중된 명료함으로 균형을 맞추어 비전을 현실로 만듭니다.',
    zh: '以专注的清晰平衡你的创新能量，将愿景变为现实。',
  },
  // Pisces
  'Pisces:Amethyst': {
    en: 'Enhances your natural mysticism, promotes restful sleep, and purifies your dreamy aura.',
    ja: '自然な神秘性を高め、安らかな眠りを促し、夢見がちなオーラを浄化します。',
    ko: '자연스러운 신비로움을 높이고 편안한 수면을 촉진하며 꿈같은 오라를 정화합니다.',
    zh: '增强你天生的神秘气质，促进安眠，净化你梦幻般的气场。',
  },
  'Pisces:Rose Quartz': {
    en: 'Amplifies your boundless empathy while nurturing self-worth and self-love.',
    ja: '無限の共感力を増幅しながら、自己価値と自己愛を育みます。',
    ko: '무한한 공감 능력을 증폭시키면서 자기가치와 자기사랑을 키웁니다.',
    zh: '放大你无限的共情力，同时滋养自我价值与自爱。',
  },
  'Pisces:Aquamarine': {
    en: 'Flows with your water energy, calming the mind and balancing deep emotional currents.',
    ja: '水のエネルギーと共に流れ、心を落ち着かせ、深い感情の流れのバランスを取ります。',
    ko: '물의 에너지와 함께 흐르며 마음을 진정시키고 깊은 감정의 흐름을 균형 잡습니다.',
    zh: '随你的水之能量流动，平静心灵，平衡深层的情感波澜。',
  },
};

/** Power stone effect translations */
const EFFECT_I18N: Record<string, Record<Locale, string>> = {
  // Smoky Quartz
  'Grounding':              { en: 'Grounding',              ja: 'グラウンディング',     ko: '그라운딩',        zh: '接地' },
  'Stress Relief':          { en: 'Stress Relief',          ja: 'ストレス緩和',         ko: '스트레스 완화',   zh: '减压' },
  'Negativity Shield':      { en: 'Negativity Shield',      ja: 'ネガティブ防御',       ko: '부정 방어',       zh: '负能量屏障' },
  // Aquamarine
  'Calm':                   { en: 'Calm',                   ja: '穏やかさ',             ko: '평온',           zh: '平静' },
  'Communication':          { en: 'Communication',          ja: 'コミュニケーション',   ko: '소통',           zh: '沟通' },
  'Emotional Balance':      { en: 'Emotional Balance',      ja: '感情のバランス',       ko: '감정 균형',      zh: '情感平衡' },
  // Amethyst
  'Intuition':              { en: 'Intuition',              ja: '直感',                 ko: '직관',           zh: '直觉' },
  'Restful Sleep':          { en: 'Restful Sleep',          ja: '安眠',                 ko: '숙면',           zh: '安眠' },
  'Aura Purification':      { en: 'Aura Purification',      ja: 'オーラ浄化',           ko: '오라 정화',      zh: '气场净化' },
  // Black Obsidian
  'Protection':             { en: 'Protection',             ja: '保護',                 ko: '보호',           zh: '守护' },
  'Negative Energy Clearing': { en: 'Negative Energy Clearing', ja: '邪気払い',         ko: '부정 에너지 정화', zh: '净化负能量' },
  // Green Fluorite
  'Focus':                  { en: 'Focus',                  ja: '集中力',               ko: '집중',           zh: '专注' },
  'Mental Clarity':         { en: 'Mental Clarity',         ja: '思考の明晰さ',         ko: '정신 명료',      zh: '思维清晰' },
  'Spiritual Growth':       { en: 'Spiritual Growth',       ja: '精神的成長',           ko: '영적 성장',      zh: '灵性成长' },
  // Citrine
  'Abundance':              { en: 'Abundance',              ja: '豊穣',                 ko: '풍요',           zh: '丰盛' },
  'Prosperity':             { en: 'Prosperity',             ja: '繁栄',                 ko: '번영',           zh: '繁荣' },
  'Career Success':         { en: 'Career Success',         ja: 'キャリア成功',         ko: '커리어 성공',    zh: '事业成功' },
  // Rose Quartz
  'Love':                   { en: 'Love',                   ja: '愛',                   ko: '사랑',           zh: '爱' },
  'Self-Worth':             { en: 'Self-Worth',             ja: '自己価値',             ko: '자기가치',       zh: '自我价值' },
  'Compassion':             { en: 'Compassion',             ja: '慈悲',                 ko: '자비',           zh: '慈悲' },
  // Carnelian
  'Motivation':             { en: 'Motivation',             ja: 'モチベーション',       ko: '동기부여',       zh: '动力' },
  'Vitality':               { en: 'Vitality',               ja: '活力',                 ko: '활력',           zh: '活力' },
  'Creativity':             { en: 'Creativity',             ja: '創造力',               ko: '창의력',         zh: '创造力' },
};

// ── Public helper: get localized text ───────────────────────────

export function getLocalizedZodiacName(sign: ZodiacSign, locale: string): string {
  return ZODIAC_NAME_I18N[sign.name]?.[locale as Locale] ?? sign.name;
}

export function getLocalizedElement(element: string, locale: string): string {
  return ELEMENT_I18N[element]?.[locale as Locale] ?? element;
}

export function getLocalizedEnergy(energy: string, locale: string): string {
  return ENERGY_I18N[energy]?.[locale as Locale] ?? energy;
}

export function getLocalizedEnergyDescription(signName: string, locale: string): string {
  return ENERGY_DESC_I18N[signName]?.[locale as Locale] ?? ENERGY_DESC_I18N[signName]?.en ?? '';
}

export function getLocalizedCrystalReason(signName: string, crystalName: string, locale: string): string {
  const key = `${signName}:${crystalName}`;
  return CRYSTAL_REASON_I18N[key]?.[locale as Locale] ?? CRYSTAL_REASON_I18N[key]?.en ?? '';
}

export function getLocalizedEffect(effect: string, locale: string): string {
  return EFFECT_I18N[effect]?.[locale as Locale] ?? effect;
}

export function getLocalizedCrystalName(crystalName: string, locale: string): string {
  if (locale === 'en') return crystalName;
  return POWER_STONE_EFFECTS[crystalName]?.nameJa && locale === 'ja'
    ? POWER_STONE_EFFECTS[crystalName].nameJa
    : CRYSTAL_NAME_I18N_FULL[crystalName]?.[locale as Locale] ?? crystalName;
}

/** Full crystal name translations for ko/zh */
const CRYSTAL_NAME_I18N_FULL: Record<string, Record<Locale, string>> = {
  'Smoky Quartz':   { en: 'Smoky Quartz',   ja: 'スモーキークォーツ',     ko: '스모키 쿼츠',       zh: '烟晶' },
  'Aquamarine':     { en: 'Aquamarine',     ja: 'アクアマリン',           ko: '아쿠아마린',         zh: '海蓝宝石' },
  'Amethyst':       { en: 'Amethyst',       ja: 'アメジスト',             ko: '자수정',             zh: '紫水晶' },
  'Black Obsidian': { en: 'Black Obsidian', ja: 'ブラックオブシディアン', ko: '흑요석',             zh: '黑曜石' },
  'Green Fluorite': { en: 'Green Fluorite', ja: 'グリーンフローライト',   ko: '그린 플루오라이트', zh: '绿萤石' },
  'Citrine':        { en: 'Citrine',        ja: 'シトリン',               ko: '시트린',             zh: '黄水晶' },
  'Rose Quartz':    { en: 'Rose Quartz',    ja: 'ローズクォーツ',         ko: '로즈 쿼츠',         zh: '粉晶' },
  'Carnelian':      { en: 'Carnelian',      ja: 'カーネリアン',           ko: '카넬리안',           zh: '红玉髓' },
};

// ── Canonical effects for the 8 power stones ────────────────────

export const POWER_STONE_EFFECTS: Record<string, { effects: string[]; nameJa: string; description: string }> = {
  'Smoky Quartz': {
    nameJa: 'スモーキークォーツ',
    effects: ['Grounding', 'Stress Relief', 'Negativity Shield'],
    description: 'Grounds your energy, eases stress, and shields against negativity.',
  },
  'Aquamarine': {
    nameJa: 'アクアマリン',
    effects: ['Calm', 'Communication', 'Emotional Balance'],
    description: 'Calms the mind, boosts communication, and brings emotional balance.',
  },
  'Amethyst': {
    nameJa: 'アメジスト',
    effects: ['Intuition', 'Restful Sleep', 'Aura Purification'],
    description: 'Enhances intuition, promotes restful sleep, and purifies your aura.',
  },
  'Black Obsidian': {
    nameJa: 'ブラックオブシディアン',
    effects: ['Protection', 'Negative Energy Clearing', 'Grounding'],
    description: 'Acts as a powerful protection stone, clears negative energy, and grounds the spirit.',
  },
  'Green Fluorite': {
    nameJa: 'グリーンフローライト',
    effects: ['Focus', 'Mental Clarity', 'Spiritual Growth'],
    description: 'Boosts focus, clears mental clutter, and supports spiritual growth.',
  },
  'Citrine': {
    nameJa: 'シトリン',
    effects: ['Abundance', 'Prosperity', 'Career Success'],
    description: 'Attracts abundance, prosperity, and positive energy for career success.',
  },
  'Rose Quartz': {
    nameJa: 'ローズクォーツ',
    effects: ['Love', 'Self-Worth', 'Compassion'],
    description: 'Attracts love, nurtures self-worth, and opens the heart to compassion.',
  },
  'Carnelian': {
    nameJa: 'カーネリアン',
    effects: ['Motivation', 'Vitality', 'Creativity'],
    description: 'Ignites motivation, boosts vitality, and fuels creativity and ambition.',
  },
};

// ── Zodiac sign data ────────────────────────────────────────────

const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: 'Aries',
    nameJa: '牡羊座',
    symbol: '♈',
    dateRange: 'Mar 21 – Apr 19',
    element: 'Fire',
    energy: 'Warrior Spirit',
    energyDescription: 'Bold, passionate, and driven by courageous fire energy. You thrive when channeling your inner strength into decisive action.',
    crystals: [
      { name: 'Carnelian', reason: 'Ignites your warrior spirit with unstoppable motivation and the vitality to conquer any challenge.', productSlug: 'crimson-thread-of-fate-bracelet' },
      { name: 'Citrine', reason: 'Channels your ambitious drive into manifested abundance and career success.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Smoky Quartz', reason: 'Grounds your intense fire energy and shields you from negativity during bold pursuits.' },
    ],
  },
  {
    name: 'Taurus',
    nameJa: '牡牛座',
    symbol: '♉',
    dateRange: 'Apr 20 – May 20',
    element: 'Earth',
    energy: 'Grounded Abundance',
    energyDescription: 'Steady, sensual, and deeply connected to earthly beauty. Your energy attracts luxury and lasting comfort through patience.',
    crystals: [
      { name: 'Rose Quartz', reason: 'Nurtures your deep capacity for love and enhances your natural self-worth.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Citrine', reason: 'Aligns with your innate connection to prosperity and material abundance.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Smoky Quartz', reason: 'Grounds your steady energy and eases stress on the patient path to lasting comfort.' },
    ],
  },
  {
    name: 'Gemini',
    nameJa: '双子座',
    symbol: '♊',
    dateRange: 'May 21 – Jun 20',
    element: 'Air',
    energy: 'Dual Radiance',
    energyDescription: 'Curious, expressive, and intellectually luminous. Your energy dances between worlds, finding connections others miss.',
    crystals: [
      { name: 'Aquamarine', reason: 'Enhances your gift for communication and brings emotional balance to your expressive energy.', productSlug: 'ocean-embrace-earrings' },
      { name: 'Green Fluorite', reason: 'Sharpens your already brilliant mind and clears mental clutter across your many interests.' },
      { name: 'Carnelian', reason: 'Fuels your creative spark and keeps your vitality high as you explore new ideas.', productSlug: 'crimson-thread-of-fate-bracelet' },
    ],
  },
  {
    name: 'Cancer',
    nameJa: '蟹座',
    symbol: '♋',
    dateRange: 'Jun 21 – Jul 22',
    element: 'Water',
    energy: 'Lunar Nurture',
    energyDescription: 'Intuitive, protective, and emotionally deep. Ruled by the Moon, your energy flows with tides of compassion and care.',
    crystals: [
      { name: 'Rose Quartz', reason: 'Amplifies your boundless capacity for nurturing love and opens the heart to compassion.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Amethyst', reason: 'Deepens your lunar intuition, promotes restful sleep, and purifies your sensitive aura.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Aquamarine', reason: 'Resonates with your water element, calming your mind with oceanic tranquility.', productSlug: 'ocean-embrace-earrings' },
    ],
  },
  {
    name: 'Leo',
    nameJa: '獅子座',
    symbol: '♌',
    dateRange: 'Jul 23 – Aug 22',
    element: 'Fire',
    energy: 'Solar Sovereignty',
    energyDescription: 'Radiant, generous, and magnetically creative. Your energy commands attention and inspires others to shine.',
    crystals: [
      { name: 'Citrine', reason: 'Mirrors your solar energy, attracting abundance and fueling your natural magnetism.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Carnelian', reason: 'Boosts your creative vitality and keeps your passionate fire burning with ambition.', productSlug: 'crimson-thread-of-fate-bracelet' },
      { name: 'Black Obsidian', reason: 'Provides powerful protection for your radiant energy and grounds your regal spirit.', productSlug: 'midnight-obsidian-necklace' },
    ],
  },
  {
    name: 'Virgo',
    nameJa: '乙女座',
    symbol: '♍',
    dateRange: 'Aug 23 – Sep 22',
    element: 'Earth',
    energy: 'Sacred Precision',
    energyDescription: 'Analytical, devoted, and gracefully meticulous. Your energy refines and heals through attention to detail and service.',
    crystals: [
      { name: 'Green Fluorite', reason: 'Enhances your analytical focus and clears mental clutter for purposeful action.' },
      { name: 'Amethyst', reason: 'Promotes restful sleep after devoted service and purifies your aura from absorbed stress.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Smoky Quartz', reason: 'Grounds your energy and shields against absorbing others\' negativity while you serve.' },
    ],
  },
  {
    name: 'Libra',
    nameJa: '天秤座',
    symbol: '♎',
    dateRange: 'Sep 23 – Oct 22',
    element: 'Air',
    energy: 'Harmonic Balance',
    energyDescription: 'Graceful, diplomatic, and aesthetically attuned. Your energy seeks beauty and equilibrium in all things.',
    crystals: [
      { name: 'Rose Quartz', reason: 'Deepens your gift for love, nurtures self-worth, and harmonizes relationships.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Aquamarine', reason: 'Calms your diplomatic mind and brings emotional balance to your pursuit of fairness.', productSlug: 'ocean-embrace-earrings' },
      { name: 'Amethyst', reason: 'Enhances your intuition for reading others and purifies the energy around you.', productSlug: 'starlight-amethyst-bracelet' },
    ],
  },
  {
    name: 'Scorpio',
    nameJa: '蠍座',
    symbol: '♏',
    dateRange: 'Oct 23 – Nov 21',
    element: 'Water',
    energy: 'Phoenix Depth',
    energyDescription: 'Intense, transformative, and magnetically mysterious. Your energy pierces illusions and emerges stronger from every rebirth.',
    crystals: [
      { name: 'Black Obsidian', reason: 'Resonates with your shadow-work mastery, clearing negative energy and grounding your spirit.', productSlug: 'midnight-obsidian-necklace' },
      { name: 'Amethyst', reason: 'Supports your transformative power with deep intuition and aura purification.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Smoky Quartz', reason: 'Channels your passionate intensity into grounded power, shielding against negativity.' },
    ],
  },
  {
    name: 'Sagittarius',
    nameJa: '射手座',
    symbol: '♐',
    dateRange: 'Nov 22 – Dec 21',
    element: 'Fire',
    energy: 'Cosmic Wanderer',
    energyDescription: 'Adventurous, philosophical, and eternally optimistic. Your energy seeks truth across horizons and cultures.',
    crystals: [
      { name: 'Citrine', reason: 'Amplifies your optimistic spirit and attracts prosperity on your adventurous journeys.', productSlug: 'golden-abundance-bracelet' },
      { name: 'Carnelian', reason: 'Fuels your motivation and vitality to explore uncharted territories with ambition.', productSlug: 'crimson-thread-of-fate-bracelet' },
      { name: 'Green Fluorite', reason: 'Expands your philosophical vision with mental clarity and supports spiritual growth.' },
    ],
  },
  {
    name: 'Capricorn',
    nameJa: '山羊座',
    symbol: '♑',
    dateRange: 'Dec 22 – Jan 19',
    element: 'Earth',
    energy: 'Mountain Wisdom',
    energyDescription: 'Disciplined, ambitious, and quietly powerful. Your energy climbs steadily toward mastery, guided by ancient patience.',
    crystals: [
      { name: 'Smoky Quartz', reason: 'Grounds your ambition in the earth and eases stress on the climb to your summit.' },
      { name: 'Black Obsidian', reason: 'Provides powerful protection and clears negative energy on the path to mastery.', productSlug: 'midnight-obsidian-necklace' },
      { name: 'Carnelian', reason: 'Ignites the motivation and ambition to keep climbing when the path grows steep.', productSlug: 'crimson-thread-of-fate-bracelet' },
    ],
  },
  {
    name: 'Aquarius',
    nameJa: '水瓶座',
    symbol: '♒',
    dateRange: 'Jan 20 – Feb 18',
    element: 'Air',
    energy: 'Visionary Current',
    energyDescription: 'Innovative, humanitarian, and beautifully unconventional. Your energy disrupts the ordinary and envisions new possibilities.',
    crystals: [
      { name: 'Amethyst', reason: 'Celebrates your visionary spirit and strengthens your intuitive genius.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Aquamarine', reason: 'Deepens your connection to collective truth and boosts humanitarian communication.', productSlug: 'ocean-embrace-earrings' },
      { name: 'Green Fluorite', reason: 'Balances your innovative energy with focused clarity, turning visions into reality.' },
    ],
  },
  {
    name: 'Pisces',
    nameJa: '魚座',
    symbol: '♓',
    dateRange: 'Feb 19 – Mar 20',
    element: 'Water',
    energy: 'Mystic Flow',
    energyDescription: 'Dreamy, empathic, and spiritually boundless. Your energy dissolves barriers between worlds, channeling art and compassion.',
    crystals: [
      { name: 'Amethyst', reason: 'Enhances your natural mysticism, promotes restful sleep, and purifies your dreamy aura.', productSlug: 'starlight-amethyst-bracelet' },
      { name: 'Rose Quartz', reason: 'Amplifies your boundless empathy while nurturing self-worth and self-love.', productSlug: 'whisper-of-rose-quartz-earrings' },
      { name: 'Aquamarine', reason: 'Flows with your water energy, calming the mind and balancing deep emotional currents.', productSlug: 'ocean-embrace-earrings' },
    ],
  },
];

export function getZodiacFromDate(month: number, day: number): ZodiacSign {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10];
  return ZODIAC_SIGNS[11];
}

export function getElementColor(element: string): string {
  switch (element) {
    case 'Fire': return 'from-orange-400/20 to-red-400/20';
    case 'Earth': return 'from-emerald-400/20 to-amber-400/20';
    case 'Air': return 'from-sky-400/20 to-violet-400/20';
    case 'Water': return 'from-blue-400/20 to-indigo-400/20';
    default: return 'from-gold/20 to-gold-light/20';
  }
}

export function getElementBorder(element: string): string {
  switch (element) {
    case 'Fire': return 'border-orange-300/40';
    case 'Earth': return 'border-emerald-300/40';
    case 'Air': return 'border-sky-300/40';
    case 'Water': return 'border-blue-300/40';
    default: return 'border-gold/40';
  }
}

const CRYSTAL_NAME_MAP: Record<string, string[]> = {
  'Rose Quartz': ['Rose Quartz'],
  'Citrine': ['Citrine'],
  'Black Obsidian': ['Black Obsidian'],
  'Amethyst': ['Amethyst'],
  'Aquamarine': ['Aquamarine'],
  'Smoky Quartz': ['Smoky Quartz'],
  'Green Fluorite': ['Fluorite', 'Green Fluorite'],
  'Carnelian': ['Carnelian'],
};

export function getMatchingCrystalTypes(crystalName: string): string[] {
  return CRYSTAL_NAME_MAP[crystalName] || [crystalName];
}

export { ZODIAC_SIGNS };
