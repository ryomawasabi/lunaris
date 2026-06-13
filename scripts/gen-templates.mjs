/**
 * Bazi template generator (build-time, deterministic — no LLM at runtime).
 *
 * Composes the full 100-block matrix (10 Day Masters × strong/weak × 5
 * favourable elements) from authored fragments, applying the v2 rules:
 *   - same Day Master = fixed metaphor world; ONLY the favourable part (S2)
 *     varies across its five element-siblings.
 *   - S1 = "you carry both X and Y" + a rotated observer clause (6 forms).
 *   - S2 = a rotated missing-element lead-in (3 forms) + DM-consistent remedy
 *     with one "X rather than Y". When the favourable element IS the Day
 *     Master's own element (Harmonious / 専旺格 only), the missing framing is
 *     dropped for a "more of your own ___" strengthen/amplify phrasing.
 *   - S3 = challenge framed as the COST of a named strength. Weak Day Masters
 *     get a distinct "draws others out / makes others more themselves" character.
 *
 * Run: node scripts/gen-templates.mjs
 * Writes: src/lib/bazi/data/templates.generated.ts  + prints distributions.
 *
 * Curly apostrophes (’) and em dashes (—) throughout; the script asserts no
 * straight quotes or full-width punctuation leak in.
 */
import { writeFileSync } from 'node:fs';

