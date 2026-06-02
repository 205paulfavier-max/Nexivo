import { Tone } from "./theme";

/**
 * SCRIPT DE LA VIDÉO — L'HISTOIRE DE MITSUBISHI
 *
 * Tout le contenu de la vidéo vit ici. Chaque séquence est découpée en
 * "captions" (sous-titres) avec une durée estimée en secondes.
 *
 * 👉 QUAND LA VOIX-OFF SERA ENREGISTRÉE :
 *    Il suffira d'ajuster le champ `seconds` de chaque caption pour le caler
 *    sur la durée réelle de la diction. Le reste (animations, transitions,
 *    durée totale de la vidéo) se recalcule automatiquement.
 */

export type VisualKind =
  | "logo" // logo aux trois diamants animé
  | "map" // carte du Japon
  | "portrait" // portrait d'époque (placeholder cadre)
  | "montage" // montage rapide d'images
  | "blasons" // fusion des deux blasons
  | "tree" // schéma en arbre du zaibatsu
  | "war" // archives guerre
  | "factText" // texte factuel sobre (séquences graves)
  | "fragment" // bloc qui se fragmente
  | "modern" // montage moderne
  | "title" // carte titre
  | "cta"; // carte d'appel à l'action finale

export type Caption = {
  /** Texte affiché et lu par la voix-off. */
  text: string;
  /** Durée estimée en secondes (à recaler sur la voix réelle). */
  seconds: number;
  /** Indice visuel principal pour ce passage. */
  visual: VisualKind;
  /** Référence(s) de source, ex. "S1" ou "S16, S17". */
  source?: string;
  /** Ligne mise en emphase (zoom / poids fort). */
  emphasis?: boolean;
};

export type Scene = {
  id: string;
  number: number;
  title: string;
  /** Plage horaire indicative issue du script (pour repère humain). */
  timecode: string;
  tone: Tone;
  /** Note de réalisation (visuel global de la séquence). */
  visualNote: string;
  captions: Caption[];
};

export const scenes: Scene[] = [
  // ─────────────────────────────────────────────────────────────
  {
    id: "hook",
    number: 0,
    title: "Accroche",
    timecode: "0:00 – 0:40",
    tone: "intro",
    visualNote: "Gros plan lent sur le logo aux trois diamants, fond sombre.",
    captions: [
      {
        text: "Trois diamants rouges.",
        seconds: 2.4,
        visual: "logo",
        emphasis: true,
      },
      {
        text: "Vous les avez déjà vus mille fois.",
        seconds: 2.6,
        visual: "logo",
      },
      {
        text: "Sur une voiture, sur une climatisation, peut-être sur un ascenseur.",
        seconds: 4.2,
        visual: "montage",
      },
      {
        text: "Mais derrière ce symbole se cache l'un des empires industriels les plus puissants du monde.",
        seconds: 5.5,
        visual: "montage",
      },
      {
        text: "Un groupe qui a construit des navires, des avions de guerre, des banques, des voitures.",
        seconds: 5.5,
        visual: "montage",
      },
      {
        text: "Une entreprise née il y a plus de 150 ans, dans un Japon qui sortait à peine du Moyen Âge.",
        seconds: 5.8,
        visual: "montage",
      },
      {
        text: "MITSUBISHI",
        seconds: 3.0,
        visual: "title",
        emphasis: true,
      },
      {
        text: "Une histoire de génie, de pouvoir, et de zones d'ombre que l'entreprise elle-même a fini par reconnaître.",
        seconds: 6.0,
        visual: "logo",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "man",
    number: 1,
    title: "Un homme parti de rien",
    timecode: "0:40 – 2:30",
    tone: "normal",
    visualNote: "Carte du Japon, île de Shikoku, portrait de Yataro Iwasaki.",
    captions: [
      {
        text: "Pour comprendre Mitsubishi, il faut d'abord parler d'un homme.",
        seconds: 3.8,
        visual: "map",
      },
      {
        text: "Yataro Iwasaki.",
        seconds: 2.2,
        visual: "portrait",
        emphasis: true,
      },
      {
        text: "Il naît en 1835, dans une famille de paysans de la province de Tosa.",
        seconds: 4.6,
        visual: "portrait",
        source: "S1",
      },
      {
        text: "Sa famille avait autrefois un statut de samouraï, mais son arrière-grand-père l'avait vendu pour rembourser des dettes.",
        seconds: 6.5,
        visual: "portrait",
        source: "S2",
      },
      {
        text: "Autrement dit : Iwasaki ne part de rien, ou presque.",
        seconds: 3.6,
        visual: "portrait",
      },
      {
        text: "À cette époque, le Japon vit encore replié sur lui-même, après des siècles d'isolement.",
        seconds: 5.4,
        visual: "map",
      },
      {
        text: "Mais tout est sur le point de basculer.",
        seconds: 3.0,
        visual: "map",
        emphasis: true,
      },
      {
        text: "En 1868, la restauration Meiji renverse l'ancien ordre féodal.",
        seconds: 4.6,
        visual: "montage",
        source: "S3",
      },
      {
        text: "Le nouveau gouvernement veut une chose : rattraper l'Occident.",
        seconds: 4.2,
        visual: "montage",
        source: "S3",
      },
      {
        text: "Iwasaki travaille pour le clan Tosa et gère ses affaires commerciales.",
        seconds: 4.6,
        visual: "portrait",
        source: "S4",
      },
      {
        text: "Quand les domaines féodaux sont dissous, il fait un coup de maître : il récupère à son compte les intérêts maritimes du clan.",
        seconds: 7.0,
        visual: "montage",
        source: "S4",
      },
      {
        text: "En 1870, il fonde sa propre compagnie maritime, avec trois navires à vapeur loués au clan.",
        seconds: 6.0,
        visual: "montage",
        source: "S5",
      },
      {
        text: "C'est le véritable point de départ.",
        seconds: 3.0,
        visual: "montage",
      },
      {
        text: "En mars 1873, l'entreprise prend officiellement son nom : Mitsubishi.",
        seconds: 5.4,
        visual: "logo",
        source: "S6",
        emphasis: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "name",
    number: 2,
    title: "Le nom et le logo",
    timecode: "2:30 – 3:20",
    tone: "normal",
    visualNote: "Décomposition animée du logo, fusion des deux blasons.",
    captions: [
      {
        text: "Le nom « Mitsubishi » signifie, en gros, « trois losanges », ou « trois diamants ».",
        seconds: 5.5,
        visual: "logo",
        source: "S6",
      },
      {
        text: "Et le logo que vous connaissez n'est pas un dessin choisi au hasard.",
        seconds: 4.4,
        visual: "logo",
      },
      {
        text: "C'est la fusion de deux blasons.",
        seconds: 2.8,
        visual: "blasons",
        emphasis: true,
      },
      {
        text: "Le blason du clan Tosa, pour qui Iwasaki a travaillé,",
        seconds: 3.6,
        visual: "blasons",
        source: "S6",
      },
      {
        text: "et le blason de sa propre famille, les Iwasaki.",
        seconds: 3.6,
        visual: "blasons",
        source: "S6",
      },
      {
        text: "Dès le départ, Mitsubishi mélange le pouvoir de l'ancien monde et l'ambition d'un homme nouveau.",
        seconds: 6.0,
        visual: "logo",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "rise",
    number: 3,
    title: "L'ascension et le lien avec l'État",
    timecode: "3:20 – 4:40",
    tone: "epic",
    visualNote: "Navires transportant des troupes, mines, chantier de Nagasaki.",
    captions: [
      {
        text: "Iwasaki a compris une chose essentielle : pour grandir vite, il faut être proche du pouvoir.",
        seconds: 6.0,
        visual: "montage",
      },
      {
        text: "Mitsubishi fournit les navires qui transportent les troupes japonaises à Taïwan.",
        seconds: 5.2,
        visual: "montage",
        source: "S7",
      },
      {
        text: "En échange : davantage de bateaux, et de généreuses subventions de l'État.",
        seconds: 4.8,
        visual: "montage",
        source: "S7",
      },
      {
        text: "Avec ce soutien public, l'entreprise écrase la concurrence et devient la plus grande compagnie maritime du Japon.",
        seconds: 6.5,
        visual: "map",
        source: "S8",
      },
      {
        text: "Mais Iwasaki ne s'arrête pas à la mer.",
        seconds: 2.8,
        visual: "montage",
      },
      {
        text: "Il investit dans les mines de cuivre et de charbon.",
        seconds: 3.6,
        visual: "montage",
        source: "S9",
      },
      {
        text: "Et en 1884, il prend en location le chantier naval de Nagasaki, propriété de l'État.",
        seconds: 5.6,
        visual: "montage",
        source: "S10",
      },
      {
        text: "Ce chantier deviendra plus tard le cœur de Mitsubishi Heavy Industries.",
        seconds: 4.6,
        visual: "montage",
        source: "S10",
      },
      {
        text: "En 1885, Yataro Iwasaki meurt, à seulement 50 ans.",
        seconds: 4.4,
        visual: "portrait",
        source: "S1",
        emphasis: true,
      },
      {
        text: "Mais l'empire ne s'arrête pas avec lui. Il passe à son frère, puis à son fils, puis à son neveu.",
        seconds: 6.0,
        visual: "portrait",
        source: "S11",
      },
      {
        text: "Une dynastie familiale est née.",
        seconds: 3.0,
        visual: "tree",
        emphasis: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "zaibatsu",
    number: 4,
    title: "Le zaibatsu : un empire tentaculaire",
    timecode: "4:40 – 6:00",
    tone: "epic",
    visualNote: "Schéma en arbre, les quatre zaibatsu, montage de puissance.",
    captions: [
      {
        text: "Au début du 20e siècle, Mitsubishi devient ce qu'on appelle un « zaibatsu ».",
        seconds: 5.4,
        visual: "tree",
        emphasis: true,
      },
      {
        text: "Un gigantesque conglomérat contrôlé par une seule famille,",
        seconds: 3.8,
        visual: "tree",
        source: "S12",
      },
      {
        text: "présent dans presque tous les secteurs : banque, mines, industrie, commerce.",
        seconds: 5.0,
        visual: "tree",
        source: "S12",
      },
      {
        text: "Avant la Seconde Guerre mondiale, le Japon est dominé par quatre grands zaibatsu :",
        seconds: 5.0,
        visual: "tree",
        source: "S12",
      },
      {
        text: "Mitsui, Mitsubishi, Sumitomo et Yasuda.",
        seconds: 4.0,
        visual: "tree",
        source: "S12",
        emphasis: true,
      },
      {
        text: "Mitsubishi est le deuxième plus puissant.",
        seconds: 3.0,
        visual: "tree",
        source: "S13",
      },
      {
        text: "À ce stade, Mitsubishi n'est plus une entreprise. C'est une puissance économique à part entière,",
        seconds: 6.0,
        visual: "montage",
      },
      {
        text: "étroitement liée à l'État japonais.",
        seconds: 3.0,
        visual: "montage",
      },
      {
        text: "Et c'est précisément ce lien qui va l'entraîner dans le chapitre le plus sombre de son histoire.",
        seconds: 6.0,
        visual: "montage",
        emphasis: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "war",
    number: 5,
    title: "La guerre, le Zéro et le travail forcé",
    timecode: "6:00 – 8:00",
    tone: "grave",
    visualNote: "Archives Seconde Guerre mondiale, A6M Zero, texte factuel sobre.",
    captions: [
      {
        text: "Pendant la Seconde Guerre mondiale, Mitsubishi Heavy Industries fournit à l'armée japonaise des navires, des armes et des avions.",
        seconds: 7.5,
        visual: "war",
        source: "S14",
      },
      {
        text: "Son produit le plus célèbre : l'avion de chasse A6M, surnommé le « Zéro ».",
        seconds: 5.5,
        visual: "war",
        source: "S14",
        emphasis: true,
      },
      {
        text: "Conçu par l'ingénieur Jiro Horikoshi, c'était le principal chasseur de la marine impériale japonaise.",
        seconds: 6.0,
        visual: "war",
        source: "S14",
      },
      {
        text: "Plus de 10 000 exemplaires seront produits pendant la guerre.",
        seconds: 4.0,
        visual: "war",
        source: "S15",
      },
      {
        text: "Parce qu'elles produisaient ce matériel, les usines Mitsubishi devinrent des cibles prioritaires pour les Alliés.",
        seconds: 6.5,
        visual: "war",
        source: "S14",
      },
      {
        text: "Dans une seule usine, près de 500 ouvriers moururent en une seule semaine de bombardements.",
        seconds: 6.0,
        visual: "war",
        source: "S14",
      },
      {
        text: "Mais il y a un fait que cette vidéo ne peut pas passer sous silence.",
        seconds: 4.5,
        visual: "factText",
        emphasis: true,
      },
      {
        text: "Pendant la guerre, la branche minière de Mitsubishi a utilisé du travail forcé.",
        seconds: 5.0,
        visual: "factText",
        source: "S14",
        emphasis: true,
      },
      {
        text: "Des prisonniers de guerre alliés, ainsi que des travailleurs coréens et chinois, ont été contraints de travailler dans ses mines, dans des conditions terribles.",
        seconds: 8.0,
        visual: "factText",
        source: "S14",
      },
      {
        text: "Environ 500 prisonniers de guerre américains ont été utilisés comme travailleurs forcés, entre 1943 et 1945.",
        seconds: 6.5,
        visual: "factText",
        source: "S16",
      },
      {
        text: "Il faudra attendre 2015 pour que Mitsubishi Materials présente des excuses officielles à d'anciens prisonniers américains.",
        seconds: 7.0,
        visual: "factText",
        source: "S16, S17",
      },
      {
        text: "C'était la première fois qu'une entreprise japonaise faisait une telle démarche.",
        seconds: 4.6,
        visual: "factText",
        source: "S16, S17",
        emphasis: true,
      },
      {
        text: "L'entreprise a aussi présenté des excuses à des travailleurs forcés chinois.",
        seconds: 4.4,
        visual: "factText",
        source: "S18",
      },
      {
        text: "Et en 2018, la Cour suprême de Corée du Sud a condamné Mitsubishi Heavy Industries à indemniser des Coréens soumis au travail forcé.",
        seconds: 7.5,
        visual: "factText",
        source: "S19",
      },
      {
        text: "Comprendre une grande entreprise, c'est aussi regarder ces pages-là en face.",
        seconds: 5.0,
        visual: "factText",
        emphasis: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "fall",
    number: 6,
    title: "La chute, puis la renaissance",
    timecode: "8:00 – 9:10",
    tone: "hopeful",
    visualNote: "Occupation 1945-46, fragmentation, reconstruction du Japon.",
    captions: [
      {
        text: "Le Japon perd la guerre.",
        seconds: 2.4,
        visual: "fragment",
      },
      {
        text: "Et les vainqueurs veulent briser les zaibatsu, ces empires jugés trop liés à l'effort de guerre.",
        seconds: 6.0,
        visual: "fragment",
      },
      {
        text: "En 1946, sur ordre des forces alliées, Mitsubishi est démantelé.",
        seconds: 4.6,
        visual: "fragment",
        source: "S20",
        emphasis: true,
      },
      {
        text: "En 1950, Mitsubishi Heavy Industries est découpé en trois sociétés distinctes.",
        seconds: 5.0,
        visual: "fragment",
        source: "S21",
      },
      {
        text: "L'empire unifié n'existe plus.",
        seconds: 2.8,
        visual: "fragment",
      },
      {
        text: "Mais voici le plus fascinant.",
        seconds: 2.6,
        visual: "modern",
        emphasis: true,
      },
      {
        text: "Au lieu de disparaître, les entreprises issues de Mitsubishi se regroupent peu à peu sous une nouvelle forme : le « keiretsu ».",
        seconds: 7.5,
        visual: "modern",
        source: "S20",
      },
      {
        text: "En 1954, Mitsubishi Corporation est reconstituée,",
        seconds: 3.6,
        visual: "modern",
        source: "S20",
      },
      {
        text: "et les dirigeants des grandes sociétés se remettent à se réunir, lors d'une rencontre mensuelle surnommée la « Conférence du vendredi ».",
        seconds: 8.0,
        visual: "modern",
        source: "S20",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "today",
    number: 7,
    title: "Mitsubishi aujourd'hui",
    timecode: "9:10 – 9:50",
    tone: "normal",
    visualNote: "Montage moderne : voiture, gratte-ciels de Tokyo, logos des branches.",
    captions: [
      {
        text: "Aujourd'hui, Mitsubishi n'est pas une seule entreprise.",
        seconds: 3.6,
        visual: "modern",
      },
      {
        text: "C'est un ensemble de sociétés indépendantes qui partagent le même nom et le même logo, sans maison mère unique.",
        seconds: 7.0,
        visual: "modern",
        source: "S20",
      },
      {
        text: "On y trouve l'industrie lourde, la banque, l'électronique, la chimie.",
        seconds: 4.6,
        visual: "modern",
      },
      {
        text: "Mitsubishi Motors, la branche automobile que beaucoup connaissent, n'a été créée qu'en 1970.",
        seconds: 6.0,
        visual: "modern",
        source: "S22",
      },
      {
        text: "Ensemble, ces sociétés emploient plus d'un million de personnes dans le monde.",
        seconds: 5.0,
        visual: "modern",
        source: "S23",
        emphasis: true,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  {
    id: "conclusion",
    number: 8,
    title: "Conclusion",
    timecode: "9:50 – 10:20",
    tone: "outro",
    visualNote: "Retour au logo aux trois diamants, carte de fin / CTA.",
    captions: [
      {
        text: "De trois bateaux loués, à un empire d'un million d'employés.",
        seconds: 4.4,
        visual: "logo",
        emphasis: true,
      },
      {
        text: "L'histoire de Mitsubishi, c'est l'histoire du Japon moderne lui-même :",
        seconds: 4.4,
        visual: "logo",
      },
      {
        text: "une ascension fulgurante, une alliance avec le pouvoir, une catastrophe, puis une renaissance.",
        seconds: 6.0,
        visual: "logo",
      },
      {
        text: "Trois diamants. Un siècle et demi d'histoire. Et bien plus qu'un simple logo.",
        seconds: 5.5,
        visual: "logo",
        emphasis: true,
      },
      {
        text: "Dis-moi en commentaire quelle entreprise tu veux que je raconte ensuite. Total ? Samsung ? Nestlé ?",
        seconds: 6.5,
        visual: "cta",
      },
    ],
  },
];

/** Petit utilitaire : durée totale estimée de la vidéo, en secondes. */
export const totalSeconds = scenes.reduce(
  (acc, scene) =>
    acc + scene.captions.reduce((s, c) => s + c.seconds, 0),
  0,
);