const ELEM = ['wood', 'fire', 'earth', 'metal', 'water'];
const LABEL = { wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water' };
const P1NOUN = { wood: 'growth', fire: 'warmth', earth: 'ground', metal: 'clarity', water: 'depth' };
const DM = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DM_ELEM = { 甲: 'wood', 乙: 'wood', 丙: 'fire', 丁: 'fire', 戊: 'earth', 己: 'earth', 庚: 'metal', 辛: 'metal', 壬: 'water', 癸: 'water' };

const OBS = {
  A: 'without meaning to, you become someone a room arranges itself around',
  B: 'the people closest to you would say they are most themselves in your company',
  C: 'you’re often the one others come to when they need a way forward without pressure',
  D: 'others describe you as the one who was quietly holding things together',
  E: 'ask anyone who has leaned on you and they’ll tell you they felt steadier for it',
  F: 'people find themselves opening up to you before they’ve decided to',
};

// Per-Day-Master fixed metaphor world.
const D = {
  甲: {
    paired: 'an upright sense of direction and a real willingness to be shaped by what you meet',
    pStrong: 'You grow toward the light rather than away from the wind — which is why you bend without ever breaking.',
    pWeak: 'You’d rather grow slowly toward something real than race toward anything at all — and you always get there.',
    s3Strong: 'Your drive to keep rising can crowd the ones growing beside you; that is not arrogance, it is the cost of being the one who gives everyone around them something to climb toward.',
    s3Weak: 'You can lean so far toward what others need that your own line bends; that is not weakness, it is the cost of being the one others grow straighter beside.',
    s2: {
      wood: 'more of your own green — the room to branch wider rather than only climb higher.',
      fire: 'the warmth that lets your growth flower outward rather than only upward.',
      earth: 'the ground that gives your roots somewhere to hold rather than only reach.',
      metal: 'the clean edge that turns a tall ambition into a finished thing rather than an endless reach.',
      water: 'the source that keeps you green through dry seasons rather than only easy ones.',
    },
  },
  乙: {
    paired: 'a gentle adaptability and a tenacity that never announces itself',
    pStrong: 'You’d rather wrap a wall than break it — and given time, the vine always wins.',
    pWeak: 'You win by yielding rather than by force — the vine outlasts the wall it leans on.',
    s3Strong: 'Your patience can let a wall stand longer than it should; that is not passivity, it is the cost of being the one who outlasts what tried to stop them.',
    s3Weak: 'You can give so much shape to others that your own goes faint; that is not self-erasure, it is the cost of being the one who makes the people around you grow straighter.',
    s2: {
      wood: 'more of your own quiet green — the will to keep climbing rather than only cling.',
      fire: 'the warmth that turns your reaching into blossom rather than only survival.',
      earth: 'the trellis that lets you rise rather than only spread along the ground.',
      metal: 'the edge that gives your softness a spine rather than only a slope.',
      water: 'the rest that lets your flexibility stay a strength rather than thinning into mere accommodation.',
    },
  },
  丙: {
    paired: 'an open generosity and a heat that carries across a space',
    pStrong: 'You light the room you are in rather than the whole sky — and the room is always grateful.',
    pWeak: 'You don’t need the whole sky — a single warm window in the dark is enough to bring people home.',
    s3Strong: 'Your warmth can ask a great deal of the people near it; that is not too much, it is the cost of being the one they keep coming back into the light for.',
    s3Weak: 'You can spend your warmth on everyone but yourself; that is not carelessness, it is the cost of being the window others steer home by.',
    s2: {
      wood: 'the fuel that gives your light something to keep burning for rather than only shine over.',
      fire: 'more of your own daylight — a wider sky to reach for rather than a hotter one.',
      earth: 'the field your warmth can ripen rather than only fall upon.',
      metal: 'the form that lets your brightness be useful rather than only beautiful.',
      water: 'the cool depth that gives your brightness somewhere to settle, so it sustains rather than scorches.',
    },
  },
  丁: {
    paired: 'a fine sensitivity and a focus that holds long after louder fires burn out',
    pStrong: 'You’d rather burn true than burn big — a steady flame outlasts every spectacle.',
    pWeak: 'You are the lamp rather than the bonfire — small, exact, and impossible to lose in the dark.',
    s3Strong: 'Your exactness can ask more of people than they expected; that is not severity, it is the cost of being the one whose light never misleads.',
    s3Weak: 'You can dim yourself to spare others the glare; that is not timidity, it is the cost of being the one whose light makes other people easier to find.',
    s2: {
      wood: 'the steady fuel that keeps your flame from guttering when you give too much of it rather than too little.',
      fire: 'a second wick — the nerve to burn a little brighter rather than only longer.',
      earth: 'the lamp-stand that lets your light hold a room rather than only a hand.',
      metal: 'the lens that focuses your warmth into something exact rather than only gentle.',
      water: 'the still dark that makes your small light matter more rather than less.',
    },
  },
  戊: {
    paired: 'an immovable steadiness and more give than anyone expects of stone',
    pStrong: 'You don’t chase the weather — you’re the ground it all happens on.',
    pWeak: 'You’re steadier than you feel — the mountain doesn’t know its own size until others shelter against it.',
    s3Strong: 'Your steadiness can read as immovable when others want you to bend; that is not stubbornness, it is the cost of being the ground everyone else builds on.',
    s3Weak: 'You can carry more than you let on until it quietly costs you; that is not martyrdom, it is the cost of being the one others lean their whole weight against.',
    s2: {
      wood: 'the green that lets your stillness grow something rather than only stand.',
      fire: 'the warmth that turns your shelter into a hearth rather than only a wall.',
      earth: 'more of your own bedrock — depth to hold rather than only height to show.',
      metal: 'the vein of ore that gives your mass an edge rather than only weight.',
      water: 'the spring that keeps your ground living rather than only solid.',
    },
  },
  己: {
    paired: 'the patience to wait and a quiet stubbornness that keeps you steady when others drift',
    pStrong: 'You don’t try to hold the whole field — you make the one patch of ground around you worth standing on.',
    pWeak: 'You are the kind of steady that is built rather than born — and that is exactly why it is yours.',
    s3Strong: 'The same groundedness others lean on can keep you in one season a beat too long; that is not a flaw, it is the cost of being someone worth leaning on.',
    s3Weak: 'You give the ground so freely that you can forget to keep a place to stand on it; that open-handedness is not a weakness to fix, it is the cost of being the one who makes everyone else feel at home.',
    s2: {
      wood: 'the new direction that turns your steadiness into a place to grow from rather than only a place to rest.',
      fire: 'not drama but warmth, the heat that turns quiet support into something others feel invited by rather than merely held up by.',
      earth: 'more of your own good soil — the depth to nourish rather than only to hold.',
      metal: 'the clear line that lets your care take shape rather than only spread.',
      water: 'the stream that keeps your field giving rather than only enduring.',
    },
  },
  庚: {
    paired: 'an unbending principle and a loyalty that runs deeper than you let on',
    pStrong: 'You would rather be tested than admired — the blade trusts the forge more than the display case.',
    pWeak: 'You’d rather be the quiet blade than the loud one — kept sharp, used rarely, trusted always.',
    s3Strong: 'Your edge can land before your warmth does; that is not coldness, it is the cost of being the one people feel genuinely safe standing behind.',
    s3Weak: 'You can hold your edge back so long that people miss your strength; that is not timidity, it is the cost of being the one who is only ever sharp when it matters.',
    s2: {
      wood: 'the work worth doing, something to cut toward rather than only against.',
      fire: 'the forge that tempers raw strength into something shaped and useful rather than merely hard.',
      earth: 'the ground that gives your weight purpose rather than only force.',
      metal: 'more of your own steel — an edge kept keen rather than only hard.',
      water: 'the quench that gives your strength patience rather than only impact.',
    },
  },
  辛: {
    paired: 'a fine-tuned taste and a resilience that survives far more than it shows',
    pStrong: 'You’d rather be rare than everywhere — one true thing, perfectly cut.',
    pWeak: 'You refine rather than accumulate — one true thing, polished, over a dozen left rough.',
    s3Strong: 'Your standard can be hard to live up to, yourself included; that is not coldness, it is the cost of being the one who only keeps what is real.',
    s3Weak: 'Your eye for the flaw can turn inward too easily; that is not insecurity, it is the cost of being the one whose judgement makes everyone around them better.',
    s2: {
      wood: 'the living thing your polish can serve rather than only adorn.',
      fire: 'the heat that brings out your shine rather than only your hardness.',
      earth: 'the steady ground that lets your precision rest on something solid rather than run on nerve.',
      metal: 'more of your own clarity — a finer cut rather than only a brighter one.',
      water: 'the flow that softens your edges into grace rather than only sharpness.',
    },
  },
  壬: {
    paired: 'a restless momentum and a depth few ever reach the bottom of',
    pStrong: 'You move around obstacles rather than through them — water always finds the lower road home.',
    pWeak: 'You move quietly rather than forcefully — still water runs deeper than anyone guesses.',
    s3Strong: 'Your motion can leave others scrambling to keep up; that is not recklessness, it is the cost of being the one who carries a whole room somewhere new.',
    s3Weak: 'You can run so quietly that people underestimate your depth; that is not smallness, it is the cost of being the one who was deeper than they knew all along.',
    s2: {
      wood: 'the shore that gives your current somewhere to arrive rather than only to run.',
      fire: 'the warmth that lights your depths rather than only stirs them.',
      earth: 'the bank that gives your water direction rather than just force.',
      metal: 'the source that keeps your flow clear rather than only strong.',
      water: 'more of your own depth — a deeper channel rather than only a faster one.',
    },
  },
  癸: {
    paired: 'a soft intuition and a persistence that wears down what force never could',
    pStrong: 'You’d rather soak in slowly than strike — rain reshapes the mountain the storm only batters.',
    pWeak: 'You work like rain rather than like thunder — quiet, patient, and the reason everything is growing.',
    s3Strong: 'Your patience can look like waiting when it is really working; that is not idleness, it is the cost of being the one who reshapes things without a sound.',
    s3Weak: 'You can absorb so much of a room that you lose track of your own weather; that is not weakness, it is the cost of being the one whose quiet makes everyone else feel heard.',
    s2: {
      wood: 'the green that drinks you in, so you nourish rather than only fall.',
      fire: 'the warmth that lifts you into something seen rather than only felt.',
      earth: 'the ground that holds your gift rather than letting it run off.',
      metal: 'the clean source that keeps your sensitivity a gift rather than letting it cloud into worry.',
      water: 'more of your own quiet — depth to draw on rather than only to give.',
    },
  },
};

// Observer assignment: strong → {A,C,D}, weak → {B,E,F}, by dmIndex % 3.
const STRONG_OBS = ['A', 'C', 'D'];
const WEAK_OBS = ['B', 'E', 'F'];

function missingIntro(element, patternIdx) {
  const L = LABEL[element];
  if (patternIdx === 0) return `${L} is the ${P1NOUN[element]} your chart is quietly without —`;
  if (patternIdx === 1) return `What your chart reaches toward is ${L} —`;
  return `The current your chart leaves unopened is ${L} —`;
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const blocks = [];
const obsCount = {};
const introCount = { P1: 0, P2: 0, P3: 0, own: 0 };

DM.forEach((stem, dmIdx) => {
  const d = D[stem];
  const own = DM_ELEM[stem];
  ['strong', 'weak'].forEach((strength) => {
    const obsKey = strength === 'strong' ? STRONG_OBS[dmIdx % 3] : WEAK_OBS[dmIdx % 3];
    const personality = strength === 'strong' ? d.pStrong : d.pWeak;
    const s3 = strength === 'strong' ? d.s3Strong : d.s3Weak;
    ELEM.forEach((element, elemIdx) => {
      const s1 = `You carry both ${d.paired}, and ${OBS[obsKey]}.`;
      let s2;
      if (element === own) {
        s2 = cap(d.s2[element]);
        introCount.own += 1;
      } else {
        const patternIdx = (dmIdx * 5 + elemIdx) % 3;
        s2 = `${missingIntro(element, patternIdx)} ${d.s2[element]}`;
        introCount[`P${patternIdx + 1}`] += 1;
      }
      const reading = `${s1} ${s2} ${s3}`;
      obsCount[obsKey] = (obsCount[obsKey] || 0) + 1;
      blocks.push({ stem, strength, favorable: element, personality, reading });
    });
  });
});

// ── Quote / full-width hygiene check ──
const offenders = [];
for (const b of blocks) {
  for (const [field, text] of [['personality', b.personality], ['reading', b.reading]]) {
    if (/['"]/.test(text)) offenders.push(`STRAIGHT QUOTE in ${b.stem}/${b.strength}/${b.favorable} ${field}`);
    if (/[＀-￯　-〿]/.test(text)) offenders.push(`FULL-WIDTH char in ${b.stem}/${b.strength}/${b.favorable} ${field}`);
  }
}

// ── Emit TS ──
const ts = `/* AUTO-GENERATED by scripts/gen-templates.mjs — do not edit by hand.
 * 100 blocks (10 Day Masters × strong/weak × 5 favourable). Regenerate with:
 *   node scripts/gen-templates.mjs
 */
import type { TemplateBlock } from './templates';

export const GENERATED_TEMPLATES: TemplateBlock[] = ${JSON.stringify(
  blocks.map((b) => ({
    stem: b.stem,
    strength: b.strength,
    favorable: b.favorable,
    personality: { en: b.personality },
    reading: { en: b.reading },
  })),
  null,
  2,
)};
`;
writeFileSync(new URL('../src/lib/bazi/data/templates.generated.ts', import.meta.url), ts);

// ── Report ──
console.log(`Generated ${blocks.length} blocks.`);
console.log('\nObserver-form distribution (blocks):');
for (const k of ['A', 'B', 'C', 'D', 'E', 'F']) console.log(`  ${k}: ${obsCount[k] || 0}`);
console.log('\nMissing-intro distribution (blocks):');
console.log(`  P1 "quietly without": ${introCount.P1}`);
console.log(`  P2 "reaches toward":  ${introCount.P2}`);
console.log(`  P3 "leaves unopened": ${introCount.P3}`);
console.log(`  own-element (no missing framing, strengthen/amplify): ${introCount.own}`);
console.log('\nQuote/full-width check:', offenders.length ? offenders : 'clean ✓');
