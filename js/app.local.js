(function () {
  var SUITS = ["red", "green", "yellow", "orange"];
  var SUIT_LABEL = {
    red: "Red",
    green: "Green",
    yellow: "Yellow",
    orange: "Orange"
  };
  var DEFAULT_PLAYER_NAMES = ["You", "Bea", "Mae", "Cal", "Roy"];
  var PLAYER_NAMES = DEFAULT_PLAYER_NAMES.slice();
  var RULESETS = {
    kentuckyHouse: {
      id: "kentuckyHouse",
      label: "Kentucky House Rules",
      playerCount: 4,
      handSize: 13,
      kittySize: 5,
      includedRanks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      minBid: 100,
      maxBid: 200,
      bidStep: 5,
      matchTarget: 500,
      openingLeader: "bidder",
      setupFlow: "standard",
      teamMode: "fixedPartnership",
      contractScoring: "setback",
      rookMode: "house",
      redOneAlwaysTrump: false,
      lastTrickBonus: 20,
      scoring: {
        rook: 20,
        rank1: 15,
        rank14: 10,
        rank10: 10,
        rank5: 5
      }
    },
    fivePlayerCallPartner: {
      id: "fivePlayerCallPartner",
      label: "5-Player Call Partner",
      playerCount: 5,
      handSize: 10,
      kittySize: 7,
      includedRanks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      minBid: 80,
      maxBid: 200,
      bidStep: 5,
      matchTarget: 400,
      openingLeader: "bidder",
      setupFlow: "callPartner",
      teamMode: "calledPartner",
      contractScoring: "setback",
      rookMode: "house",
      redOneAlwaysTrump: false,
      lastTrickBonus: 20,
      scoring: {
        rook: 20,
        rank1: 15,
        rank14: 10,
        rank10: 10,
        rank5: 5
      }
    },
    westernKentucky: {
      id: "westernKentucky",
      label: "Western Kentucky",
      playerCount: 4,
      handSize: 10,
      kittySize: 5,
      includedRanks: [1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      minBid: 100,
      maxBid: 200,
      bidStep: 5,
      matchTarget: 500,
      openingLeader: "bidder",
      setupFlow: "standard",
      teamMode: "fixedPartnership",
      contractScoring: "setback",
      rookMode: "house",
      redOneAlwaysTrump: true,
      lastTrickBonus: 20,
      scoring: {
        rook: 20,
        rank1: 15,
        rank14: 10,
        rank10: 10,
        rank5: 5
      }
    },
    tournament: {
      id: "tournament",
      label: "Tournament Rook",
      playerCount: 4,
      handSize: 9,
      kittySize: 5,
      includedRanks: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      minBid: 70,
      maxBid: 120,
      bidStep: 5,
      matchTarget: 300,
      openingLeader: "leftOfDealer",
      setupFlow: "standard",
      teamMode: "fixedPartnership",
      contractScoring: "setback",
      rookMode: "official",
      redOneAlwaysTrump: false,
      lastTrickBonus: 0,
      scoring: {
        rook: 20,
        rank1: 0,
        rank14: 10,
        rank10: 10,
        rank5: 5
      }
    },
    woodsonPatrick: {
      id: "woodsonPatrick",
      label: "Woodson Patrick",
      playerCount: 4,
      handSize: 6,
      kittySize: 3,
      includedRanks: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      minBid: 65,
      maxBid: 120,
      bidStep: 5,
      matchTarget: 300,
      openingLeader: "bidder",
      setupFlow: "woodson",
      teamMode: "fixedPartnership",
      contractScoring: "none",
      rookMode: "highestTrump",
      redOneAlwaysTrump: false,
      lastTrickBonus: 0,
      scoring: {
        rook: 20,
        rank1: 0,
        rank14: 10,
        rank10: 10,
        rank5: 5
      }
    }
  };
  var GAME_TYPES = {
    kentuckyHouse: {
      id: "kentuckyHouse",
      label: "Kentucky Rook - House Rules",
      detail: "The current live version of the game.",
      seatCount: 3,
      partnerSeat: 1,
      rulesetId: "kentuckyHouse"
    },
    fivePlayerCallPartner: {
      id: "fivePlayerCallPartner",
      label: "5-Player Call Partner",
      detail: "5-player hidden-partner Rook with a 7-card nest and round-only partnerships.",
      seatCount: 4,
      partnerSeat: null,
      rulesetId: "fivePlayerCallPartner"
    },
    westernKentucky: {
      id: "westernKentucky",
      label: "Western Kentucky",
      detail: "House Rules shape with a trimmed deck and the Red 1 always high trump.",
      seatCount: 3,
      partnerSeat: 1,
      rulesetId: "westernKentucky"
    },
    tournament: {
      id: "tournament",
      label: "Tournament",
      detail: "Official Kentucky Discard tournament rules with the 41-card deck.",
      seatCount: 3,
      partnerSeat: 1,
      rulesetId: "tournament"
    }
  };
  var RULESET_GUIDES = {
    kentuckyHouse: {
      summary: "57-card, big point team play.",
      sections: [
        {
          title: "Overview",
          rows: [
            ["Players", "4 players, fixed partners"],
            ["Match", "First team to 500 wins"],
            ["Round feel", "Big counter swings and full-deck hands"]
          ]
        },
        {
          title: "Deck And Deal",
          rows: [
            ["Deck", "Full 57-card deck with the Rook"],
            ["Deal", "13 cards each plus a 5-card kitty"],
            ["Counters", "1=15, 14=10, 10=10, 5=5, Rook=20, last trick=20"]
          ]
        },
        {
          title: "Bidding And Play",
          rows: [
            ["Bid range", "100 to 200 by 5"],
            ["Setup", "Bid winner takes the kitty, buries 5, then names trump"],
            ["Rook", "Acts as trump at 10.5 in House Rules ordering"]
          ]
        }
      ]
    },
    fivePlayerCallPartner: {
      summary: "57-card hidden-partner Rook.",
      sections: [
        {
          title: "Overview",
          rows: [
            ["Players", "5 players, round-only hidden partnership"],
            ["Match", "First individual player to 400 wins"],
            ["Teams", "Bidder plus called partner versus the other 3"]
          ]
        },
        {
          title: "Deck And Deal",
          rows: [
            ["Deck", "Full 57-card deck with the Rook"],
            ["Deal", "10 cards each plus a 7-card nest"],
            ["Counters", "Same counters and last-trick bonus as House Rules"]
          ]
        },
        {
          title: "Bidding And Partner Call",
          rows: [
            ["Bid range", "80 to 200 by 5"],
            ["Setup", "Bidder takes the nest, buries back to 10, then declares trump"],
            ["Partner call", "After trump, bidder names any card not in hand or the final kitty"],
            ["Lead option", "Bidder may ask the called partner to lead the first trick"]
          ]
        }
      ]
    },
    westernKentucky: {
      summary: "Trimmed-deck house rules + Red 1.",
      sections: [
        {
          title: "Overview",
          rows: [
            ["Players", "4 players, fixed partners"],
            ["Match", "First team to 500 wins"],
            ["Base", "Same flow and scoring shape as House Rules"]
          ]
        },
        {
          title: "Deck And Deal",
          rows: [
            ["Deck", "Remove the 2, 3, and 4 from each suit"],
            ["Deal", "10 cards each plus a 5-card kitty"],
            ["Counters", "Same counters and last-trick bonus as House Rules"]
          ]
        },
        {
          title: "Special Rule",
          rows: [
            ["Red 1", "Always counts as trump and is the highest trump"],
            ["Rook", "Next-highest trump after the Red 1"],
            ["Everything else", "House Rules ordering and setback scoring"]
          ]
        }
      ]
    },
    tournament: {
      summary: "Official 41-card tourney.",
      sections: [
        {
          title: "Overview",
          rows: [
            ["Players", "4 players, fixed partners"],
            ["Match", "First team to 300 wins"],
            ["Style", "More standardized, trimmed-deck tournament play"]
          ]
        },
        {
          title: "Deck And Deal",
          rows: [
            ["Deck", "41-card deck: 5 through 14 in each color plus the Rook"],
            ["Deal", "9 cards each plus a 5-card nest"],
            ["Counters", "5=5, 10=10, 14=10, Rook=20, no last-trick bonus"]
          ]
        },
        {
          title: "Bidding And Play",
          rows: [
            ["Bid range", "70 to 120 by 5"],
            ["Lead", "Opening lead starts left of dealer"],
            ["Rook", "Highest trump under tournament handling"]
          ]
        }
      ]
    }
  };
  var DEFAULT_GAME_TYPE_ID = "kentuckyHouse";
  var DEFAULT_RULESET_ID = "kentuckyHouse";
  var MAX_PLAYER_COUNT = 5;
  var MAX_PLAYERS = [0, 1, 2, 3, 4];
  var DEAL_STICKER_COUNT = 5;
  var DEAL_ANIMATION_STEP = 400;
  var DEAL_COMPLETE_HOLD_DELAY = 250;
  var BID_DELAY = 1200;
  var AI_DELAY = 700;
  var TRICK_DELAY = 1200;
  var TRICK_WINNER_REVEAL_DELAY = 140;
  var SCORING_REVEAL_DELAY = 220;
  var SCORING_COLUMN_STAGGER_DELAY = 1180;
  var SCORING_OUTCOME_DELAY = 980;
  var SCORING_TOTAL_DELAY = 2600;
  var SCORE_METER_MAX = 200;
  var ROSTER_AVATAR_STYLE = {
    mae: "avatar-mae",
    cal: "avatar-cal",
    bea: "avatar-bea",
    june: "avatar-roy",
    duke: "avatar-zoe",
    ruth: "avatar-kai"
  };
  var CLOSE_WIN_MARGIN = 50;
  var SUMMARY_CLOSE_CALL_MARGIN = 10;
  var STICKER_DISPLAY_DURATION = 1500;
  var STICKER_COOLDOWN = 260;
  var PLAYER_REACTION_COOLDOWN = 1800;
  var PLAY_REACTION_DURATION = 2200;
  var ACHIEVEMENT_TOAST_DURATION = 3400;
  var BIG_TRICK_THRESHOLD = 30;
  var AI_PLAY_REACTION_COPY = {
    rook: [
      "rook's out.",
      "there it is.",
      "okay, now we're talking.",
      "that changes things."
    ],
    big_trick: [
      "big points.",
      "that was a swing.",
      "spicy trick.",
      "well, that moved things."
    ]
  };
  var MATCH_SUMMARY_GIF_CONFIG = {
    win: [
      "img/gifs/bg-gif-winning-liz.gif",
      "img/gifs/bg-gif-winning.gif",
      "img/gifs/bg-gif-winning-2.gif"
    ],
    loss: [
      "img/gifs/bg-gif-losing-homer.gif",
      "img/gifs/bg-gif-losing-ohno.gif",
      "img/gifs/bg-gif-losing-steph.gif"
    ]
  };
  var STICKER_CONFIG = {
    rook: {
      assets: [
        "img/stickers/rook-caw.png"
      ],
      size: "large",
      intensity: "light",
      duration: STICKER_DISPLAY_DURATION
    },
    big_trick: {
      assets: [
        "img/stickers/big-trick-cool.png",
        "img/stickers/big-trick-dance.png",
        "img/stickers/big-trick-parrot.png",
        "img/stickers/big-trick-pop-tart.png"
      ],
      size: "medium",
      intensity: "light",
      duration: STICKER_DISPLAY_DURATION
    },
    bid_set: {
      assets: [
        "img/stickers/bid-set-britney.png",
        "img/stickers/bid-set-pain.png",
        "img/stickers/bid-set-suffering.png",
        "img/stickers/bid-set-tears.png"
      ],
      size: "large",
      intensity: "medium",
      duration: STICKER_DISPLAY_DURATION
    },
    bid_made: {
      assets: [
        "img/stickers/bid-made-bday-dog.png",
        "img/stickers/bid-made-doge.png",
        "img/stickers/bid-made-my-day.png",
        "img/stickers/bid-made-shaq.png"
      ],
      size: "medium",
      intensity: "light",
      duration: STICKER_DISPLAY_DURATION
    },
    game_win: {
      assets: [
        "img/stickers/game-win-fire.png",
        "img/stickers/game-win-jonah.png",
        "img/stickers/game-win-yaas.png"
      ],
      size: "large",
      intensity: "medium",
      duration: STICKER_DISPLAY_DURATION
    }
  };
  var SUMMARY_STICKER_CONFIG = {
    summary_win: [
      "img/stickers/summary-win.png",
      "img/stickers/summary-win-lsp.png"
    ],
    summary_close_call: [
      "img/stickers/summary-close-call.png"
    ],
    summary_self_loss: [
      "img/stickers/summary-self-loss.png"
    ],
    summary_team_loss: [
      "img/stickers/summary-team-loss.png",
      "img/stickers/summary-team-loss-facepalm.png"
    ]
  };
  var ACHIEVEMENT_STICKER_ASSETS = {
    first_match_win: ["img/stickers/sticker-feather.png"],
    contract_clutch: ["img/stickers/sticker-sunglasses-2.png"],
    perfect_200: ["img/stickers/sticker-big-mac.png"],
    ice_water: ["img/stickers/sticker-sunglasses-1.png"],
    perfect_partner: ["img/stickers/sticker-teamwork.png"],
    max_pressure: ["img/stickers/sticker-cool.png"],
    unshakeable: ["img/stickers/sticker-snail-persist.png"]
  };
  var COLLECTION_STICKER_ASSET = "img/sticker-book-rook.png";
  var ACHIEVEMENT_DEFS = [
    {
      id: "first_match_win",
      title: "First Feather",
      description: "Win your first completed match.",
      stickerPool: ACHIEVEMENT_STICKER_ASSETS.first_match_win
    },
    {
      id: "bid_caller",
      title: "Bid Caller",
      description: "Win 5 bids.",
      stickerPool: STICKER_CONFIG.bid_made.assets
    },
    {
      id: "contract_clutch",
      title: "Contract Clutch",
      description: "Make 3 bids successfully.",
      stickerPool: ACHIEVEMENT_STICKER_ASSETS.contract_clutch
    },
    {
      id: "set_em_up",
      title: "Set 'Em Up",
      description: "Set opponents 3 times.",
      stickerPool: STICKER_CONFIG.bid_set.assets
    },
    {
      id: "big_round",
      title: "Big Round Energy",
      description: "Score 100 or more points in a round.",
      stickerPool: STICKER_CONFIG.big_trick.assets
    },
    {
      id: "perfect_200",
      title: "Perfect 200",
      description: "Make a 200 bid once.",
      stickerPool: ACHIEVEMENT_STICKER_ASSETS.perfect_200
    },
    {
      id: "close_shave",
      title: "Close Shave",
      description: "Win a match by 50 points or fewer.",
      stickerPool: SUMMARY_STICKER_CONFIG.summary_close_call
    },
    {
      id: "comeback_kid",
      title: "Comeback Kid",
      description: "Win a match after trailing along the way.",
      stickerPool: SUMMARY_STICKER_CONFIG.summary_win
    },
    {
      id: "century_club",
      title: "Century Club",
      description: "Score 150 or more points in a single round.",
      stickerPool: STICKER_CONFIG.big_trick.assets
    },
    {
      id: "double_century",
      title: "Double Century",
      description: "Win a match with 600 or more points.",
      stickerPool: STICKER_CONFIG.game_win.assets
    },
    {
      id: "lockdown_defense",
      title: "Lockdown Defense",
      description: "Set the opposing bidder in 3 matches in a row.",
      stickerPool: STICKER_CONFIG.bid_set.assets
    },
    {
      id: "ice_water",
      title: "Ice Water",
      description: "Make a bid within 5 points of the target.",
      stickerPool: ACHIEVEMENT_STICKER_ASSETS.ice_water
    },
    {
      id: "no_mercy",
      title: "No Mercy",
      description: "Win a match by 150 or more points.",
      stickerPool: SUMMARY_STICKER_CONFIG.summary_win
    },
    {
      id: "hot_hand",
      title: "Hot Hand",
      description: "Win 5 matches in a row.",
      stickerPool: STICKER_CONFIG.game_win.assets
    },
    {
      id: "bounce_back",
      title: "Bounce Back",
      description: "Win a match immediately after a loss.",
      stickerPool: SUMMARY_STICKER_CONFIG.summary_win
    },
    {
      id: "perfect_partner",
      title: "Perfect Partner",
      description: "Win 10 matches with the same teammate profile.",
      stickerPool: ACHIEVEMENT_STICKER_ASSETS.perfect_partner
    },
    {
      id: "nemesis",
      title: "Nemesis",
      description: "Beat the same opponent profile 10 times.",
      stickerPool: STICKER_CONFIG.bid_set.assets
    },
    {
      id: "across_the_spectrum",
      title: "Across the Spectrum",
      description: "Make a successful bid in every trump color.",
      stickerPool: STICKER_CONFIG.bid_made.assets
    },
    {
      id: "max_pressure",
      title: "Max Pressure",
      description: "Win the bid at 200 five times.",
      stickerPool: ACHIEVEMENT_STICKER_ASSETS.max_pressure
    },
    {
      id: "unshakeable",
      title: "Unshakeable",
      description: "Complete 25 matches.",
      stickerPool: ACHIEVEMENT_STICKER_ASSETS.unshakeable
    }
  ];
  var MINI_STICKER_DEFS = {
    first_match_win: {
      label: "First win",
      assetPool: ACHIEVEMENT_STICKER_ASSETS.first_match_win
    },
    close_win: {
      label: "Close win",
      assetPool: SUMMARY_STICKER_CONFIG.summary_close_call
    },
    comeback_win: {
      label: "Comeback win",
      assetPool: SUMMARY_STICKER_CONFIG.summary_win
    },
    perfect_200: {
      label: "Perfect 200",
      assetPool: ACHIEVEMENT_STICKER_ASSETS.perfect_200
    },
    opponent_set: {
      label: "Opponent set",
      assetPool: STICKER_CONFIG.bid_set.assets
    },
    streak_3: {
      label: "3 match streak",
      assetPool: STICKER_CONFIG.rook.assets
    }
  };
  // AI weights are profile-driven so we can swap personalities without rewriting decisions.
  var AI_PROFILES = {
    steady: {
      bidAggression: 1.0,
      riskBias: 0.95,
      safetyBias: 1.15,
      partnerTrust: 1.2,
      captureBias: 1.0,
      disruptionBias: 0.95,
      trumpPressure: 0.95,
      scoringProtection: 1.15,
      discardPragmatism: 1.0,
      contractLockBias: 1.2,
      extraPointGreed: 0.9,
      denialBias: 1.0,
      closerBias: 1.2
    },
    bold: {
      bidAggression: 1.15,
      riskBias: 1.2,
      safetyBias: 0.9,
      partnerTrust: 0.9,
      captureBias: 1.2,
      disruptionBias: 1.0,
      trumpPressure: 1.15,
      scoringProtection: 0.9,
      discardPragmatism: 0.95,
      contractLockBias: 0.9,
      extraPointGreed: 1.15,
      denialBias: 0.9,
      closerBias: 0.9
    },
    disruptor: {
      bidAggression: 1.05,
      riskBias: 1.0,
      safetyBias: 1.0,
      partnerTrust: 1.05,
      captureBias: 1.05,
      disruptionBias: 1.25,
      trumpPressure: 1.05,
      scoringProtection: 1.0,
      discardPragmatism: 1.1,
      contractLockBias: 1.0,
      extraPointGreed: 1.0,
      denialBias: 1.25,
      closerBias: 1.0
    },
    careful: {
      bidAggression: 0.88,
      riskBias: 0.8,
      safetyBias: 1.25,
      partnerTrust: 1.15,
      captureBias: 0.95,
      disruptionBias: 0.9,
      trumpPressure: 0.88,
      scoringProtection: 1.22,
      discardPragmatism: 1.1,
      contractLockBias: 1.25,
      extraPointGreed: 0.82,
      denialBias: 1.0,
      closerBias: 1.15
    },
    greedy: {
      bidAggression: 1.1,
      riskBias: 1.12,
      safetyBias: 0.92,
      partnerTrust: 0.85,
      captureBias: 1.25,
      disruptionBias: 1.05,
      trumpPressure: 1.12,
      scoringProtection: 0.92,
      discardPragmatism: 0.88,
      contractLockBias: 0.88,
      extraPointGreed: 1.28,
      denialBias: 0.95,
      closerBias: 0.95
    },
    loyal: {
      bidAggression: 0.95,
      riskBias: 0.9,
      safetyBias: 1.05,
      partnerTrust: 1.32,
      captureBias: 0.94,
      disruptionBias: 0.92,
      trumpPressure: 0.95,
      scoringProtection: 1.12,
      discardPragmatism: 1.08,
      contractLockBias: 1.15,
      extraPointGreed: 0.88,
      denialBias: 1.0,
      closerBias: 1.08
    }
  };
  var AI_STYLE_LABELS = {
    steady: "Steady",
    bold: "Bold",
    disruptor: "Tricky",
    careful: "Careful",
    greedy: "Greedy",
    loyal: "Loyal"
  };
  var AI_PERSONAS = [
    { id: "mae", name: "Mae", descriptor: "Bold", styleId: "bold" },
    { id: "cal", name: "Cal", descriptor: "Tricky", styleId: "disruptor" },
    { id: "bea", name: "Bea", descriptor: "Steady", styleId: "steady" },
    { id: "june", name: "Roy", descriptor: "Careful", styleId: "careful" },
    { id: "duke", name: "Zoe", descriptor: "Greedy", styleId: "greedy" },
    { id: "ruth", name: "Kai", descriptor: "Loyal", styleId: "loyal" }
  ];
  var AI_PERSONA_BY_ID = AI_PERSONAS.reduce(function (lookup, persona) {
    lookup[persona.id] = persona;
    return lookup;
  }, {});
  var DEFAULT_MATCH_AI_PERSONA_IDS = ["mae", "cal", "bea", "june"];
  var AI_STYLE_BY_PLAYER = [null, "steady", "bold", "disruptor", "careful"];
  var AI_TUNING_KEYS = [
    "bidAggression",
    "riskBias",
    "safetyBias",
    "partnerTrust",
    "disruptionBias"
  ];
  var AI_TUNING_LABELS = {
    bidAggression: "Bid Aggression",
    riskBias: "Risk",
    safetyBias: "Safety",
    partnerTrust: "Partner Trust",
    disruptionBias: "Disruption"
  };
  var BACKGROUND_THEMES = {
    sunset: {
      label: "Sunset",
      asset: "img/bg-sunset.png"
    },
    whiteWaves: {
      label: "White Waves",
      asset: "img/bg-white-waves.png"
    },
    blueLines: {
      label: "Blue Lines",
      asset: "img/bg-blue-lines.png"
    },
    chips: {
      label: "Chips",
      asset: "img/bg-chips.png"
    },
    business: {
      label: "Business",
      asset: "img/bg-business.png"
    }
  };
  var TABLETOP_THEMES = {
    felt: {
      label: "Felt",
      asset: "img/tabletop-felt.png",
      style: "plain"
    },
    classicFelt: {
      label: "Classic Felt",
      asset: "img/tabletop-felt.png",
      style: "classic"
    },
    aquarium: {
      label: "Aquarium",
      asset: "img/tabletop-aquarium.png",
      style: "classic"
    },
    granite: {
      label: "Granite",
      asset: "img/tabletop-granite.png",
      style: "classic"
    },
    grass: {
      label: "Grass",
      asset: "img/tabletop-grass.png",
      style: "classic"
    },
    spaghetti: {
      label: "Spaghetti",
      asset: "img/tabletop-spaghetti.png",
      style: "classic"
    }
  };
  var DEFAULT_BACKGROUND_THEME_ID = "sunset";
  var DEFAULT_TABLETOP_THEME_ID = "classicFelt";
  var APP_VERSION = "v0.8.0";
  var STORAGE_SCHEMA_VERSION = 2;
  var PROFILE_STORAGE_KEY = "kentucky-rook.profile";
  var ACTIVE_MATCH_STORAGE_KEY = "kentucky-rook.active-match";
  var PERSISTED_STATE_KEYS = [
    "phase",
    "gameTypeId",
    "rulesetId",
    "setupSeatPersonaIds",
    "matchAiPersonaIds",
    "dealer",
    "roundNumber",
    "bidder",
    "winningBid",
    "trump",
    "trumpStage",
    "callPartnerCardId",
    "callPartnerPlayer",
    "callPartnerRevealed",
    "askPartnerToLead",
    "pendingCallPartnerCardId",
    "pendingAskPartnerToLead",
    "selectedTrump",
    "selectedBid",
    "currentBid",
    "currentBidHolder",
    "currentBidTurn",
    "bidEntries",
    "bidStatuses",
    "passed",
    "initialHands",
    "kitty",
    "buriedKitty",
    "kittyReviewHand",
    "selectedDiscards",
    "exchangeOrder",
    "exchangeIndex",
    "exchangeSwapsUsed",
    "exchangeSelectedHandCardId",
    "exchangeSelectedKittyCardId",
    "hands",
    "trick",
    "leadSuit",
    "currentPlayer",
    "winningCardPlayer",
    "playerPoints",
    "roundPoints",
    "matchPoints",
    "individualMatchPoints",
    "callPartnerStandingOrder",
    "previousCallPartnerStandingOrder",
    "trickCounts",
    "roundMessage",
    "summary",
    "scoringInterstitial",
    "scoringMeterProgress",
    "scoringOutcomeVisible",
    "summaryStep",
    "summaryMatchGif",
    "summaryScoringOpen",
    "matchOpponentSetRounds",
    "aiTrumpReady",
    "biddingComplete",
    "biddingStarted",
    "roundHistory",
    "completedTricks",
    "previousTrick",
    "gameOver",
    "matchId",
    "matchStartedAt",
    "matchMaxDeficit",
    "profileRoundsTracked",
    "profileMatchCompleteRecorded"
  ];

  var ui = {};
  var state = createState();
  var profile = createProfile();
  var savedMatchMeta = null;
  var matchPersistence = null;

  function createState() {
    return {
      phase: "welcome",
      gameTypeId: DEFAULT_GAME_TYPE_ID,
      rulesetId: DEFAULT_RULESET_ID,
      setupSeatPersonaIds: [],
      matchAiPersonaIds: DEFAULT_MATCH_AI_PERSONA_IDS.slice(),
      dealer: 0,
      roundNumber: 1,
      bidder: null,
      winningBid: null,
      trump: null,
      trumpStage: "setup",
      callPartnerCardId: null,
      callPartnerPlayer: null,
      callPartnerRevealed: false,
      askPartnerToLead: false,
      pendingCallPartnerCardId: null,
      pendingAskPartnerToLead: false,
      selectedTrump: null,
      selectedBid: RULESETS[DEFAULT_RULESET_ID].minBid,
      currentBid: null,
      currentBidHolder: null,
      currentBidTurn: 0,
      bidEntries: [],
      bidStatuses: ["-", "-", "-", "-", "-"],
      passed: [false, false, false, false, false],
      initialHands: [[], [], [], [], []],
      kitty: [],
      buriedKitty: [],
      kittyReviewHand: [],
      selectedDiscards: [],
      exchangeOrder: [],
      exchangeIndex: 0,
      exchangeSwapsUsed: [0, 0, 0, 0, 0],
      exchangeSelectedHandCardId: null,
      exchangeSelectedKittyCardId: null,
      hands: [[], [], [], [], []],
      trick: [],
      leadSuit: null,
      currentPlayer: 0,
      winningCardPlayer: null,
      playerPoints: [0, 0, 0, 0, 0],
      roundPoints: [0, 0],
      matchPoints: [0, 0],
      individualMatchPoints: [0, 0, 0, 0, 0],
      callPartnerStandingOrder: null,
      previousCallPartnerStandingOrder: null,
      trickCounts: [0, 0],
      roundMessage: "",
      summary: null,
      scoringInterstitial: null,
      scoringMeterProgress: [0, 0],
      scoringOutcomeVisible: false,
      summaryStep: 1,
      summaryMatchGif: null,
      summaryScoringOpen: false,
      matchOpponentSetRounds: 0,
      aiTrumpReady: false,
      aiTrumpMeterStarted: false,
      dealAnimating: true,
      dealVisibleCount: 0,
      dealSeatCounts: [0, 0, 0, 0],
      dealRevealed: false,
      dealRevealAnimating: false,
      biddingComplete: false,
      biddingStarted: false,
      teamOnlyBidAnchor: null,
      teamOnlyBidTeam: null,
      menuOpen: false,
      menuView: "hub",
      historyOpen: false,
      setupRulesOpen: false,
      roundHistory: [],
      completedTricks: [],
      previousTrick: null,
      gameOver: false,
      matchId: null,
      matchStartedAt: null,
      matchMaxDeficit: 0,
      stickerBookPage: "achievements",
      profileRoundsTracked: 0,
      profileMatchCompleteRecorded: false,
      achievementToastQueue: [],
      achievementToastCurrent: null,
      achievementToastExiting: false,
      achievementToastTimeoutId: null,
      setupPreviewPersonaIds: [],
      setupCycling: false,
      setupCycleIntervalId: null,
      setupCycleFinalizeId: null,
      busy: false,
      timeoutId: null,
      winnerRevealId: null,
      stickerCleanupId: null,
      stickerActive: false,
      stickerLastShownAt: 0,
      playerReactionReadyAt: 0,
      playerReactionCooldownId: null,
      playReactionText: "",
      playReactionTimeoutId: null
    };
  }

  function gameTypeConfig(gameTypeId) {
    return GAME_TYPES[gameTypeId] || GAME_TYPES[DEFAULT_GAME_TYPE_ID];
  }

  function rulesetConfig(rulesetId) {
    return RULESETS[rulesetId] || RULESETS[DEFAULT_RULESET_ID];
  }

  function rulesGuideForGameType(gameTypeId) {
    var config = gameTypeConfig(gameTypeId);
    return RULESET_GUIDES[config.rulesetId] || RULESET_GUIDES[DEFAULT_RULESET_ID];
  }

  function normalizeGameTypeId(gameTypeId) {
    return gameTypeConfig(gameTypeId).id;
  }

  function rulesetIdForGameType(gameTypeId) {
    return gameTypeConfig(gameTypeId).rulesetId;
  }

  function setupSeatCount(gameTypeId) {
    return gameTypeConfig(gameTypeId).seatCount;
  }

  function playerCountForRuleset(rulesetId) {
    return rulesetConfig(rulesetId).playerCount || 4;
  }

  function playerCountForGameType(gameTypeId) {
    return playerCountForRuleset(rulesetIdForGameType(gameTypeId));
  }

  function activePlayersForGameType(gameTypeId) {
    return MAX_PLAYERS.slice(0, playerCountForGameType(gameTypeId));
  }

  function activePlayersForState(sourceState) {
    var source = sourceState || state;
    return MAX_PLAYERS.slice(0, playerCountForRuleset(source.rulesetId));
  }

  function activeAiSeatsForGameType(gameTypeId) {
    return activePlayersForGameType(gameTypeId).slice(1);
  }

  function activeAiSeatsForState(sourceState) {
    return activePlayersForState(sourceState).slice(1);
  }

  function isKentuckyBaselineRuleset(rulesetId) {
    return (rulesetId || state.rulesetId) === "kentuckyHouse";
  }

  function createEmptySetupSeats(gameTypeId) {
    return Array(setupSeatCount(gameTypeId)).fill(null);
  }

  function normalizeSetupSeatPersonaIds(raw, gameTypeId) {
    var count = setupSeatCount(gameTypeId);
    var next = [];

    if (Array.isArray(raw)) {
      raw.forEach(function (personaId) {
        if (AI_PERSONA_BY_ID[personaId] && next.indexOf(personaId) === -1 && next.length < count) {
          next.push(personaId);
        }
      });
    }

    while (next.length < count) {
      next.push(null);
    }

    return next;
  }

  function normalizeMatchAiPersonaIds(raw, source) {
    var next = [];
    var targetCount;

    if (source && typeof source === "object" && source.rulesetId) {
      targetCount = activeAiSeatsForState(source).length;
    } else if (source && RULESETS[source]) {
      targetCount = playerCountForRuleset(source) - 1;
    } else if (source && GAME_TYPES[source]) {
      targetCount = activeAiSeatsForGameType(source).length;
    } else {
      targetCount = activeAiSeatsForState().length;
    }

    if (Array.isArray(raw)) {
      raw.forEach(function (personaId) {
        if (AI_PERSONA_BY_ID[personaId] && next.indexOf(personaId) === -1 && next.length < targetCount) {
          next.push(personaId);
        }
      });
    }

    DEFAULT_MATCH_AI_PERSONA_IDS.forEach(function (personaId) {
      if (next.length < targetCount && next.indexOf(personaId) === -1) {
        next.push(personaId);
      }
    });

    return next.slice(0, targetCount);
  }

  function selectedSetupSeatsFilled() {
    return normalizeSetupSeatPersonaIds(state.setupSeatPersonaIds, state.gameTypeId).every(function (personaId) {
      return Boolean(personaId);
    });
  }

  function displayedSetupSeatPersonaIds() {
    if (state.setupCycling) {
      return normalizeSetupSeatPersonaIds(state.setupPreviewPersonaIds, state.gameTypeId);
    }
    return normalizeSetupSeatPersonaIds(state.setupSeatPersonaIds, state.gameTypeId);
  }

  function deriveMatchAiPersonaIds(gameTypeId, setupSeatPersonaIds) {
    return normalizeMatchAiPersonaIds(
      normalizeSetupSeatPersonaIds(setupSeatPersonaIds, gameTypeId).slice(0, activeAiSeatsForGameType(gameTypeId).length),
      gameTypeId
    );
  }

  function personaForPlayer(sourceState, player) {
    var activeIds = normalizeMatchAiPersonaIds(sourceState && sourceState.matchAiPersonaIds, sourceState || state);
    var personaId;

    if (player === 0) {
      return null;
    }
    personaId = activeIds[player - 1];
    return AI_PERSONA_BY_ID[personaId] || AI_PERSONA_BY_ID[DEFAULT_MATCH_AI_PERSONA_IDS[player - 1]];
  }

  function playerNameFromState(sourceState, player) {
    var persona = personaForPlayer(sourceState, player);

    if (player === 0) {
      return "You";
    }
    return persona ? persona.name : DEFAULT_PLAYER_NAMES[player];
  }

  function aiStyleLabel(styleId) {
    return AI_STYLE_LABELS[styleId] || "Steady";
  }

  function applyMatchAiPersonas(personaIds, source) {
    var activeIds = normalizeMatchAiPersonaIds(personaIds, source || state);

    PLAYER_NAMES = DEFAULT_PLAYER_NAMES.slice();
    AI_STYLE_BY_PLAYER = [null, "steady", "bold", "disruptor", "careful"];
    activeIds.forEach(function (personaId, index) {
      var player = index + 1;
      var persona = AI_PERSONA_BY_ID[activeIds[index]] || AI_PERSONA_BY_ID[DEFAULT_MATCH_AI_PERSONA_IDS[index]];

      PLAYER_NAMES[player] = persona.name;
      AI_STYLE_BY_PLAYER[player] = persona.styleId;
    });
  }

  function randomSetupSeatPersonaIds(gameTypeId, currentIds) {
    var available = AI_PERSONAS.map(function (persona) {
      return persona.id;
    });
    var count = setupSeatCount(gameTypeId);
    var next;
    var attempt;

    for (attempt = 0; attempt < 5; attempt += 1) {
      shuffle(available, Date.now() + attempt * 37);
      next = available.slice(0, count);
      if (!Array.isArray(currentIds) || next.join(",") !== currentIds.join(",")) {
        return next;
      }
    }

    return available.slice(0, count);
  }

  function clearSetupCycle() {
    if (state.setupCycleIntervalId !== null) {
      window.clearInterval(state.setupCycleIntervalId);
      state.setupCycleIntervalId = null;
    }
    if (state.setupCycleFinalizeId !== null) {
      window.clearTimeout(state.setupCycleFinalizeId);
      state.setupCycleFinalizeId = null;
    }
    state.setupCycling = false;
    state.setupPreviewPersonaIds = [];
  }

  function startSetupSeatCycle() {
    var settledIds;
    var cycleSteps = 0;

    if (state.phase !== "setup" || state.setupCycling) {
      return;
    }

    settledIds = randomSetupSeatPersonaIds(
      state.gameTypeId,
      normalizeSetupSeatPersonaIds(state.setupSeatPersonaIds, state.gameTypeId)
    );

    clearSetupCycle();
    state.setupCycling = true;
    state.setupPreviewPersonaIds = randomSetupSeatPersonaIds(state.gameTypeId, settledIds);
    render();

    state.setupCycleIntervalId = window.setInterval(function () {
      cycleSteps += 1;
      state.setupPreviewPersonaIds = randomSetupSeatPersonaIds(state.gameTypeId, state.setupPreviewPersonaIds);
      render();

      if (cycleSteps >= 4) {
        window.clearInterval(state.setupCycleIntervalId);
        state.setupCycleIntervalId = null;
      }
    }, 170);

    state.setupCycleFinalizeId = window.setTimeout(function () {
      state.setupCycleFinalizeId = null;
      clearSetupCycle();
      state.setupSeatPersonaIds = settledIds;
      markMatchDirty();
      render();
    }, 820);
  }

  function createProfile() {
    return {
      version: STORAGE_SCHEMA_VERSION,
      createdAt: null,
      lastPlayedAt: null,
      totals: {
        matchesStarted: 0,
        matchesCompleted: 0,
        matchesWon: 0,
        matchesLost: 0,
        roundsCompleted: 0,
        usPointsEarned: 0,
        themPointsEarned: 0
      },
      human: {
        bidsWon: 0,
        bidsMade: 0,
        bidsSet: 0,
        bestRoundPoints: 0,
        winningBidTotal: 0,
        winningBidCount: 0,
        perfectBid200Made: 0
      },
      performance: {
        bestMatchScore: 0,
        biggestWinMargin: 0,
        biggestLossMargin: 0,
        comebackWins: 0,
        closeWins: 0
      },
      opponents: {
        opponentBidRounds: 0,
        opponentSetRounds: 0,
        currentSetMatchStreak: 0
      },
      milestones: {
        nearTargetBidMakes: 0,
        bounceBackWins: 0,
        maxBidWins: 0
      },
      trumpStats: {
        madeBidBySuit: {
          red: 0,
          green: 0,
          yellow: 0,
          orange: 0
        }
      },
      streaks: {
        currentMatchWinStreak: 0,
        bestMatchWinStreak: 0
      },
      achievements: {
        unlocked: {}
      },
      collectionStickers: [],
      miniStickers: [],
      rulesets: {},
      playerRecords: {},
      visuals: defaultVisualSettings(),
      aiTuning: defaultAiTuning(),
      lastMatch: null
    };
  }

  function safeStorageGet(key) {
    return safeStorageGetModule(key);
  }

  function safeStorageSet(key, value) {
    return safeStorageSetModule(key, value);
  }

  function safeStorageRemove(key) {
    return safeStorageRemoveModule(key);
  }

  function parseStoredJson(key) {
    return parseStoredJsonModule(key);
  }

  function normalizeProfile(raw) {
    var nextProfile = createProfile();
    var totals = raw && raw.totals ? raw.totals : {};
    var human = raw && raw.human ? raw.human : {};
    var performance = raw && raw.performance ? raw.performance : {};
    var opponents = raw && raw.opponents ? raw.opponents : {};
    var milestones = raw && raw.milestones ? raw.milestones : {};
    var streaks = raw && raw.streaks ? raw.streaks : {};
    var trumpStats = raw && raw.trumpStats ? raw.trumpStats : {};

    nextProfile.version = STORAGE_SCHEMA_VERSION;
    nextProfile.createdAt = raw && raw.createdAt ? raw.createdAt : null;
    nextProfile.lastPlayedAt = raw && raw.lastPlayedAt ? raw.lastPlayedAt : null;
    nextProfile.totals.matchesStarted = Number(totals.matchesStarted) || 0;
    nextProfile.totals.matchesCompleted = Number(totals.matchesCompleted) || 0;
    nextProfile.totals.matchesWon = Number(totals.matchesWon) || 0;
    nextProfile.totals.matchesLost = Number(totals.matchesLost) || 0;
    nextProfile.totals.roundsCompleted = Number(totals.roundsCompleted) || 0;
    nextProfile.totals.usPointsEarned = Number(totals.usPointsEarned) || 0;
    nextProfile.totals.themPointsEarned = Number(totals.themPointsEarned) || 0;
    nextProfile.human.bidsWon = Number(human.bidsWon) || 0;
    nextProfile.human.bidsMade = Number(human.bidsMade) || 0;
    nextProfile.human.bidsSet = Number(human.bidsSet) || 0;
    nextProfile.human.bestRoundPoints = Number(human.bestRoundPoints) || 0;
    nextProfile.human.winningBidTotal = Number(human.winningBidTotal) || 0;
    nextProfile.human.winningBidCount = Number(human.winningBidCount) || 0;
    nextProfile.human.perfectBid200Made = Number(human.perfectBid200Made) || 0;
    nextProfile.performance.bestMatchScore = Number(performance.bestMatchScore) || 0;
    nextProfile.performance.biggestWinMargin = Number(performance.biggestWinMargin) || 0;
    nextProfile.performance.biggestLossMargin = Number(performance.biggestLossMargin) || 0;
    nextProfile.performance.comebackWins = Number(performance.comebackWins) || 0;
    nextProfile.performance.closeWins = Number(performance.closeWins) || 0;
    nextProfile.opponents.opponentBidRounds = Number(opponents.opponentBidRounds) || 0;
    nextProfile.opponents.opponentSetRounds = Number(opponents.opponentSetRounds) || 0;
    nextProfile.opponents.currentSetMatchStreak = Number(opponents.currentSetMatchStreak) || 0;
    nextProfile.milestones.nearTargetBidMakes = Number(milestones.nearTargetBidMakes) || 0;
    nextProfile.milestones.bounceBackWins = Number(milestones.bounceBackWins) || 0;
    nextProfile.milestones.maxBidWins = Number(milestones.maxBidWins) || 0;
    nextProfile.trumpStats.madeBidBySuit.red = Number(trumpStats.madeBidBySuit && trumpStats.madeBidBySuit.red) || 0;
    nextProfile.trumpStats.madeBidBySuit.green = Number(trumpStats.madeBidBySuit && trumpStats.madeBidBySuit.green) || 0;
    nextProfile.trumpStats.madeBidBySuit.yellow = Number(trumpStats.madeBidBySuit && trumpStats.madeBidBySuit.yellow) || 0;
    nextProfile.trumpStats.madeBidBySuit.orange = Number(trumpStats.madeBidBySuit && trumpStats.madeBidBySuit.orange) || 0;
    nextProfile.streaks.currentMatchWinStreak = Number(streaks.currentMatchWinStreak) || 0;
    nextProfile.streaks.bestMatchWinStreak = Number(streaks.bestMatchWinStreak) || 0;
    nextProfile.achievements = normalizeAchievementProgress(raw && raw.achievements);
    nextProfile.collectionStickers = normalizeCollectionStickers(
      raw && raw.collectionStickers,
      nextProfile.totals.matchesWon
    );
    nextProfile.miniStickers = normalizeMiniStickers(raw && raw.miniStickers);
    nextProfile.rulesets = normalizeRulesetRecords(raw && raw.rulesets);
    nextProfile.playerRecords = normalizePlayerRecords(raw && raw.playerRecords);
    nextProfile.visuals = normalizeVisualSettings(raw && raw.visuals);
    nextProfile.aiTuning = normalizeAiTuning(raw && raw.aiTuning);
    nextProfile.lastMatch = raw && raw.lastMatch ? raw.lastMatch : null;

    return nextProfile;
  }

  function normalizeAchievementProgress(raw) {
    var next = {
      unlocked: {}
    };

    if (!raw || typeof raw !== "object" || !raw.unlocked || typeof raw.unlocked !== "object") {
      return next;
    }

    Object.keys(raw.unlocked).forEach(function (id) {
      var item = raw.unlocked[id] || {};
      next.unlocked[id] = {
        unlockedAt: item.unlockedAt || null,
        stickerAsset: item.stickerAsset || null,
        tilt: typeof item.tilt === "number" ? item.tilt : 0,
        toastShownAt: item.toastShownAt || null
      };
    });

    return next;
  }

  function seededCollectionMetric(seed, offset) {
    var value = 0;
    var index;
    var source = String(seed || "");

    for (index = 0; index < source.length; index += 1) {
      value = (value * 31 + source.charCodeAt(index) + offset) % 1000003;
    }

    return value / 1000003;
  }

  function createCollectionStickerFromSeed(id, earnedAt, matchId) {
    var baseAsset = COLLECTION_STICKER_ASSET;
    var x = 10 + seededCollectionMetric(id, 11) * 78;
    var y = 8 + seededCollectionMetric(id, 29) * 78;
    var rotation = Math.round((seededCollectionMetric(id, 47) * 22) - 11);
    var scale = Math.round((0.9 + seededCollectionMetric(id, 71) * 0.22) * 100) / 100;

    return {
      id: id,
      kind: "match_win",
      asset: baseAsset,
      x: Math.max(8, Math.min(88, x)),
      y: Math.max(8, Math.min(88, y)),
      rotation: rotation,
      scale: scale,
      earnedAt: earnedAt || null,
      matchId: matchId || null
    };
  }

  function normalizeCollectionStickers(raw, fallbackWinCount) {
    var stickers;
    var index;

    if (Array.isArray(raw) && raw.length) {
      return raw.reduce(function (items, item, itemIndex) {
        if (!item || typeof item !== "object") {
          return items;
        }
        items.push({
          id: item.id || "collection-" + itemIndex,
          kind: item.kind || "match_win",
          asset: item.asset || STICKER_CONFIG.rook.assets[0],
          x: typeof item.x === "number" ? item.x : createCollectionStickerFromSeed(String(item.id || itemIndex), item.earnedAt, item.matchId).x,
          y: typeof item.y === "number" ? item.y : createCollectionStickerFromSeed(String(item.id || itemIndex), item.earnedAt, item.matchId).y,
          rotation: typeof item.rotation === "number" ? item.rotation : 0,
          scale: typeof item.scale === "number" ? item.scale : 1,
          earnedAt: item.earnedAt || null,
          matchId: item.matchId || null
        });
        return items;
      }, []);
    }

    stickers = [];
    for (index = 0; index < (Number(fallbackWinCount) || 0); index += 1) {
      stickers.push(
        createCollectionStickerFromSeed(
          "legacy-win-" + index,
          null,
          "legacy-win-" + index
        )
      );
    }
    return stickers;
  }

  function normalizeMiniStickers(raw) {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.reduce(function (items, item) {
      if (!item || typeof item !== "object" || !item.id) {
        return items;
      }
      items.push({
        id: item.id,
        earnedAt: item.earnedAt || null,
        asset: item.asset || null,
        tilt: typeof item.tilt === "number" ? item.tilt : 0,
        matchId: item.matchId || null
      });
      return items;
    }, []);
  }

  function normalizeRulesetRecords(raw) {
    var records = {};

    if (!raw || typeof raw !== "object") {
      return records;
    }

    Object.keys(raw).forEach(function (rulesetId) {
      var item = raw[rulesetId] || {};
      records[rulesetId] = {
        matchesCompleted: Number(item.matchesCompleted) || 0,
        wins: Number(item.wins) || 0,
        losses: Number(item.losses) || 0
      };
    });

    return records;
  }

  function normalizePlayerRecords(raw) {
    var records = {};

    if (!raw || typeof raw !== "object") {
      return records;
    }

    Object.keys(raw).forEach(function (name) {
      var item = raw[name] || {};
      records[name] = {
        teammateWins: Number(item.teammateWins) || 0,
        teammateLosses: Number(item.teammateLosses) || 0,
        opponentWins: Number(item.opponentWins) || 0,
        opponentLosses: Number(item.opponentLosses) || 0
      };
    });

    return records;
  }

  function defaultAiTuning() {
    var tuning = {};

    AI_PERSONAS.forEach(function (persona) {
      tuning[persona.id] = {};
      AI_TUNING_KEYS.forEach(function (key) {
        tuning[persona.id][key] = AI_PROFILES[persona.styleId][key];
      });
    });
    return tuning;
  }

  function defaultVisualSettings() {
    return {
      backgroundThemeId: DEFAULT_BACKGROUND_THEME_ID,
      tabletopThemeId: DEFAULT_TABLETOP_THEME_ID
    };
  }

  function normalizeVisualChoice(value, options, fallback) {
    if (value && options[value]) {
      return value;
    }
    return fallback;
  }

  function normalizeVisualSettings(raw) {
    return {
      backgroundThemeId: normalizeVisualChoice(
        raw && raw.backgroundThemeId,
        BACKGROUND_THEMES,
        DEFAULT_BACKGROUND_THEME_ID
      ),
      tabletopThemeId: normalizeVisualChoice(
        raw && raw.tabletopThemeId,
        TABLETOP_THEMES,
        DEFAULT_TABLETOP_THEME_ID
      )
    };
  }

  function normalizeAiTuning(raw) {
    var normalized = defaultAiTuning();
    var legacySeatMap = {
      1: "bea",
      2: "mae",
      3: "cal"
    };

    if (!raw || typeof raw !== "object") {
      return normalized;
    }

    Object.keys(raw).forEach(function (rawKey) {
      var personaId = AI_PERSONA_BY_ID[rawKey] ? rawKey : legacySeatMap[rawKey];
      var entry;

      if (!personaId) {
        return;
      }
      entry = raw[rawKey] || {};
      AI_TUNING_KEYS.forEach(function (key) {
        if (typeof entry[key] === "number" && !Number.isNaN(entry[key])) {
          normalized[personaId][key] = Math.max(0.7, Math.min(1.35, entry[key]));
        }
      });
    });
    return normalized;
  }

  function loadProfile() {
    var beforeCount;

    profile = normalizeProfile(parseStoredJson(PROFILE_STORAGE_KEY));
    beforeCount = unlockedAchievementCount();
    evaluateAchievements({ silent: true });
    if (unlockedAchievementCount() !== beforeCount) {
      saveProfile();
    }
    applyVisualSettings();
  }

  function saveProfile() {
    profile.version = STORAGE_SCHEMA_VERSION;
    safeStorageSet(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }

  function applyVisualSettings() {
    var root = document.documentElement;
    var backgroundTheme = BACKGROUND_THEMES[profile.visuals.backgroundThemeId] || BACKGROUND_THEMES[DEFAULT_BACKGROUND_THEME_ID];
    var tabletopTheme = TABLETOP_THEMES[profile.visuals.tabletopThemeId] || TABLETOP_THEMES[DEFAULT_TABLETOP_THEME_ID];
    var classicTabletop = tabletopTheme.style !== "plain";

    root.style.setProperty("--app-bg-image", 'url("' + backgroundTheme.asset + '")');
    root.style.setProperty("--tabletop-image", 'url("' + tabletopTheme.asset + '")');
    root.style.setProperty(
      "--tabletop-overlay-top",
      classicTabletop
        ? "radial-gradient(circle at 50% 43%, rgba(255, 248, 220, 0.18), rgba(255, 255, 255, 0) 34%)"
        : "linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))"
    );
    root.style.setProperty(
      "--tabletop-overlay-middle",
      classicTabletop
        ? "radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0), rgba(27, 14, 5, 0.24) 82%)"
        : "linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))"
    );
    root.style.setProperty(
      "--tabletop-overlay-bottom",
      classicTabletop
        ? "linear-gradient(180deg, rgba(42, 22, 10, 0.08), rgba(20, 10, 4, 0.22))"
        : "linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))"
    );
    root.style.setProperty("--tabletop-blend-mode", classicTabletop ? "screen, multiply, normal" : "normal");
    root.style.setProperty("--tabletop-before-opacity", classicTabletop ? "0.55" : "0");
    root.style.setProperty("--tabletop-after-opacity", classicTabletop ? "0.7" : "0");
  }

  function ensureRulesetRecord(rulesetId) {
    if (!profile.rulesets[rulesetId]) {
      profile.rulesets[rulesetId] = {
        matchesCompleted: 0,
        wins: 0,
        losses: 0
      };
    }
    return profile.rulesets[rulesetId];
  }

  function ensurePlayerRecord(name) {
    if (!profile.playerRecords[name]) {
      profile.playerRecords[name] = {
        teammateWins: 0,
        teammateLosses: 0,
        opponentWins: 0,
        opponentLosses: 0
      };
    }
    return profile.playerRecords[name];
  }

  function formatRecord(wins, losses) {
    return wins + "-" + losses;
  }

  function formatRate(numerator, denominator) {
    if (!denominator) {
      return "0%";
    }
    return Math.round((numerator / denominator) * 100) + "%";
  }

  function formatAverage(value) {
    return Math.round(value * 10) / 10;
  }

  function updateProfileTimestamp() {
    var now = new Date().toISOString();

    if (!profile.createdAt) {
      profile.createdAt = now;
    }
    profile.lastPlayedAt = now;
  }

  function createMatchId() {
    return "match-" + Date.now();
  }

  function totalAchievementCount() {
    return ACHIEVEMENT_DEFS.length;
  }

  function unlockedAchievementCount() {
    return Object.keys(profile.achievements.unlocked).length;
  }

  function achievementById(id) {
    var index;

    for (index = 0; index < ACHIEVEMENT_DEFS.length; index += 1) {
      if (ACHIEVEMENT_DEFS[index].id === id) {
        return ACHIEVEMENT_DEFS[index];
      }
    }

    return null;
  }

  function stickerAssetFromPool(pool) {
    if (!pool || !pool.length) {
      return null;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function randomStickerTilt() {
    return Math.floor(Math.random() * 11) - 5;
  }

  function isAchievementUnlocked(id) {
    return !!profile.achievements.unlocked[id];
  }

  function enqueueAchievementToast(achievementId) {
    var def = achievementById(achievementId);
    var unlocked = profile.achievements.unlocked[achievementId];

    if (!def || !unlocked || unlocked.toastShownAt) {
      return;
    }

    state.achievementToastQueue.push({
      id: achievementId,
      title: def.title,
      description: def.description,
      stickerAsset: unlocked.stickerAsset || stickerAssetFromPool(def.stickerPool)
    });
  }

  function canShowAchievementToast() {
    return state.menuOpen || state.phase === "welcome" || state.phase === "summary" || state.phase === "scoring";
  }

  function renderAchievementToast() {
    var toast;
    var image;
    var label;
    var title;
    var description;
    var existing;
    var currentId;

    if (!ui.achievementToastLayer) {
      return;
    }

    if (!state.achievementToastCurrent) {
      ui.achievementToastLayer.innerHTML = "";
      ui.achievementToastLayer.classList.remove("is-visible");
      return;
    }

    existing = ui.achievementToastLayer.firstElementChild;
    currentId = state.achievementToastCurrent.id;
    if (existing && existing.getAttribute("data-toast-id") === currentId) {
      existing.classList.toggle("is-exiting", state.achievementToastExiting);
      ui.achievementToastLayer.classList.add("is-visible");
      return;
    }

    ui.achievementToastLayer.innerHTML = "";

    toast = document.createElement("article");
    toast.className = "achievement-toast" + (state.achievementToastExiting ? " is-exiting" : "");
    toast.setAttribute("data-toast-id", currentId);
    image = document.createElement("img");
    label = document.createElement("span");
    title = document.createElement("strong");
    description = document.createElement("p");

    image.className = "achievement-toast-sticker";
    image.src = state.achievementToastCurrent.stickerAsset;
    image.alt = "";
    image.decoding = "async";
    image.setAttribute("aria-hidden", "true");
    label.className = "achievement-toast-label";
    label.textContent = "Achievement Unlocked";
    title.textContent = state.achievementToastCurrent.title;
    description.textContent = state.achievementToastCurrent.description;

    toast.appendChild(image);
    toast.appendChild(label);
    toast.appendChild(title);
    toast.appendChild(description);
    ui.achievementToastLayer.appendChild(toast);
    ui.achievementToastLayer.classList.add("is-visible");
  }

  function clearAchievementToast() {
    if (state.achievementToastTimeoutId !== null) {
      window.clearTimeout(state.achievementToastTimeoutId);
      state.achievementToastTimeoutId = null;
    }
    state.achievementToastCurrent = null;
    state.achievementToastExiting = false;
    renderAchievementToast();
  }

  function dismissAchievementToast() {
    if (!state.achievementToastCurrent) {
      clearAchievementToast();
      processAchievementToastQueue();
      return;
    }

    if (state.achievementToastTimeoutId !== null) {
      window.clearTimeout(state.achievementToastTimeoutId);
      state.achievementToastTimeoutId = null;
    }

    state.achievementToastExiting = true;
    renderAchievementToast();
    state.achievementToastTimeoutId = window.setTimeout(function () {
      clearAchievementToast();
      processAchievementToastQueue();
    }, 240);
  }

  function processAchievementToastQueue() {
    var unlocked;

    if (state.achievementToastCurrent || !state.achievementToastQueue.length || !canShowAchievementToast()) {
      renderAchievementToast();
      return;
    }

    state.achievementToastCurrent = state.achievementToastQueue.shift();
    unlocked = profile.achievements.unlocked[state.achievementToastCurrent.id];
    if (unlocked && !unlocked.toastShownAt) {
      unlocked.toastShownAt = new Date().toISOString();
      saveProfile();
    }
    renderAchievementToast();
    state.achievementToastTimeoutId = window.setTimeout(function () {
      dismissAchievementToast();
    }, ACHIEVEMENT_TOAST_DURATION);
  }

  function unlockAchievement(id, options) {
    var def = achievementById(id);
    options = options || {};

    if (!def || isAchievementUnlocked(id)) {
      return false;
    }

    profile.achievements.unlocked[id] = {
      unlockedAt: new Date().toISOString(),
      stickerAsset: stickerAssetFromPool(def.stickerPool),
      tilt: randomStickerTilt(),
      toastShownAt: options.silent ? new Date().toISOString() : null
    };
    if (!options.silent) {
      enqueueAchievementToast(id);
    }
    return true;
  }

  function evaluateAchievements(options) {
    unlockAchievementIf("first_match_win", profile.totals.matchesWon >= 1, options);
    unlockAchievementIf("bid_caller", profile.human.bidsWon >= 5, options);
    unlockAchievementIf("contract_clutch", profile.human.bidsMade >= 3, options);
    unlockAchievementIf("set_em_up", profile.opponents.opponentSetRounds >= 3, options);
    unlockAchievementIf("big_round", profile.human.bestRoundPoints >= 100, options);
    unlockAchievementIf("perfect_200", profile.human.perfectBid200Made >= 1, options);
    unlockAchievementIf("close_shave", profile.performance.closeWins >= 1, options);
    unlockAchievementIf("comeback_kid", profile.performance.comebackWins >= 1, options);
    unlockAchievementIf("century_club", profile.human.bestRoundPoints >= 150, options);
    unlockAchievementIf("double_century", profile.performance.bestMatchScore >= 600, options);
    unlockAchievementIf("lockdown_defense", profile.opponents.currentSetMatchStreak >= 3, options);
    unlockAchievementIf("ice_water", profile.milestones.nearTargetBidMakes >= 1, options);
    unlockAchievementIf("no_mercy", profile.performance.biggestWinMargin >= 150, options);
    unlockAchievementIf("hot_hand", profile.streaks.bestMatchWinStreak >= 5, options);
    unlockAchievementIf("bounce_back", profile.milestones.bounceBackWins >= 1, options);
    unlockAchievementIf("perfect_partner", hasTeammateWinThreshold(10), options);
    unlockAchievementIf("nemesis", hasOpponentWinThreshold(10), options);
    unlockAchievementIf("across_the_spectrum", hasMadeBidInEverySuit(), options);
    unlockAchievementIf("max_pressure", profile.milestones.maxBidWins >= 5, options);
    unlockAchievementIf("unshakeable", profile.totals.matchesCompleted >= 25, options);
  }

  function unlockAchievementIf(id, condition, options) {
    if (condition) {
      unlockAchievement(id, options);
    }
  }

  function hasCollectionSticker(matchId) {
    return profile.collectionStickers.some(function (item) {
      return item.matchId === matchId;
    });
  }

  function hasTeammateWinThreshold(threshold) {
    return Object.keys(profile.playerRecords).some(function (name) {
      return ensurePlayerRecord(name).teammateWins >= threshold;
    });
  }

  function hasOpponentWinThreshold(threshold) {
    return Object.keys(profile.playerRecords).some(function (name) {
      return ensurePlayerRecord(name).opponentWins >= threshold;
    });
  }

  function hasMadeBidInEverySuit() {
    return SUITS.every(function (suit) {
      return profile.trumpStats.madeBidBySuit[suit] >= 1;
    });
  }

  function awardCollectionSticker(matchId) {
    var sticker;

    if (!matchId || hasCollectionSticker(matchId)) {
      return false;
    }

    sticker = createCollectionStickerFromSeed("match-win-" + matchId, new Date().toISOString(), matchId);
    profile.collectionStickers.push(sticker);
    return true;
  }

  function hasMiniSticker(type, matchId) {
    return profile.miniStickers.some(function (item) {
      return item.id === type && item.matchId === matchId;
    });
  }

  function awardMiniSticker(type, matchId) {
    var def = MINI_STICKER_DEFS[type];

    if (!def || hasMiniSticker(type, matchId)) {
      return false;
    }

    profile.miniStickers.push({
      id: type,
      earnedAt: new Date().toISOString(),
      asset: stickerAssetFromPool(def.assetPool),
      tilt: randomStickerTilt(),
      matchId: matchId || null
    });
    return true;
  }

  function summarizeSavedMatch(savedState) {
    if (!savedState || !savedState.phase || savedState.phase === "welcome") {
      return null;
    }

    var scoreLabel;

    if (rulesetConfig(savedState.rulesetId).setupFlow === "callPartner") {
      var leader = callPartnerStandingOrderForState(savedState).find(function (player) {
        return player !== 0;
      });
      if (leader === undefined) {
        leader = activePlayersForState(savedState)[1] || 0;
      }
      scoreLabel = "You " + (savedState.individualMatchPoints[0] || 0) + " • " +
        playerNameFromState(savedState, leader) + " " + (savedState.individualMatchPoints[leader] || 0);
    } else {
      scoreLabel = "Us " + savedState.matchPoints[0] + " • Them " + savedState.matchPoints[1];
    }

    return {
      phaseLabel: savedPhaseLabel(savedState),
      roundLabel: savedRoundLabel(savedState),
      scoreLabel: scoreLabel,
      detail: savedMatchDetail(savedState)
    };
  }

  function savedPhaseLabel(savedState) {
    if (savedState.phase === "setup") {
      return "Match Setup";
    }
    if (savedState.phase === "bidding") {
      return savedState.biddingComplete ? "Bid Locked In" : "Bidding";
    }
    if (savedState.phase === "trump") {
      return "Power Setup";
    }
    if (savedState.phase === "play") {
      return "In Play";
    }
    if (savedState.phase === "scoring") {
      return "Scoring Reveal";
    }
    if (savedState.phase === "summary") {
      return savedState.gameOver ? "Final Score Saved" : "Round Summary";
    }
    return "Saved Match";
  }

  function savedRoundLabel(savedState) {
    if (savedState.phase === "setup") {
      return "Ready";
    }
    if (savedState.phase === "summary" || savedState.phase === "scoring") {
      return "Round " + Math.max(1, savedState.roundNumber - 1);
    }
    return "Round " + savedState.roundNumber;
  }

  function savedMatchDetail(savedState) {
    if (savedState.phase === "setup") {
      return gameTypeConfig(savedState.gameTypeId).label + " selected.";
    }
    if (savedState.phase === "play") {
      return playerNameFromState(savedState, savedState.currentPlayer) + " to play.";
    }
    if (savedState.phase === "trump") {
      return playerNameFromState(savedState, savedState.bidder) + " won " + savedState.winningBid + ".";
    }
    if (savedState.phase === "scoring" && savedState.summary) {
      return "Tallying " + savedState.summary.bid + ".";
    }
    if (savedState.phase === "summary" && savedState.summary) {
      return savedState.summary.bid + " • " + savedState.summary.result + ".";
    }
    if (savedState.phase === "bidding") {
      return savedState.biddingStarted ? "Bidding in progress." : "Ready to bid.";
    }
    return "Saved on this device.";
  }

  function sanitizeStateForStorage(sourceState) {
    var snapshot = {};

    PERSISTED_STATE_KEYS.forEach(function (key) {
      snapshot[key] = JSON.parse(JSON.stringify(sourceState[key]));
    });

    if (snapshot.phase === "play") {
      normalizePlaySnapshot(snapshot);
    }

    return snapshot;
  }

  function rebuildHandsFromHistory(sourceState) {
    var activePlayers = activePlayersForState(sourceState);
    var playedByPlayer = Array(MAX_PLAYER_COUNT).fill(null).map(function () { return {}; });
    var rebuiltHands = Array(MAX_PLAYER_COUNT).fill(null).map(function () { return []; });

    (sourceState.completedTricks || []).forEach(function (trick) {
      (trick.cards || []).forEach(function (play) {
        if (play && play.card && playedByPlayer[play.player]) {
          playedByPlayer[play.player][play.card.id] = true;
        }
      });
    });

    (sourceState.trick || []).forEach(function (play) {
      if (play && play.card && playedByPlayer[play.player]) {
        playedByPlayer[play.player][play.card.id] = true;
      }
    });

    activePlayers.forEach(function (player) {
      var baseHand = player === sourceState.bidder && Array.isArray(sourceState.kittyReviewHand) && sourceState.kittyReviewHand.length
        ? sourceState.kittyReviewHand
        : sourceState.initialHands[player] || [];

      rebuiltHands[player] = baseHand.filter(function (card) {
        return !playedByPlayer[player][card.id];
      });
      sortHand(rebuiltHands[player], sourceState.trump);
    });

    return rebuiltHands;
  }

  function nextPlayerWithCards(sourceState, startPlayer) {
    var activePlayers = activePlayersForState(sourceState);
    var offset;
    var candidate;

    for (offset = 0; offset < activePlayers.length; offset += 1) {
      candidate = (startPlayer + offset) % activePlayers.length;
      if ((sourceState.hands[candidate] || []).length > 0) {
        return candidate;
      }
    }

    return startPlayer;
  }

  function normalizePlaySnapshot(snapshot) {
    var trick = Array.isArray(snapshot.trick) ? snapshot.trick : [];
    var lastPlay;

    snapshot.hands = rebuildHandsFromHistory(snapshot);

    if (trick.length) {
      lastPlay = trick[trick.length - 1];
      snapshot.leadSuit = effectiveSuit(trick[0].card, snapshot.trump);
      snapshot.currentPlayer = nextPlayerWithCards(snapshot, (lastPlay.player + 1) % activePlayersForState(snapshot).length);
      return;
    }

    snapshot.leadSuit = null;
    snapshot.currentPlayer = nextPlayerWithCards(snapshot, snapshot.currentPlayer || 0);
  }

  function saveActiveMatch() {
    var payload;

    if (state.phase === "welcome") {
      return false;
    }

    updateProfileTimestamp();
    saveProfile();

    payload = {
      version: STORAGE_SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      state: sanitizeStateForStorage(state)
    };

    if (safeStorageSet(ACTIVE_MATCH_STORAGE_KEY, JSON.stringify(payload))) {
      savedMatchMeta = summarizeSavedMatch(payload.state);
      return true;
    }
    return false;
  }

  function clearActiveMatch() {
    discardPendingMatchSave();
    safeStorageRemove(ACTIVE_MATCH_STORAGE_KEY);
    savedMatchMeta = null;
  }

  function initMatchPersistence() {
    matchPersistence = createPersistenceSchedulerModule({
      delay: 500,
      save: function () {
        return saveActiveMatch();
      }
    });
  }

  function markMatchDirty() {
    if (!matchPersistence || state.phase === "welcome") {
      return;
    }
    matchPersistence.markMatchDirty();
  }

  function flushMatchSave(options) {
    if (!matchPersistence) {
      return false;
    }
    return matchPersistence.flushMatchSave(options || {});
  }

  function discardPendingMatchSave() {
    if (!matchPersistence) {
      return;
    }
    matchPersistence.discardPendingSave();
  }

  function loadSavedMatchPayload() {
    var payload = parseStoredJson(ACTIVE_MATCH_STORAGE_KEY);

    if (!payload) {
      return null;
    }
    if (!payload.state || payload.version !== STORAGE_SCHEMA_VERSION) {
      safeStorageRemove(ACTIVE_MATCH_STORAGE_KEY);
      return null;
    }

    return payload;
  }

  function refreshSavedMatchMeta() {
    var payload = loadSavedMatchPayload();

    savedMatchMeta = payload ? summarizeSavedMatch(payload.state) : null;
  }

  function goHomeScreen() {
    var nextState = createState();

    if (state.phase !== "welcome") {
      flushMatchSave({ immediate: true });
    }

    clearSetupCycle();
    clearPendingTimeout();
    clearSticker(true);
    clearPlayerReactionCooldown();
    clearPlayReaction(false);
    nextState.gameTypeId = normalizeGameTypeId(state.gameTypeId);
    nextState.rulesetId = rulesetIdForGameType(nextState.gameTypeId);
    nextState.setupSeatPersonaIds = normalizeSetupSeatPersonaIds(state.setupSeatPersonaIds, nextState.gameTypeId);
    nextState.matchAiPersonaIds = normalizeMatchAiPersonaIds(state.matchAiPersonaIds, nextState);
    nextState.menuOpen = false;
    nextState.menuView = "hub";
    refreshSavedMatchMeta();
    applyMatchAiPersonas(nextState.matchAiPersonaIds, nextState);
    assignState(nextState);
    render();
  }

  function assignState(nextState) {
    Object.keys(state).forEach(function (key) {
      delete state[key];
    });
    Object.keys(nextState).forEach(function (key) {
      state[key] = nextState[key];
    });
  }

  function hydrateStateFromSnapshot(snapshot) {
    var nextState = createState();
    snapshot = migrateLegacyBlackSuit(snapshot);

    PERSISTED_STATE_KEYS.forEach(function (key) {
      if (snapshot.hasOwnProperty(key)) {
        nextState[key] = snapshot[key];
      }
    });

    nextState.phase = snapshot.phase || "welcome";
    nextState.gameTypeId = normalizeGameTypeId(nextState.gameTypeId);
    nextState.setupSeatPersonaIds = normalizeSetupSeatPersonaIds(nextState.setupSeatPersonaIds, nextState.gameTypeId);
    nextState.matchAiPersonaIds = normalizeMatchAiPersonaIds(nextState.matchAiPersonaIds, nextState);
    nextState.historyOpen = false;
    nextState.busy = false;
    nextState.timeoutId = null;
    nextState.winnerRevealId = null;
    nextState.stickerCleanupId = null;
    nextState.stickerActive = false;
    nextState.stickerLastShownAt = 0;
    nextState.playerReactionReadyAt = 0;
    nextState.playerReactionCooldownId = null;
    nextState.playReactionText = "";
    nextState.playReactionTimeoutId = null;
    nextState.aiTrumpMeterStarted = false;
    nextState.dealAnimating = false;
    nextState.dealVisibleCount = rulesetConfig(nextState.rulesetId).handSize;
    nextState.dealSeatCounts = activeAiSeatsForState(nextState).map(function () {
      return rulesetConfig(nextState.rulesetId).handSize;
    });
    nextState.dealRevealed = true;
    nextState.dealRevealAnimating = false;

    if (!nextState.matchId) {
      nextState.matchId = createMatchId();
    }
    if (!nextState.matchStartedAt) {
      nextState.matchStartedAt = new Date().toISOString();
    }
    if (nextState.phase === "trump" && nextState.bidder !== 0) {
      nextState.aiTrumpReady = true;
    }
    if (nextState.phase === "play") {
      normalizePlaySnapshot(nextState);
    }
    if (nextState.phase === "scoring") {
      nextState.phase = "summary";
      nextState.busy = false;
      nextState.scoringOutcomeVisible = true;
    }

    clearSetupCycle();
    applyMatchAiPersonas(nextState.matchAiPersonaIds, nextState);
    assignState(nextState);
  }

  function continueSavedMatch() {
    var payload = loadSavedMatchPayload();

    if (!payload) {
      refreshSavedMatchMeta();
      render();
      return;
    }

    clearSetupCycle();
    clearPendingTimeout();
    clearSticker(true);
    clearPlayerReactionCooldown();
    clearPlayReaction(false);
    clearAchievementToast();
    hydrateStateFromSnapshot(payload.state);
    state.menuOpen = false;
    state.menuView = "hub";
    updateProfileTimestamp();
    saveProfile();
    render();

    if (state.phase === "bidding" && state.biddingStarted && !state.biddingComplete && state.currentBidTurn !== 0) {
      continueBidding();
    } else if (woodsonExchangeActive() && woodsonCurrentPlayer() !== 0) {
      maybeRunWoodsonExchangeAi();
    } else if (state.phase === "play") {
      maybeRunAiTurn();
    }
  }

  function openSetupPhase() {
    var nextState = createState();
    var selectedGameTypeId = normalizeGameTypeId(state.gameTypeId);

    clearSetupCycle();
    clearPendingTimeout();
    clearSticker(true);
    clearPlayerReactionCooldown();
    clearPlayReaction(false);
    clearAchievementToast();
    clearActiveMatch();
    nextState.phase = "setup";
    nextState.gameTypeId = selectedGameTypeId;
    nextState.rulesetId = rulesetIdForGameType(selectedGameTypeId);
    nextState.setupSeatPersonaIds = createEmptySetupSeats(selectedGameTypeId);
    nextState.matchAiPersonaIds = normalizeMatchAiPersonaIds(state.matchAiPersonaIds, nextState);
    assignState(nextState);
    state.menuOpen = false;
    state.menuView = "hub";
    updateProfileTimestamp();
    saveProfile();
    render();
  }

  function beginNewMatch() {
    var nextState = createState();
    var selectedGameTypeId = normalizeGameTypeId(state.gameTypeId);
    var selectedSetupSeats = normalizeSetupSeatPersonaIds(state.setupSeatPersonaIds, selectedGameTypeId);
    var matchAiPersonaIds = deriveMatchAiPersonaIds(selectedGameTypeId, selectedSetupSeats);

    clearSetupCycle();
    clearPendingTimeout();
    clearSticker(true);
    clearPlayerReactionCooldown();
    clearPlayReaction(false);
    clearAchievementToast();
    clearActiveMatch();
    nextState.gameTypeId = selectedGameTypeId;
    nextState.rulesetId = rulesetIdForGameType(selectedGameTypeId);
    nextState.setupSeatPersonaIds = selectedSetupSeats;
    nextState.matchAiPersonaIds = matchAiPersonaIds;
    nextState.matchId = createMatchId();
    nextState.matchStartedAt = new Date().toISOString();
    applyMatchAiPersonas(matchAiPersonaIds, nextState);
    assignState(nextState);
    state.menuOpen = false;
    state.menuView = "hub";
    updateProfileTimestamp();
    profile.totals.matchesStarted += 1;
    saveProfile();
    startRound();
  }

  function recordRoundStats(bidMade) {
    var bidderTeam;
    var bidMargin;

    if (state.profileRoundsTracked >= state.roundHistory.length) {
      return;
    }

    updateProfileTimestamp();
    profile.totals.roundsCompleted += 1;
    profile.totals.usPointsEarned += state.roundPoints[0];
    profile.totals.themPointsEarned += state.roundPoints[1];

    bidderTeam = teamForPlayer(state.bidder);

    if (state.bidder === 0) {
      profile.human.bidsWon += 1;
      profile.human.winningBidTotal += state.winningBid;
      profile.human.winningBidCount += 1;
      if (state.winningBid === getRuleConfig().maxBid) {
        profile.milestones.maxBidWins += 1;
      }
      if (bidMade) {
        profile.human.bidsMade += 1;
        bidMargin = state.roundPoints[0] - state.winningBid;
        if (bidMargin >= 0 && bidMargin <= 5) {
          profile.milestones.nearTargetBidMakes += 1;
        }
        if (state.trump && profile.trumpStats.madeBidBySuit[state.trump] !== undefined) {
          profile.trumpStats.madeBidBySuit[state.trump] += 1;
        }
        if (state.winningBid === getRuleConfig().maxBid) {
          profile.human.perfectBid200Made += 1;
          awardMiniSticker("perfect_200", state.matchId);
        }
      } else {
        profile.human.bidsSet += 1;
      }
    } else if (bidderTeam === 1) {
      profile.opponents.opponentBidRounds += 1;
      if (!bidMade) {
        profile.opponents.opponentSetRounds += 1;
        state.matchOpponentSetRounds += 1;
        awardMiniSticker("opponent_set", state.matchId + "-round-" + state.roundNumber);
      }
    }

    profile.human.bestRoundPoints = Math.max(profile.human.bestRoundPoints, state.roundPoints[0]);
    state.profileRoundsTracked = state.roundHistory.length;
    evaluateAchievements();
    saveProfile();
  }

  function recordMatchCompletion() {
    var margin;
    var previousMatchWon;
    var rulesetRecord;
    var won;

    if (!state.gameOver || state.profileMatchCompleteRecorded) {
      return;
    }

    won = state.matchPoints[0] > state.matchPoints[1];
    margin = Math.abs(state.matchPoints[0] - state.matchPoints[1]);
    previousMatchWon = profile.lastMatch ? profile.lastMatch.won : null;
    updateProfileTimestamp();
    profile.totals.matchesCompleted += 1;
    profile.performance.bestMatchScore = Math.max(profile.performance.bestMatchScore, state.matchPoints[0]);
    if (won) {
      profile.totals.matchesWon += 1;
      awardCollectionSticker(state.matchId);
      if (profile.totals.matchesWon === 1) {
        awardMiniSticker("first_match_win", state.matchId);
      }
      profile.performance.biggestWinMargin = Math.max(profile.performance.biggestWinMargin, margin);
      if (state.matchMaxDeficit > 0) {
        profile.performance.comebackWins += 1;
        awardMiniSticker("comeback_win", state.matchId);
      }
      if (margin <= CLOSE_WIN_MARGIN) {
        profile.performance.closeWins += 1;
        awardMiniSticker("close_win", state.matchId);
      }
      if (previousMatchWon === false) {
        profile.milestones.bounceBackWins += 1;
      }
      profile.streaks.currentMatchWinStreak += 1;
      profile.streaks.bestMatchWinStreak = Math.max(
        profile.streaks.bestMatchWinStreak,
        profile.streaks.currentMatchWinStreak
      );
      if (profile.streaks.currentMatchWinStreak >= 3) {
        awardMiniSticker("streak_3", state.matchId);
      }
    } else {
      profile.totals.matchesLost += 1;
      profile.performance.biggestLossMargin = Math.max(profile.performance.biggestLossMargin, margin);
      profile.streaks.currentMatchWinStreak = 0;
    }

    if (state.matchOpponentSetRounds > 0) {
      profile.opponents.currentSetMatchStreak += 1;
    } else {
      profile.opponents.currentSetMatchStreak = 0;
    }

    rulesetRecord = ensureRulesetRecord(state.rulesetId);
    rulesetRecord.matchesCompleted += 1;
    if (won) {
      rulesetRecord.wins += 1;
    } else {
      rulesetRecord.losses += 1;
    }

    PLAYER_NAMES.slice(1).forEach(function (name, index) {
      var player = index + 1;
      var record = ensurePlayerRecord(name);

      if (teamForPlayer(player) === teamForPlayer(0)) {
        if (won) {
          record.teammateWins += 1;
        } else {
          record.teammateLosses += 1;
        }
      } else if (won) {
        record.opponentWins += 1;
      } else {
        record.opponentLosses += 1;
      }
    });

    profile.lastMatch = {
      completedAt: new Date().toISOString(),
      won: won,
      usScore: state.matchPoints[0],
      themScore: state.matchPoints[1],
      margin: margin,
      rulesetId: state.rulesetId
    };
    state.profileMatchCompleteRecorded = true;
    evaluateAchievements();
    saveProfile();
  }

  function getRuleConfig() {
    return rulesetConfig(state.rulesetId);
  }

  function openingLeader() {
    if (isCallPartnerRuleset() && state.askPartnerToLead && state.callPartnerPlayer !== null) {
      return state.callPartnerPlayer;
    }
    if (getRuleConfig().openingLeader === "leftOfDealer") {
      return (state.dealer + 1) % activePlayersForState().length;
    }
    return state.bidder;
  }

  function bidderDiscardCount() {
    return getRuleConfig().kittySize;
  }

  function isWoodsonRuleset() {
    return getRuleConfig().setupFlow === "woodson";
  }

  function isCallPartnerRuleset() {
    return getRuleConfig().setupFlow === "callPartner";
  }

  function woodsonExchangeActive() {
    return state.phase === "trump" && state.trumpStage === "exchange";
  }

  function woodsonCurrentPlayer() {
    return state.exchangeOrder[state.exchangeIndex] === undefined ? null : state.exchangeOrder[state.exchangeIndex];
  }

  function cardIsNonScoring(card) {
    return cardPoints(card) === 0;
  }

  function roundTeamPlayers(team) {
    var activePlayers = activePlayersForState();

    if (isCallPartnerRuleset()) {
      if (team === 0) {
        return activePlayers.filter(function (player) {
          return player === state.bidder || player === state.callPartnerPlayer;
        });
      }
      return activePlayers.filter(function (player) {
        return player !== state.bidder && player !== state.callPartnerPlayer;
      });
    }

    return activePlayers.filter(function (player) {
      return teamForPlayer(player) === team;
    });
  }

  function isPlayerOnBidSide(player) {
    return roundTeamPlayers(0).indexOf(player) !== -1;
  }

  function partnerStatusText(player) {
    if (!isCallPartnerRuleset() || !state.callPartnerCardId) {
      return "";
    }
    if (player === state.bidder) {
      return "Bidder";
    }
    if (state.callPartnerPlayer === player && state.callPartnerRevealed) {
      return "Partner";
    }
    if (state.callPartnerPlayer === player && state.phase === "play" && state.callPartnerRevealed) {
      return "Partner";
    }
    return "";
  }

  function callPartnerTeamForPlayer(player, sourceState) {
    var source = sourceState || state;

    if (rulesetConfig(source.rulesetId).setupFlow === "callPartner") {
      if (source.bidder === null) {
        return player === 0 ? 0 : 1;
      }
      if (player === source.bidder || (source.callPartnerPlayer !== null && player === source.callPartnerPlayer)) {
        return 0;
      }
      return 1;
    }
    return player % 2 === 0 ? 0 : 1;
  }

  function callPartnerWinningSideForSummary(sourceState) {
    var source = sourceState || state;

    if (rulesetConfig(source.rulesetId).setupFlow !== "callPartner" || !source.summary) {
      return null;
    }
    return source.summary.bidMade ? source.summary.bidderTeam : (source.summary.bidderTeam === 0 ? 1 : 0);
  }

  function callPartnerTieBreakScore(player, sourceState) {
    var source = sourceState || state;
    var winningSide = callPartnerWinningSideForSummary(source);
    var sideBonus = winningSide !== null && callPartnerTeamForPlayer(player, source) === winningSide ? 1 : 0;
    return {
      sideBonus: sideBonus,
      roundPoints: source.playerPoints[player] || 0
    };
  }

  function buildCallPartnerStandingOrder(pointsArray, sourceState) {
    var source = sourceState || state;

    return activePlayersForState(source).slice().sort(function (a, b) {
      var pointDelta = (pointsArray[b] || 0) - (pointsArray[a] || 0);
      var tieA;
      var tieB;

      if (pointDelta !== 0) {
        return pointDelta;
      }

      tieA = callPartnerTieBreakScore(a, source);
      tieB = callPartnerTieBreakScore(b, source);
      if (tieB.sideBonus !== tieA.sideBonus) {
        return tieB.sideBonus - tieA.sideBonus;
      }
      if (tieB.roundPoints !== tieA.roundPoints) {
        return tieB.roundPoints - tieA.roundPoints;
      }
      return playerNameFromState(source, a).localeCompare(playerNameFromState(source, b));
    });
  }

  function currentCallPartnerStandingOrder() {
    if (!isCallPartnerRuleset()) {
      return [];
    }
    return state.callPartnerStandingOrder
      ? state.callPartnerStandingOrder.slice()
      : buildCallPartnerStandingOrder(state.individualMatchPoints, state);
  }

  function callPartnerStandingOrderForState(sourceState) {
    if (!sourceState || rulesetConfig(sourceState.rulesetId).setupFlow !== "callPartner") {
      return [];
    }
    return sourceState.callPartnerStandingOrder
      ? sourceState.callPartnerStandingOrder.slice()
      : buildCallPartnerStandingOrder(sourceState.individualMatchPoints || [], sourceState);
  }

  function callPartnerRankLabel(order, index) {
    var player = order[index];
    var points = state.individualMatchPoints[player] || 0;
    var firstIndex = order.findIndex(function (candidate) {
      return (state.individualMatchPoints[candidate] || 0) === points;
    });
    var tiedCount = order.filter(function (candidate) {
      return (state.individualMatchPoints[candidate] || 0) === points;
    }).length;
    var baseRank = firstIndex + 1;

    return tiedCount > 1 ? baseRank + "t" : String(baseRank);
  }

  function callPartnerStandingMovement(player) {
    var previousOrder = state.previousCallPartnerStandingOrder;
    var currentOrder = currentCallPartnerStandingOrder();
    var previousIndex;
    var currentIndex;
    var delta;

    if (!previousOrder || !previousOrder.length) {
      return { text: "-", direction: "flat" };
    }

    previousIndex = previousOrder.indexOf(player);
    currentIndex = currentOrder.indexOf(player);
    if (previousIndex === -1 || currentIndex === -1) {
      return { text: "-", direction: "flat" };
    }

    delta = previousIndex - currentIndex;
    if (delta > 0) {
      return { text: "↑ " + delta, direction: "up" };
    }
    if (delta < 0) {
      return { text: "↓ " + Math.abs(delta), direction: "down" };
    }
    return { text: "-", direction: "flat" };
  }

  function matchTargetForDisplay() {
    return getRuleConfig().matchTarget;
  }

  function leadingIndividualPlayer() {
    var order = currentCallPartnerStandingOrder();
    return order.length ? order[0] : 0;
  }

  function leadingOtherPlayer() {
    var order = currentCallPartnerStandingOrder();
    var leader = order.find(function (player) {
      return player !== 0;
    });

    return leader !== undefined ? leader : 1;
  }

  function currentScoreTextForTopbar() {
    if (!isCallPartnerRuleset()) {
      return {
        primary: "Us " + state.matchPoints[0],
        secondary: "Them " + state.matchPoints[1],
        primaryWidth: scoreProgressWidth(state.matchPoints[0]),
        secondaryWidth: scoreProgressWidth(state.matchPoints[1])
      };
    }

    var leader = leadingOtherPlayer();
    return {
      primary: "You " + state.individualMatchPoints[0],
      secondary: PLAYER_NAMES[leader] + " " + state.individualMatchPoints[leader],
      primaryWidth: individualScoreProgressWidth(state.individualMatchPoints[0]),
      secondaryWidth: individualScoreProgressWidth(state.individualMatchPoints[leader])
    };
  }

  function individualScoreProgressWidth(score) {
    var matchTarget = getRuleConfig().matchTarget;
    var clamped = Math.max(0, Math.min(matchTarget, score));
    return (clamped / matchTarget) * 100 + "%";
  }

  function resolveCallPartnerWinnerFromPlayers(players, winningSide) {
    if (!players.length) {
      return null;
    }

    var sideFiltered = players.filter(function (player) {
      return teamForPlayer(player) === winningSide;
    });
    var contenders = sideFiltered.length ? sideFiltered : players;
    var bestPoints = Math.max.apply(null, contenders.map(function (player) {
      return state.playerPoints[player] || 0;
    }));

    contenders = contenders.filter(function (player) {
      return (state.playerPoints[player] || 0) === bestPoints;
    }).sort(function (a, b) {
      return PLAYER_NAMES[a].localeCompare(PLAYER_NAMES[b]);
    });

    return contenders[0];
  }

  function individualMatchWinnerForRound(bidMade, bidderTeam) {
    var target = getRuleConfig().matchTarget;
    var leaders = activePlayersForState().filter(function (player) {
      return state.individualMatchPoints[player] >= target;
    });
    var bestScore;

    if (!leaders.length) {
      return null;
    }

    bestScore = Math.max.apply(null, leaders.map(function (player) {
      return state.individualMatchPoints[player];
    }));
    leaders = leaders.filter(function (player) {
      return state.individualMatchPoints[player] === bestScore;
    });

    return resolveCallPartnerWinnerFromPlayers(leaders, bidMade ? bidderTeam : (bidderTeam === 0 ? 1 : 0));
  }

  function currentCallPartnerMatchWinnerPlayer() {
    if (!isCallPartnerRuleset()) {
      return null;
    }
    return individualMatchWinnerForRound(Boolean(state.summary && state.summary.bidMade), state.summary ? state.summary.bidderTeam : 0);
  }

  function didHumanWinCurrentMatch() {
    if (isCallPartnerRuleset()) {
      return currentCallPartnerMatchWinnerPlayer() === 0;
    }
    return state.matchPoints[0] > state.matchPoints[1];
  }

  function canDiscardFromBidderSetup(card) {
    if (!isWoodsonRuleset()) {
      return true;
    }
    return cardIsNonScoring(card);
  }

  function canDiscardInWoodsonExchange(card) {
    return cardIsNonScoring(card);
  }

  function woodsonSwapCount(player) {
    return state.exchangeSwapsUsed[player] || 0;
  }

  function callablePartnerCards() {
    var excluded = {};
    var cards;

    state.kittyReviewHand.forEach(function (card) {
      excluded[card.id] = true;
    });
    state.buriedKitty.forEach(function (card) {
      excluded[card.id] = true;
    });

    cards = buildDeck().filter(function (card) {
      return !excluded[card.id];
    });
    sortHand(cards, state.trump);
    return cards;
  }

  function ownerOfCard(cardId) {
    var owner = null;

    activePlayersForState().some(function (player) {
      if ((state.initialHands[player] || []).some(function (card) { return card.id === cardId; })) {
        owner = player;
        return true;
      }
      return false;
    });

    return owner;
  }

  function humanKnowsCalledPartnerCard() {
    if (!isCallPartnerRuleset() || !state.callPartnerCardId) {
      return false;
    }
    return state.callPartnerRevealed || state.bidder === 0 || ownerOfCard(state.callPartnerCardId) === 0;
  }

  function selectCalledPartner(cardId, askPartnerToLead) {
    state.callPartnerCardId = cardId;
    state.callPartnerPlayer = ownerOfCard(cardId);
    state.askPartnerToLead = Boolean(askPartnerToLead) && state.callPartnerPlayer !== null && state.callPartnerPlayer !== state.bidder;
    state.callPartnerRevealed = state.askPartnerToLead;
    state.pendingCallPartnerCardId = null;
    state.pendingAskPartnerToLead = false;
    markMatchDirty();
  }

  function chooseAiCalledPartner() {
    var options = callablePartnerCards();
    var best = null;

    options.forEach(function (card) {
      var owner = ownerOfCard(card.id);
      var ownerHand = owner === null ? [] : (state.initialHands[owner] || []);
      var score = aiKeepScore(card, ownerHand, state.selectedTrump || state.trump, owner === null ? state.bidder : owner);

      if (owner === state.bidder || owner === null) {
        return;
      }
      if (!best || score > best.score) {
        best = {
          cardId: card.id,
          owner: owner,
          score: score
        };
      }
    });

    if (!best) {
      return null;
    }

    return {
      cardId: best.cardId,
      askPartnerToLead: best.score >= 16
    };
  }

  function calledPartnerCardLabel() {
    var card;
    var trump = state.selectedTrump || state.trump;

    if (!state.callPartnerCardId) {
      return "";
    }
    card = buildDeck().find(function (entry) {
      return entry.id === state.callPartnerCardId;
    });
    return card ? fullCardLabel(card, trump) : "";
  }

  function calledPartnerCardData() {
    if (!state.callPartnerCardId) {
      return null;
    }
    return buildDeck().find(function (entry) {
      return entry.id === state.callPartnerCardId;
    }) || null;
  }

  function beginCallPartnerStage() {
    var aiChoice;

    state.trumpStage = "callPartner";
    state.pendingCallPartnerCardId = null;
    state.pendingAskPartnerToLead = false;
    state.busy = false;
    markMatchDirty();

    if (state.bidder !== 0) {
      aiChoice = chooseAiCalledPartner();
      if (aiChoice) {
        selectCalledPartner(aiChoice.cardId, aiChoice.askPartnerToLead);
      }
      dealForPlay();
      return;
    }

    render();
  }

  function startPlayFromTrumpSelection() {
    state.trump = state.selectedTrump;
    markMatchDirty();
    if (isCallPartnerRuleset()) {
      if (state.bidder !== 0 && state.callPartnerCardId) {
        dealForPlay();
        return;
      }
      beginCallPartnerStage();
      return;
    }
    if (isWoodsonRuleset()) {
      beginWoodsonExchange();
      return;
    }
    dealForPlay();
  }

  function woodsonExchangeOrder() {
    var order = [];
    var playerCount = activePlayersForState().length;
    var offset;

    for (offset = 1; offset <= playerCount; offset += 1) {
      order.push((state.bidder + offset) % playerCount);
    }
    return order;
  }

  function beginWoodsonExchange() {
    state.trumpStage = "exchange";
    state.kitty = state.buriedKitty.slice();
    state.buriedKitty = [];
    state.hands = prepareRoundHands();
    state.exchangeOrder = woodsonExchangeOrder();
    state.exchangeIndex = 0;
    state.exchangeSwapsUsed = Array(MAX_PLAYER_COUNT).fill(0);
    state.exchangeSelectedHandCardId = null;
    state.exchangeSelectedKittyCardId = null;
    state.busy = false;
    markMatchDirty();
    render();
    maybeRunWoodsonExchangeAi();
  }

  function advanceWoodsonExchangeTurn() {
    state.exchangeSelectedHandCardId = null;
    state.exchangeSelectedKittyCardId = null;
    state.exchangeIndex += 1;
    markMatchDirty();

    if (state.exchangeIndex >= state.exchangeOrder.length) {
      dealForPlay();
      return;
    }

    render();
    maybeRunWoodsonExchangeAi();
  }

  function performWoodsonSwap(player, handCardId, kittyCardId) {
    var hand = state.hands[player];
    var handIndex;
    var kittyIndex;
    var handCard;
    var kittyCard;

    if (!hand) {
      return false;
    }

    handIndex = hand.findIndex(function (card) {
      return card.id === handCardId;
    });
    kittyIndex = state.kitty.findIndex(function (card) {
      return card.id === kittyCardId;
    });
    if (handIndex === -1 || kittyIndex === -1) {
      return false;
    }

    handCard = hand[handIndex];
    kittyCard = state.kitty[kittyIndex];
    if (!canDiscardInWoodsonExchange(handCard)) {
      return false;
    }

    hand[handIndex] = kittyCard;
    state.kitty[kittyIndex] = handCard;
    sortHand(hand, state.trump);
    sortHand(state.kitty, state.trump);
    state.exchangeSwapsUsed[player] += 1;
    markMatchDirty();
    return true;
  }

  function chooseWoodsonAiSwap(player) {
    var hand = state.hands[player];
    var best = null;

    if (!hand || woodsonSwapCount(player) >= 3) {
      return null;
    }

    hand.forEach(function (handCard) {
      if (!canDiscardInWoodsonExchange(handCard)) {
        return;
      }
      state.kitty.forEach(function (kittyCard) {
        var handScore = aiKeepScore(handCard, hand, state.trump, player);
        var kittyScore = aiKeepScore(kittyCard, hand.concat(state.kitty), state.trump, player);
        var improvement = kittyScore - handScore;

        if (!best || improvement > best.improvement) {
          best = {
            handCardId: handCard.id,
            kittyCardId: kittyCard.id,
            improvement: improvement
          };
        }
      });
    });

    if (!best || best.improvement < 2.2) {
      return null;
    }

    return best;
  }

  function maybeRunWoodsonExchangeAi() {
    var player = woodsonCurrentPlayer();
    var choice;

    if (!woodsonExchangeActive() || player === null || player === 0 || state.busy) {
      return;
    }

    state.busy = true;
    render();

    schedule(function () {
      if (!woodsonExchangeActive() || woodsonCurrentPlayer() !== player) {
        state.busy = false;
        render();
        return;
      }

      while (woodsonSwapCount(player) < 3) {
        choice = chooseWoodsonAiSwap(player);
        if (!choice || !performWoodsonSwap(player, choice.handCardId, choice.kittyCardId)) {
          break;
        }
      }

      state.busy = false;
      advanceWoodsonExchangeTurn();
    }, AI_DELAY);
  }

  function scoringTotalPoints() {
    var scoring = getRuleConfig().scoring;
    return (scoring.rank1 * 4) + scoring.rank14 * 4 + scoring.rank10 * 4 + scoring.rank5 * 4 + scoring.rook;
  }

  function cacheDom() {
    ui.phaseWelcome = document.getElementById("phaseWelcome");
    ui.phaseSetup = document.getElementById("phaseSetup");
    ui.phaseBidding = document.getElementById("phaseBidding");
    ui.phaseTrump = document.getElementById("phaseTrump");
    ui.phasePlay = document.getElementById("phasePlay");
    ui.phaseScoring = document.getElementById("phaseScoring");
    ui.phaseSummary = document.getElementById("phaseSummary");
    ui.matchSummaryBackdrop = document.getElementById("matchSummaryBackdrop");
    ui.summaryPanel = ui.phaseSummary ? ui.phaseSummary.querySelector(".panel-card") : null;
    ui.menuToggle = document.getElementById("menuToggle");
    ui.menuSheet = document.getElementById("menuSheet");
    ui.menuBack = document.getElementById("menuBack");
    ui.menuClose = document.getElementById("menuClose");
    ui.menuBackdrop = document.getElementById("menuBackdrop");
    ui.menuTitle = document.getElementById("menuTitle");
    ui.menuHome = document.getElementById("menuHome");
    ui.menuContext = document.getElementById("menuContext");
    ui.menuHubView = document.getElementById("menuHubView");
    ui.menuProfileView = document.getElementById("menuProfileView");
    ui.menuAchievementsView = document.getElementById("menuAchievementsView");
    ui.menuSettingsView = document.getElementById("menuSettingsView");
    ui.menuNavProfile = document.getElementById("menuNavProfile");
    ui.menuNavAchievements = document.getElementById("menuNavAchievements");
    ui.menuNavSettings = document.getElementById("menuNavSettings");
    ui.menuProfileMatches = document.getElementById("menuProfileMatches");
    ui.menuProfileRecord = document.getElementById("menuProfileRecord");
    ui.menuProfileBidRate = document.getElementById("menuProfileBidRate");
    ui.menuProfileBestRound = document.getElementById("menuProfileBestRound");
    ui.menuRulesetName = document.getElementById("menuRulesetName");
    ui.menuRulesDetail = document.getElementById("menuRulesDetail");
    ui.menuBackgroundSelect = document.getElementById("menuBackgroundSelect");
    ui.menuTabletopSelect = document.getElementById("menuTabletopSelect");
    ui.menuAiSettingsStatus = document.getElementById("menuAiSettingsStatus");
    ui.menuAiPlayerSettings = document.getElementById("menuAiPlayerSettings");
    ui.resetAiSettings = document.getElementById("resetAiSettings");
    ui.menuHeroRecord = document.getElementById("menuHeroRecord");
    ui.menuHeroWinRate = document.getElementById("menuHeroWinRate");
    ui.menuHeroBestRound = document.getElementById("menuHeroBestRound");
    ui.menuHeroCurrentStreak = document.getElementById("menuHeroCurrentStreak");
    ui.menuHeroBidRate = document.getElementById("menuHeroBidRate");
    ui.menuFullMatchesStarted = document.getElementById("menuFullMatchesStarted");
    ui.menuFullMatchesCompleted = document.getElementById("menuFullMatchesCompleted");
    ui.menuFullWins = document.getElementById("menuFullWins");
    ui.menuFullLosses = document.getElementById("menuFullLosses");
    ui.menuFullRounds = document.getElementById("menuFullRounds");
    ui.menuFullBestRound = document.getElementById("menuFullBestRound");
    ui.menuFullAvgRoundPoints = document.getElementById("menuFullAvgRoundPoints");
    ui.menuFullBestMatchScore = document.getElementById("menuFullBestMatchScore");
    ui.menuFullBiggestWinMargin = document.getElementById("menuFullBiggestWinMargin");
    ui.menuFullBiggestLossMargin = document.getElementById("menuFullBiggestLossMargin");
    ui.menuFullComebackWins = document.getElementById("menuFullComebackWins");
    ui.menuFullCloseWins = document.getElementById("menuFullCloseWins");
    ui.menuFullBidsWon = document.getElementById("menuFullBidsWon");
    ui.menuFullAvgWinningBid = document.getElementById("menuFullAvgWinningBid");
    ui.menuFullPerfect200 = document.getElementById("menuFullPerfect200");
    ui.menuFullOpponentSetRate = document.getElementById("menuFullOpponentSetRate");
    ui.menuFullOpponentSetRaw = document.getElementById("menuFullOpponentSetRaw");
    ui.menuFullBidAttempts = document.getElementById("menuFullBidAttempts");
    ui.menuRulesetRecords = document.getElementById("menuRulesetRecords");
    ui.menuPlayerRecords = document.getElementById("menuPlayerRecords");
    ui.menuFullProgressStatus = document.getElementById("menuFullProgressStatus");
    ui.menuFullUsPoints = document.getElementById("menuFullUsPoints");
    ui.menuFullThemPoints = document.getElementById("menuFullThemPoints");
    ui.menuFullCurrentStreak = document.getElementById("menuFullCurrentStreak");
    ui.menuFullBestStreak = document.getElementById("menuFullBestStreak");
    ui.menuStickerBookStatus = document.getElementById("menuStickerBookStatus");
    ui.showAchievementBook = document.getElementById("showAchievementBook");
    ui.showCollectorSheet = document.getElementById("showCollectorSheet");
    ui.menuStickerAchievements = document.getElementById("menuStickerAchievements");
    ui.menuStickerCollector = document.getElementById("menuStickerCollector");
    ui.menuStickerCanvas = document.getElementById("menuStickerCanvas");
    ui.menuCollectorStatus = document.getElementById("menuCollectorStatus");
    ui.achievementToastLayer = document.getElementById("achievementToastLayer");
    ui.welcomeTitle = document.getElementById("welcomeTitle");
    ui.welcomeMessage = document.getElementById("welcomeMessage");
    ui.savedMatchPanel = document.getElementById("savedMatchPanel");
    ui.savedMatchPhase = document.getElementById("savedMatchPhase");
    ui.savedMatchRound = document.getElementById("savedMatchRound");
    ui.savedMatchScore = document.getElementById("savedMatchScore");
    ui.savedMatchDetail = document.getElementById("savedMatchDetail");
    ui.continueSavedGame = document.getElementById("continueSavedGame");
    ui.profileStatus = document.getElementById("profileStatus");
    ui.profileMatches = document.getElementById("profileMatches");
    ui.profileRecord = document.getElementById("profileRecord");
    ui.profileRounds = document.getElementById("profileRounds");
    ui.profileBids = document.getElementById("profileBids");
    ui.profileDetail = document.getElementById("profileDetail");
    ui.setupGameTypeSelect = document.getElementById("setupGameTypeSelect");
    ui.setupRulesSummaryText = document.getElementById("setupRulesSummaryText");
    ui.setupRulesLink = document.getElementById("setupRulesLink");
    ui.setupRosterGrid = document.getElementById("setupRosterGrid");
    ui.setupSeatsStatus = document.getElementById("setupSeatsStatus");
    ui.setupSelectedSeats = document.getElementById("setupSelectedSeats");
    ui.setupPartnerHint = document.getElementById("setupPartnerHint");
    ui.fillSetupSeats = document.getElementById("fillSetupSeats");
    ui.refreshSetupSeats = document.getElementById("refreshSetupSeats");
    ui.confirmSetup = document.getElementById("confirmSetup");
    ui.usScoreText = document.getElementById("usScoreText");
    ui.themScoreText = document.getElementById("themScoreText");
    ui.usScoreBar = document.getElementById("usScoreBar");
    ui.themScoreBar = document.getElementById("themScoreBar");
    ui.currentHighRow = document.getElementById("currentHighRow");
    ui.currentHighLabel = document.getElementById("currentHighLabel");
    ui.currentHighBid = document.getElementById("currentHighBid");
    ui.biddingPhaseLabel = document.getElementById("biddingPhaseLabel");
    ui.biddingTitle = document.getElementById("biddingTitle");
    ui.turnRow = document.getElementById("turnRow");
    ui.currentTurn = document.getElementById("currentTurn");
    ui.selectedBid = document.getElementById("selectedBid");
    ui.bidPicker = document.getElementById("bidPicker");
    ui.bidActions = document.getElementById("bidActions");
    ui.dealingSequence = document.getElementById("dealingSequence");
    ui.dealSummary = document.getElementById("dealSummary");
    ui.biddingHandHeader = document.getElementById("biddingHandHeader");
    ui.handStrengthHint = document.getElementById("handStrengthHint");
    ui.dealingStickers = Array.prototype.slice.call(document.querySelectorAll(".dealing-sticker"));
    ui.decreaseBid = document.getElementById("decreaseBid");
    ui.increaseBid = document.getElementById("increaseBid");
    ui.placeBid = document.getElementById("placeBid");
    ui.passBid = document.getElementById("passBid");
    ui.startNewGame = document.getElementById("startNewGame");
    ui.startBidding = document.getElementById("startBidding");
    ui.continueToTrump = document.getElementById("continueToTrump");
    ui.bidStatusBoard = document.getElementById("bidStatusBoard");
    ui.biddingHand = document.getElementById("biddingHand");
    ui.trumpPhaseLabel = document.getElementById("trumpPhaseLabel");
    ui.trumpTitle = document.getElementById("trumpTitle");
    ui.trumpBidAmount = document.getElementById("trumpBidAmount");
    ui.trumpProcessing = document.getElementById("trumpProcessing");
    ui.trumpProcessingText = document.getElementById("trumpProcessingText");
    ui.trumpProcessingBar = document.getElementById("trumpProcessingBar");
    ui.aiTrumpContinue = document.getElementById("aiTrumpContinue");
    ui.discardStatusRow = document.getElementById("discardStatusRow");
    ui.discardStatusLabel = document.getElementById("discardStatusLabel");
    ui.discardStatus = document.getElementById("discardStatus");
    ui.confirmTrump = document.getElementById("confirmTrump");
    ui.exchangeDone = document.getElementById("exchangeDone");
    ui.trumpKittyBlock = document.getElementById("trumpKittyBlock");
    ui.trumpReferenceBlock = document.getElementById("trumpReferenceBlock");
    ui.trumpHandLabel = document.getElementById("trumpHandLabel");
    ui.trumpReferenceLabel = document.getElementById("trumpReferenceLabel");
    ui.trumpReferenceHand = document.getElementById("trumpReferenceHand");
    ui.trumpHand = document.getElementById("trumpHand");
    ui.aiPartnerCallSummary = document.getElementById("aiPartnerCallSummary");
    ui.aiPartnerCallCard = document.getElementById("aiPartnerCallCard");
    ui.aiPartnerCallTitle = document.getElementById("aiPartnerCallTitle");
    ui.aiPartnerCallLead = document.getElementById("aiPartnerCallLead");
    ui.aiPartnerCallDetail = document.getElementById("aiPartnerCallDetail");
    ui.trumpButtons = Array.prototype.slice.call(document.querySelectorAll(".trump-button"));
    ui.topbar = document.getElementById("topbar");
    ui.playTrump = document.getElementById("playTrump");
    ui.playContract = document.getElementById("playContract");
    ui.playMessage = document.getElementById("playMessage");
    ui.playReactionToast = document.getElementById("playReactionToast");
    ui.handHint = document.getElementById("handHint");
    ui.playerHand = document.getElementById("playerHand");
    ui.stickerOverlay = document.getElementById("stickerOverlay");
    ui.tableArea = document.querySelector(".table-area");
    ui.reactionNice = document.getElementById("reactionNice");
    ui.reactionOof = document.getElementById("reactionOof");
    ui.seatTopLeftCount = document.getElementById("seatTopLeftCount");
    ui.seatTopCount = document.getElementById("seatTopCount");
    ui.seatTopRightCount = document.getElementById("seatTopRightCount");
    ui.seatLeftCount = document.getElementById("seatLeftCount");
    ui.seatRightCount = document.getElementById("seatRightCount");
    ui.seatBottomCount = document.getElementById("seatBottomCount");
    ui.seatTopLeftName = document.getElementById("seatTopLeftName");
    ui.seatTopName = document.getElementById("seatTopName");
    ui.seatTopRightName = document.getElementById("seatTopRightName");
    ui.seatLeftName = document.getElementById("seatLeftName");
    ui.seatRightName = document.getElementById("seatRightName");
    ui.seatBottomName = document.getElementById("seatBottomName");
    ui.slotTopLeft = document.getElementById("slotTopLeft");
    ui.slotTop = document.getElementById("slotTop");
    ui.slotTopRight = document.getElementById("slotTopRight");
    ui.slotLeft = document.getElementById("slotLeft");
    ui.slotRight = document.getElementById("slotRight");
    ui.slotBottom = document.getElementById("slotBottom");
    ui.summaryTitle = document.getElementById("summaryTitle");
    ui.summaryPhaseLabel = document.getElementById("summaryPhaseLabel");
    ui.summaryStory = document.getElementById("summaryStory");
    ui.summaryStorySticker = document.getElementById("summaryStorySticker");
    ui.summaryStoryLabel = document.getElementById("summaryStoryLabel");
    ui.summaryStoryHeadline = document.getElementById("summaryStoryHeadline");
    ui.summaryStoryMood = document.getElementById("summaryStoryMood");
    ui.summaryGrid = document.getElementById("summaryGrid");
    ui.summaryUsLabel = document.getElementById("summaryUsLabel");
    ui.summaryThemLabel = document.getElementById("summaryThemLabel");
    ui.summaryUs = document.getElementById("summaryUs");
    ui.summaryThem = document.getElementById("summaryThem");
    ui.summaryBid = document.getElementById("summaryBid");
    ui.summaryResult = document.getElementById("summaryResult");
    ui.summaryDetail = document.getElementById("summaryDetail");
    ui.summaryNav = document.getElementById("summaryNav");
    ui.summarySeeStats = document.getElementById("summarySeeStats");
    ui.toggleScoring = document.getElementById("toggleScoring");
    ui.summaryScoring = document.getElementById("summaryScoring");
    ui.summaryScoringGrid = document.getElementById("summaryScoringGrid");
    ui.summaryHistory = document.getElementById("summaryHistory");
    ui.summaryFinalResult = document.getElementById("summaryFinalResult");
    ui.summaryFinalResultEyebrow = document.getElementById("summaryFinalResultEyebrow");
    ui.summaryFinalResultTitle = document.getElementById("summaryFinalResultTitle");
    ui.summaryFinalResultScore = document.getElementById("summaryFinalResultScore");
    ui.summaryFinalResultDetail = document.getElementById("summaryFinalResultDetail");
    ui.summaryMatchScoreboard = document.querySelector(".match-scoreboard");
    ui.summaryHistoryNav = document.getElementById("summaryHistoryNav");
    ui.summaryMatchLabelPrimary = document.getElementById("summaryMatchLabelPrimary");
    ui.summaryMatchLabelSecondary = document.getElementById("summaryMatchLabelSecondary");
    ui.summaryMatchUs = document.getElementById("summaryMatchUs");
    ui.summaryMatchThem = document.getElementById("summaryMatchThem");
    ui.summaryStandings = document.getElementById("summaryStandings");
    ui.summaryMatchNote = document.getElementById("summaryMatchNote");
    ui.summaryMatchTarget = document.getElementById("summaryMatchTarget");
    ui.summaryProfileCard = document.getElementById("summaryProfileCard");
    ui.summaryProfileStatus = document.getElementById("summaryProfileStatus");
    ui.summaryProfileRecord = document.getElementById("summaryProfileRecord");
    ui.summaryProfileBidRate = document.getElementById("summaryProfileBidRate");
    ui.summaryProfileBestRound = document.getElementById("summaryProfileBestRound");
    ui.summaryProfileStreak = document.getElementById("summaryProfileStreak");
    ui.summaryProfileDetail = document.getElementById("summaryProfileDetail");
    ui.summaryTableLabelUs = document.getElementById("summaryTableLabelUs");
    ui.summaryTableLabelThem = document.getElementById("summaryTableLabelThem");
    ui.summaryTableBody = document.getElementById("summaryTableBody");
    ui.scoringTitle = document.getElementById("scoringTitle");
    ui.scoringSubtitle = document.getElementById("scoringSubtitle");
    ui.scoringLabelUs = document.getElementById("scoringLabelUs");
    ui.scoringLabelThem = document.getElementById("scoringLabelThem");
    ui.scoringUsFill = document.getElementById("scoringUsFill");
    ui.scoringThemFill = document.getElementById("scoringThemFill");
    ui.scoringUsPoints = document.getElementById("scoringUsPoints");
    ui.scoringThemPoints = document.getElementById("scoringThemPoints");
    ui.scoringUsBidMarker = document.getElementById("scoringUsBidMarker");
    ui.scoringThemBidMarker = document.getElementById("scoringThemBidMarker");
    ui.scoringOutcome = document.getElementById("scoringOutcome");
    ui.scoringStorySticker = document.getElementById("scoringStorySticker");
    ui.nextRound = document.getElementById("nextRound");
    ui.backToRoundSummary = document.getElementById("backToRoundSummary");
    ui.setupRulesDrawer = document.getElementById("setupRulesDrawer");
    ui.setupRulesTitle = document.getElementById("setupRulesTitle");
    ui.setupRulesClose = document.getElementById("setupRulesClose");
    ui.setupRulesBackdrop = document.getElementById("setupRulesBackdrop");
    ui.setupRulesContent = document.getElementById("setupRulesContent");
    ui.historyToggle = document.getElementById("historyToggle");
    ui.historyDrawer = document.getElementById("historyDrawer");
    ui.historyClose = document.getElementById("historyClose");
    ui.historyBackdrop = document.getElementById("historyBackdrop");
    ui.historyContent = document.getElementById("historyContent");
    ui.appFooterText = document.getElementById("appFooterText");
  }

  function syncAppFooter() {
    if (!ui.appFooterText) {
      return;
    }
    ui.appFooterText.textContent = "Made by Kevan · " + APP_VERSION;
  }

  function bindEvents() {
    window.addEventListener("scroll", syncTopbarScrollState, { passive: true });
    window.addEventListener("beforeunload", function () {
      flushMatchSave({ immediate: true });
    });
    window.addEventListener("pagehide", function () {
      flushMatchSave({ immediate: true });
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        flushMatchSave({ immediate: true });
      }
    });

    ui.menuToggle.addEventListener("click", function () {
      state.menuOpen = true;
      renderMenuSheet();
    });

    ui.menuClose.addEventListener("click", function () {
      closeMenuSheet();
    });

    ui.menuBackdrop.addEventListener("click", function () {
      closeMenuSheet();
    });

    ui.menuBack.addEventListener("click", function () {
      state.menuView = "hub";
      renderMenuSheet();
    });

    ui.menuHome.addEventListener("click", function () {
      goHomeScreen();
    });

    ui.menuNavProfile.addEventListener("click", function () {
      state.menuView = "profile";
      renderMenuSheet();
    });

    ui.menuNavAchievements.addEventListener("click", function () {
      state.menuView = "achievements";
      renderMenuSheet();
    });

    ui.menuNavSettings.addEventListener("click", function () {
      state.menuView = "settings";
      renderMenuSheet();
    });

    ui.menuBackgroundSelect.addEventListener("change", function () {
      profile.visuals.backgroundThemeId = normalizeVisualChoice(
        ui.menuBackgroundSelect.value,
        BACKGROUND_THEMES,
        DEFAULT_BACKGROUND_THEME_ID
      );
      applyVisualSettings();
      saveProfile();
    });

    ui.menuTabletopSelect.addEventListener("change", function () {
      profile.visuals.tabletopThemeId = normalizeVisualChoice(
        ui.menuTabletopSelect.value,
        TABLETOP_THEMES,
        DEFAULT_TABLETOP_THEME_ID
      );
      applyVisualSettings();
      saveProfile();
    });

    ui.menuAiPlayerSettings.addEventListener("input", function (event) {
      var input = event.target;
      var personaId;
      var key;
      var value;
      var valueNode;

      if (!input || input.tagName !== "INPUT" || input.type !== "range") {
        return;
      }
      personaId = input.getAttribute("data-persona");
      key = input.getAttribute("data-key");
      value = Number(input.value);
      if (!personaId || !profile.aiTuning[personaId] || !key || Number.isNaN(value)) {
        return;
      }
      profile.aiTuning[personaId][key] = value;
      valueNode = input.parentNode.querySelector("[data-ai-value]");
      if (valueNode) {
        valueNode.textContent = value.toFixed(2);
      }
      saveProfile();
    });

    ui.resetAiSettings.addEventListener("click", function () {
      profile.aiTuning = defaultAiTuning();
      saveProfile();
      renderSettingsView();
    });

    ui.reactionNice.addEventListener("click", function () {
      triggerPlayerStickerReaction("nice");
    });

    ui.reactionOof.addEventListener("click", function () {
      triggerPlayerStickerReaction("oof");
    });

    ui.showAchievementBook.addEventListener("click", function () {
      state.stickerBookPage = "achievements";
      renderStickerBook();
    });

    ui.showCollectorSheet.addEventListener("click", function () {
      state.stickerBookPage = "collector";
      renderStickerBook();
    });

    ui.setupGameTypeSelect.addEventListener("change", function () {
      var gameTypeId;

      if (state.phase !== "setup" || state.setupCycling) {
        return;
      }
      gameTypeId = normalizeGameTypeId(ui.setupGameTypeSelect.value);
      if (gameTypeId === state.gameTypeId) {
        return;
      }
      state.gameTypeId = gameTypeId;
      state.rulesetId = rulesetIdForGameType(gameTypeId);
      state.setupSeatPersonaIds = createEmptySetupSeats(gameTypeId);
      markMatchDirty();
      render();
    });

    ui.setupRulesLink.addEventListener("click", function () {
      if (state.phase !== "setup") {
        return;
      }
      state.setupRulesOpen = true;
      renderSetupRulesDrawer();
    });

    ui.fillSetupSeats.addEventListener("click", function () {
      if (state.phase !== "setup" || state.setupCycling) {
        return;
      }
      startSetupSeatCycle();
    });

    ui.refreshSetupSeats.addEventListener("click", function () {
      if (state.phase !== "setup" || state.setupCycling) {
        return;
      }
      startSetupSeatCycle();
    });

    ui.confirmSetup.addEventListener("click", function () {
      if (state.phase !== "setup" || state.setupCycling || !selectedSetupSeatsFilled()) {
        return;
      }
      beginNewMatch();
    });

    ui.startNewGame.addEventListener("click", function () {
      if (state.phase !== "welcome") {
        return;
      }
      openSetupPhase();
    });

    ui.continueSavedGame.addEventListener("click", function () {
      if (state.phase !== "welcome") {
        return;
      }
      continueSavedMatch();
    });

    ui.decreaseBid.addEventListener("click", function () {
      if (state.phase !== "bidding" || state.busy || state.biddingComplete) {
        return;
      }
      state.selectedBid = Math.max(getMinimumBid(), state.selectedBid - getRuleConfig().bidStep);
      markMatchDirty();
      render();
    });

    ui.increaseBid.addEventListener("click", function () {
      if (state.phase !== "bidding" || state.busy || state.biddingComplete) {
        return;
      }
      state.selectedBid = Math.min(getRuleConfig().maxBid, state.selectedBid + getRuleConfig().bidStep);
      markMatchDirty();
      render();
    });

    ui.placeBid.addEventListener("click", function () {
      if (state.phase !== "bidding" || state.busy || state.currentBidTurn !== 0 || state.biddingComplete || !state.biddingStarted) {
        return;
      }
      recordBid(0, state.selectedBid);
      continueBidding();
    });

    ui.passBid.addEventListener("click", function () {
      if (state.phase !== "bidding" || state.busy || state.currentBidTurn !== 0 || state.biddingComplete || !state.biddingStarted) {
        return;
      }
      recordPass(0);
      continueBidding();
    });

    ui.startBidding.addEventListener("click", function () {
      if (state.phase !== "bidding" || state.biddingStarted || state.biddingComplete) {
        return;
      }
      state.biddingStarted = true;
      markMatchDirty();
      render();
      continueBidding();
    });

    ui.continueToTrump.addEventListener("click", function () {
      if (state.phase !== "bidding" || !state.biddingComplete) {
        return;
      }
      openTrumpPhase();
    });

    ui.trumpButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (state.phase !== "trump" || state.bidder !== 0) {
          return;
        }
        state.selectedTrump = button.getAttribute("data-trump");
        markMatchDirty();
        renderTrumpPhase();
      });
    });

    ui.confirmTrump.addEventListener("click", function () {
      if (state.phase !== "trump" || state.busy) {
        return;
      }
      if (isCallPartnerRuleset() && state.trumpStage === "callPartner") {
        if (!state.pendingCallPartnerCardId) {
          return;
        }
        selectCalledPartner(state.pendingCallPartnerCardId, state.pendingAskPartnerToLead);
        dealForPlay();
        return;
      }
      if (woodsonExchangeActive()) {
        confirmWoodsonExchangeSelection();
        return;
      }
      if (isWoodsonRuleset() && state.trumpStage === "setup") {
        if (state.selectedDiscards.length !== bidderDiscardCount()) {
          return;
        }
        finalizeBidderHand();
        state.trumpStage = "declare";
        renderTrumpPhase();
        return;
      }
      if (!state.selectedTrump) {
        return;
      }
      if (state.bidder === 0) {
        finalizeBidderHand();
      } else if (!state.aiTrumpReady) {
        return;
      }
      startPlayFromTrumpSelection();
    });

    ui.aiTrumpContinue.addEventListener("click", function () {
      if (state.phase !== "trump" || state.bidder === 0 || !state.aiTrumpReady || state.busy) {
        return;
      }
      startPlayFromTrumpSelection();
    });

    ui.exchangeDone.addEventListener("click", function () {
      if (isCallPartnerRuleset() && state.trumpStage === "callPartner" && !state.busy) {
        state.pendingAskPartnerToLead = !state.pendingAskPartnerToLead;
        markMatchDirty();
        renderTrumpPhase();
        return;
      }
      if (!woodsonExchangeActive() || woodsonCurrentPlayer() !== 0 || state.busy) {
        return;
      }
      advanceWoodsonExchangeTurn();
    });

    ui.nextRound.addEventListener("click", function () {
      if (state.phase !== "summary") {
        return;
      }
      if (state.summaryStep === 1) {
        state.summaryStep = 2;
        render();
        return;
      }
      if (state.gameOver) {
        openSetupPhase();
        return;
      }
      startRound();
    });

    ui.summarySeeStats.addEventListener("click", function () {
      if (state.phase !== "summary" || state.summaryStep !== 2 || !state.gameOver) {
        return;
      }
      state.menuOpen = true;
      state.menuView = "profile";
      renderMenuSheet();
    });

    ui.backToRoundSummary.addEventListener("click", function () {
      if (state.phase !== "summary" || state.summaryStep !== 2) {
        return;
      }
      state.summaryStep = 1;
      render();
    });

    ui.setupRulesClose.addEventListener("click", function () {
      state.setupRulesOpen = false;
      renderSetupRulesDrawer();
    });

    ui.setupRulesBackdrop.addEventListener("click", function () {
      state.setupRulesOpen = false;
      renderSetupRulesDrawer();
    });

    ui.toggleScoring.addEventListener("click", function () {
      if (state.phase !== "summary" || state.summaryStep !== 1) {
        return;
      }
      state.summaryScoringOpen = !state.summaryScoringOpen;
      renderSummaryPhase();
    });

    ui.historyToggle.addEventListener("click", function () {
      state.historyOpen = !state.historyOpen;
      renderHistoryDrawer();
    });

    ui.historyClose.addEventListener("click", function () {
      state.historyOpen = false;
      renderHistoryDrawer();
    });

    ui.historyBackdrop.addEventListener("click", function () {
      state.historyOpen = false;
      renderHistoryDrawer();
    });
  }

  function closeMenuSheet() {
    state.menuOpen = false;
    state.menuView = "hub";
    renderMenuSheet();
  }

  function profileBidAttemptCount() {
    return profile.human.bidsMade + profile.human.bidsSet;
  }

  function profileBidRateText() {
    var attempts = profileBidAttemptCount();

    if (!attempts) {
      return "0%";
    }
    return Math.round((profile.human.bidsMade / attempts) * 100) + "%";
  }

  function profileWinRateText() {
    var matches = profile.totals.matchesCompleted;

    if (!matches) {
      return "No completed matches yet";
    }
    return Math.round((profile.totals.matchesWon / matches) * 100) + "% match win rate";
  }

  function menuContextText() {
    return "";
  }

  function menuTitleText() {
    if (state.menuView === "profile") {
      return "Full Profile";
    }
    if (state.menuView === "achievements") {
      return "Achievements";
    }
    if (state.menuView === "settings") {
      return "Settings";
    }
    return "Menu";
  }

  function visibleRulesetIds() {
    var ids = {};

    Object.keys(GAME_TYPES).forEach(function (gameTypeId) {
      var rulesetId = GAME_TYPES[gameTypeId].rulesetId;
      if (rulesetId && RULESETS[rulesetId]) {
        ids[rulesetId] = true;
      }
    });
    return Object.keys(ids);
  }

  function settingsRulesetParagraph(rules) {
    if (!rules) {
      return "";
    }
    if (rules.id === "kentuckyHouse") {
      return "Kentucky House Rules is classic 4-player partnership Rook with the full deck, a 5-card kitty, and setback scoring. The bidder takes the kitty, buries five cards, chooses the Power suit, and must reach the contract while both teams race to 500 points.";
    }
    if (rules.id === "fivePlayerCallPartner") {
      return "5-Player Call Partner uses a full deck and a 7-card nest, with one temporary hidden teammate each round. After winning the bid and setting the kitty, the bidder names a callable card to reveal their partner, and that pair tries to make contract against the other three players while everyone races to 400 individual points.";
    }
    if (rules.id === "westernKentucky") {
      return "Western Kentucky trims the deck by removing 2, 3, and 4 of each color while keeping house-style flow and setback scoring. The Red 1 is always treated as the highest trump card, followed by the Rook, which makes every trump decision more volatile and tactical.";
    }
    if (rules.id === "tournament") {
      return "Tournament Rook follows a 41-card tournament deck with no last-trick bonus, lower bid ranges, and a 300-point match target. Play starts left of dealer and emphasizes consistency, efficient counters, and disciplined contract management.";
    }
    return "Playing " + rules.label + ".";
  }

  function renderFullProfileView() {
    var bidAttempts = profileBidAttemptCount();
    var matchWinRate = formatRate(profile.totals.matchesWon, profile.totals.matchesCompleted);
    var avgRoundPoints = profile.totals.roundsCompleted
      ? formatAverage(profile.totals.usPointsEarned / profile.totals.roundsCompleted)
      : 0;
    var avgWinningBid = profile.human.winningBidCount
      ? formatAverage(profile.human.winningBidTotal / profile.human.winningBidCount)
      : 0;

    ui.menuHeroRecord.textContent = profile.totals.matchesWon + "-" + profile.totals.matchesLost;
    ui.menuHeroWinRate.textContent = matchWinRate;
    ui.menuHeroBestRound.textContent = String(profile.human.bestRoundPoints);
    ui.menuHeroCurrentStreak.textContent = String(profile.streaks.currentMatchWinStreak);
    ui.menuHeroBidRate.textContent = profileBidRateText();
    ui.menuFullMatchesStarted.textContent = String(profile.totals.matchesStarted);
    ui.menuFullMatchesCompleted.textContent = String(profile.totals.matchesCompleted);
    ui.menuFullWins.textContent = String(profile.totals.matchesWon);
    ui.menuFullLosses.textContent = String(profile.totals.matchesLost);
    ui.menuFullRounds.textContent = String(profile.totals.roundsCompleted);
    ui.menuFullBestRound.textContent = String(profile.human.bestRoundPoints);
    ui.menuFullAvgRoundPoints.textContent = String(avgRoundPoints);
    ui.menuFullBestMatchScore.textContent = String(profile.performance.bestMatchScore);
    ui.menuFullBiggestWinMargin.textContent = String(profile.performance.biggestWinMargin);
    ui.menuFullBiggestLossMargin.textContent = String(profile.performance.biggestLossMargin);
    ui.menuFullComebackWins.textContent = String(profile.performance.comebackWins);
    ui.menuFullCloseWins.textContent = String(profile.performance.closeWins);
    ui.menuFullBidsWon.textContent = String(profile.human.bidsWon);
    ui.menuFullAvgWinningBid.textContent = String(avgWinningBid);
    ui.menuFullPerfect200.textContent = String(profile.human.perfectBid200Made);
    ui.menuFullOpponentSetRate.textContent = formatRate(
      profile.opponents.opponentSetRounds,
      profile.opponents.opponentBidRounds
    );
    ui.menuFullOpponentSetRaw.textContent =
      profile.opponents.opponentSetRounds + "/" + profile.opponents.opponentBidRounds;
    ui.menuFullBidAttempts.textContent = String(bidAttempts);
    ui.menuFullProgressStatus.textContent = "Tracking all game modes";
    ui.menuFullUsPoints.textContent = String(profile.totals.usPointsEarned);
    ui.menuFullThemPoints.textContent = String(profile.totals.themPointsEarned);
    ui.menuFullCurrentStreak.textContent = String(profile.streaks.currentMatchWinStreak);
    ui.menuFullBestStreak.textContent = String(profile.streaks.bestMatchWinStreak);
    renderRulesetRecords();
    renderPlayerRecords();
  }

  function renderRulesetRecords() {
    var rulesetIds = visibleRulesetIds();

    ui.menuRulesetRecords.innerHTML = "";

    rulesetIds.forEach(function (rulesetId) {
      var config = RULESETS[rulesetId];
      var record = ensureRulesetRecord(rulesetId);
      var row = document.createElement("div");
      var title = document.createElement("strong");
      var detail = document.createElement("span");

      row.className = "profile-list-row";
      title.textContent = config.label;
      detail.textContent = formatRecord(record.wins, record.losses) + " record • " +
        formatRate(record.wins, record.matchesCompleted) + " win rate";
      row.appendChild(title);
      row.appendChild(detail);
      ui.menuRulesetRecords.appendChild(row);
    });
  }

  function renderPlayerRecords() {
    ui.menuPlayerRecords.innerHTML = "";

    PLAYER_NAMES.slice(1).forEach(function (name) {
      var record = ensurePlayerRecord(name);
      var row = document.createElement("div");
      var title = document.createElement("strong");
      var detail = document.createElement("span");

      row.className = "profile-list-row";
      title.textContent = name;
      detail.textContent = "With " + name + ": " +
        formatRecord(record.teammateWins, record.teammateLosses) +
        " • Vs. " + name + ": " +
        formatRecord(record.opponentWins, record.opponentLosses);
      row.appendChild(title);
      row.appendChild(detail);
      ui.menuPlayerRecords.appendChild(row);
    });
  }

  function renderStickerBook() {
    var achievementsPageActive = state.stickerBookPage !== "collector";

    ui.showAchievementBook.classList.toggle("active", achievementsPageActive);
    ui.showAchievementBook.setAttribute("aria-selected", achievementsPageActive ? "true" : "false");
    ui.showCollectorSheet.classList.toggle("active", !achievementsPageActive);
    ui.showCollectorSheet.setAttribute("aria-selected", !achievementsPageActive ? "true" : "false");
    ui.menuStickerAchievements.classList.toggle("hidden", !achievementsPageActive);
    ui.menuStickerCollector.classList.toggle("hidden", achievementsPageActive);
    renderAchievementBook();
    renderCollectorSheet();
  }

  function renderAchievementBook() {
    var orderedDefs = ACHIEVEMENT_DEFS.slice().sort(function (a, b) {
      var aUnlocked = profile.achievements.unlocked[a.id];
      var bUnlocked = profile.achievements.unlocked[b.id];

      if (aUnlocked && !bUnlocked) {
        return -1;
      }
      if (!aUnlocked && bUnlocked) {
        return 1;
      }
      if (aUnlocked && bUnlocked) {
        return String(bUnlocked.unlockedAt || "").localeCompare(String(aUnlocked.unlockedAt || ""));
      }
      return a.title.localeCompare(b.title);
    });

    ui.menuStickerAchievements.innerHTML = "";

    orderedDefs.forEach(function (def) {
      var unlocked = profile.achievements.unlocked[def.id];
      var card = document.createElement("article");
      var copy = document.createElement("div");
      var title = document.createElement("strong");
      var description = document.createElement("p");
      var status = document.createElement("span");
      var well = document.createElement("div");
      var helper;
      var image;

      card.className = "achievement-card" + (unlocked ? " is-unlocked" : "");
      copy.className = "achievement-copy";
      title.textContent = def.title;
      description.className = "support-text";
      description.textContent = def.description;
      status.className = "achievement-status";
      status.textContent = unlocked ? "Unlocked" : "Locked";
      well.className = "achievement-sticker-well" + (unlocked ? " is-filled" : "");

      if (unlocked) {
        image = document.createElement("img");
        image.className = "achievement-sticker";
        image.src = unlocked.stickerAsset || stickerAssetFromPool(def.stickerPool);
        image.alt = "";
        image.decoding = "async";
        image.setAttribute("aria-hidden", "true");
        image.style.transform = "rotate(" + (unlocked.tilt || 0) + "deg)";
        well.appendChild(image);
      } else {
        helper = document.createElement("span");
        helper.textContent = "Sticker spot";
        well.appendChild(helper);
      }

      copy.appendChild(title);
      copy.appendChild(description);
      copy.appendChild(status);
      card.appendChild(copy);
      card.appendChild(well);
      ui.menuStickerAchievements.appendChild(card);
    });
  }

  function renderCollectorSheet() {
    ui.menuCollectorStatus.textContent = profile.collectionStickers.length
      ? "Total wins = " + profile.collectionStickers.length
      : "No win stickers yet";
    ui.menuStickerCanvas.innerHTML = "";

    profile.collectionStickers.forEach(function (item, index) {
      var sticker = document.createElement("div");
      var image;

      sticker.className = "collector-canvas-sticker" + (index === profile.collectionStickers.length - 1 ? " is-fresh" : "");
      sticker.style.left = item.x + "%";
      sticker.style.top = item.y + "%";
      sticker.style.setProperty("--collector-rotation", item.rotation + "deg");
      sticker.style.setProperty("--collector-scale", String(item.scale || 1));

      image = document.createElement("img");
      image.src = item.asset || STICKER_CONFIG.rook.assets[0];
      image.alt = "";
      image.decoding = "async";
      image.setAttribute("aria-hidden", "true");
      sticker.appendChild(image);
      ui.menuStickerCanvas.appendChild(sticker);
    });

    if (!profile.collectionStickers.length) {
      var empty = document.createElement("div");
      empty.className = "collector-canvas-empty";
      empty.textContent = "Your first match win sticker will land here.";
      ui.menuStickerCanvas.appendChild(empty);
    }
  }

  function renderAchievementsView() {
    var unlockedCount = unlockedAchievementCount();

    ui.menuStickerBookStatus.textContent = unlockedCount + " of " + totalAchievementCount() + " unlocked";
    renderStickerBook();
  }

  function populateSettingsSelect(selectNode, options, selectedId) {
    var optionIds = Object.keys(options);

    selectNode.innerHTML = "";

    optionIds.forEach(function (optionId) {
      var option = document.createElement("option");

      option.value = optionId;
      option.textContent = options[optionId].label;
      option.selected = optionId === selectedId;
      selectNode.appendChild(option);
    });
  }

  function renderSettingsView() {
    var rules = getRuleConfig();

    populateSettingsSelect(ui.menuBackgroundSelect, BACKGROUND_THEMES, profile.visuals.backgroundThemeId);
    populateSettingsSelect(ui.menuTabletopSelect, TABLETOP_THEMES, profile.visuals.tabletopThemeId);
    ui.menuRulesetName.textContent = rules.label;
    ui.menuRulesDetail.textContent = settingsRulesetParagraph(rules);
    ui.menuAiSettingsStatus.textContent = AI_PERSONAS.length + " archetypes";
    ui.menuAiPlayerSettings.innerHTML = "";

    AI_PERSONAS.forEach(function (persona) {
      var card = document.createElement("div");
      var header = document.createElement("strong");
      var subhead = document.createElement("span");

      card.className = "ai-player-card";
      header.textContent = persona.name + " (" + aiStyleLabel(persona.styleId) + ")";
      card.appendChild(header);
      subhead.className = "support-text";
      subhead.textContent = persona.descriptor + " playstyle";
      card.appendChild(subhead);

      AI_TUNING_KEYS.forEach(function (key) {
        var row = document.createElement("div");
        var label = document.createElement("label");
        var value = document.createElement("span");
        var slider = document.createElement("input");
        var current = profile.aiTuning[persona.id][key];

        row.className = "ai-slider-row";
        label.textContent = AI_TUNING_LABELS[key];
        value.setAttribute("data-ai-value", "true");
        value.textContent = current.toFixed(2);
        slider.type = "range";
        slider.min = "0.70";
        slider.max = "1.35";
        slider.step = "0.01";
        slider.value = String(current);
        slider.setAttribute("data-persona", persona.id);
        slider.setAttribute("data-key", key);
        row.appendChild(label);
        row.appendChild(value);
        row.appendChild(slider);
        card.appendChild(row);
      });

      ui.menuAiPlayerSettings.appendChild(card);
    });
  }

  function renderMenuSheet() {
    var bidAttempts = profileBidAttemptCount();
    var hubViewActive = state.menuView === "hub";
    var profileViewActive = state.menuView === "profile";
    var achievementsViewActive = state.menuView === "achievements";
    var settingsViewActive = state.menuView === "settings";

    ui.menuToggle.setAttribute("aria-expanded", state.menuOpen ? "true" : "false");
    ui.menuSheet.classList.toggle("open", state.menuOpen);
    ui.menuSheet.setAttribute("aria-hidden", state.menuOpen ? "false" : "true");
    ui.menuBackdrop.classList.toggle("hidden", !state.menuOpen);

    ui.menuHubView.classList.toggle("hidden", !hubViewActive);
    ui.menuProfileView.classList.toggle("hidden", !profileViewActive);
    ui.menuAchievementsView.classList.toggle("hidden", !achievementsViewActive);
    ui.menuSettingsView.classList.toggle("hidden", !settingsViewActive);
    ui.menuBack.classList.toggle("hidden", hubViewActive);
    ui.menuHome.classList.toggle("hidden", !hubViewActive);
    ui.menuTitle.textContent = menuTitleText();
    ui.menuContext.textContent = menuContextText();
    ui.menuContext.classList.toggle("hidden", !ui.menuContext.textContent);

    ui.menuProfileMatches.textContent = String(profile.totals.matchesCompleted);
    ui.menuProfileRecord.textContent = profile.totals.matchesWon + "-" + profile.totals.matchesLost;
    ui.menuProfileBidRate.textContent = profileBidRateText();
    ui.menuProfileBestRound.textContent = String(profile.human.bestRoundPoints);
    renderFullProfileView();
    renderAchievementsView();
    renderSettingsView();
  }

  function startRound() {
    var playerCount = activePlayersForState().length;
    var aiSeatCount = activeAiSeatsForState().length;

    clearPendingTimeout();
    clearPlayerReactionCooldown();
    clearPlayReaction(false);

    if (state.gameOver) {
      resetMatchSession();
    }

    state.phase = "bidding";
    state.bidder = null;
    state.winningBid = null;
    state.trump = null;
    state.trumpStage = "setup";
    state.callPartnerCardId = null;
    state.callPartnerPlayer = null;
    state.callPartnerRevealed = false;
    state.askPartnerToLead = false;
    state.pendingCallPartnerCardId = null;
    state.pendingAskPartnerToLead = false;
    state.selectedTrump = null;
    state.selectedBid = getRuleConfig().minBid;
    state.currentBid = null;
    state.currentBidHolder = null;
    state.currentBidTurn = (state.dealer + 1) % playerCount;
    state.bidEntries = [];
    state.bidStatuses = Array(playerCount).fill("-");
    state.passed = Array(playerCount).fill(false);
    state.buriedKitty = [];
    state.kittyReviewHand = [];
    state.selectedDiscards = [];
    state.exchangeOrder = [];
    state.exchangeIndex = 0;
    state.exchangeSwapsUsed = Array(MAX_PLAYER_COUNT).fill(0);
    state.exchangeSelectedHandCardId = null;
    state.exchangeSelectedKittyCardId = null;
    state.hands = Array(MAX_PLAYER_COUNT).fill(null).map(function () { return []; });
    state.trick = [];
    state.leadSuit = null;
    state.currentPlayer = 0;
    state.winningCardPlayer = null;
    state.playerPoints = Array(MAX_PLAYER_COUNT).fill(0);
    state.roundPoints = [0, 0];
    state.trickCounts = [0, 0];
    state.roundMessage = "";
    state.summary = null;
    state.scoringInterstitial = null;
    state.scoringMeterProgress = [0, 0];
    state.scoringOutcomeVisible = false;
    state.summaryStep = 1;
    state.summaryMatchGif = null;
    state.summaryScoringOpen = false;
    state.aiTrumpReady = false;
    state.aiTrumpMeterStarted = false;
    state.dealAnimating = true;
    state.dealVisibleCount = 0;
    state.dealSeatCounts = Array(aiSeatCount).fill(0);
    state.dealRevealed = false;
    state.dealRevealAnimating = false;
    state.biddingComplete = false;
    state.biddingStarted = false;
    resetTeammateOnlyBidState();
    state.historyOpen = false;
    state.previousTrick = null;
    state.completedTricks = [];
    state.busy = false;
    clearSticker(true);

    dealInitialHands();
    state.hands = cloneHands(state.initialHands);
    syncSelectedBid();
    markMatchDirty();
    render();
    runDealAnimation();
  }

  function dealInitialHands() {
    var deck = buildDeck();
    var handSize = getRuleConfig().handSize;
    var kittySize = getRuleConfig().kittySize;
    shuffle(deck, Date.now() % 100000 + state.dealer * 17);
    state.initialHands = Array(MAX_PLAYER_COUNT).fill(null).map(function () { return []; });

    activePlayersForState().forEach(function (player) {
      state.initialHands[player] = deck.splice(0, handSize);
      sortHand(state.initialHands[player], null);
    });

    state.kitty = deck.splice(0, kittySize);
  }

  function continueBidding() {
    if (state.phase !== "bidding" || state.biddingComplete || !state.biddingStarted) {
      return;
    }

    if (biddingIsOver()) {
      finishBidding();
      return;
    }

    if (state.currentBidTurn === 0) {
      syncSelectedBid();
      render();
      return;
    }

    state.busy = true;
    render();

    schedule(function () {
      var player = state.currentBidTurn;
      var bid = chooseAiBid(player);
      if (bid === null) {
        recordPass(player);
      } else {
        recordBid(player, bid);
      }
      state.busy = false;
      render();
      continueBidding();
    }, BID_DELAY);
  }

  function biddingIsOver() {
    if (state.currentBid === getRuleConfig().maxBid) {
      return true;
    }
    if (state.currentBid !== null && everyoneElsePassed()) {
      return true;
    }
    return false;
  }

  function everyoneElsePassed() {
    var active = 0;
    activePlayersForState().forEach(function (player) {
      if (player !== state.currentBidHolder && !state.passed[player]) {
        active += 1;
      }
    });
    return active === 0;
  }

  function resetTeammateOnlyBidState() {
    state.teamOnlyBidAnchor = null;
    state.teamOnlyBidTeam = null;
  }

  function updateTeammateOnlyBidState() {
    var remaining;
    var team;

    if (isCallPartnerRuleset() || state.currentBid === null) {
      resetTeammateOnlyBidState();
      return;
    }

    remaining = activePlayersForState().filter(function (player) {
      return !state.passed[player];
    });

    if (remaining.length !== 2 || teamForPlayer(remaining[0]) !== teamForPlayer(remaining[1])) {
      resetTeammateOnlyBidState();
      return;
    }

    team = teamForPlayer(remaining[0]);
    if (state.teamOnlyBidTeam !== team || state.teamOnlyBidAnchor === null) {
      state.teamOnlyBidTeam = team;
      state.teamOnlyBidAnchor = state.currentBid;
    }
  }

  function callPartnerHighBidTolerance(floor) {
    if (!isCallPartnerRuleset()) {
      return 0;
    }
    if (floor >= 170) {
      return 15;
    }
    if (floor >= 150) {
      return 10;
    }
    if (floor >= 130) {
      return 5;
    }
    return 0;
  }

  function chooseAiBid(player) {
    var plan = evaluateBidPlan(player);
    var profile = getAiProfile(player);
    var floor = getMinimumBid();
    var match = getAiMatchState(player, profile);
    var teammateHolding = !isCallPartnerRuleset() && state.currentBidHolder !== null &&
      state.currentBidHolder !== player &&
      teamForPlayer(state.currentBidHolder) === teamForPlayer(player);
    var activeOpponents = countActiveOpponents(player);
    var target = plan.targetBid;
    var conservativeHand = plan.score < 84;
    var highBidTolerance = callPartnerHighBidTolerance(floor);
    var bid;
    var extraRoom;

    if (target < floor || floor > 175) {
      return null;
    }
    if (highBidTolerance > 0) {
      if (target - floor < highBidTolerance) {
        return null;
      }
      target -= highBidTolerance;
    }
    if (state.currentBid !== null &&
      target === floor &&
      match.shouldReduceVariance > 0.78 &&
      conservativeHand &&
      teamForPlayer(state.currentBidHolder) !== teamForPlayer(player)) {
      return null;
    }

    if (state.currentBid === null) {
      bid = floor;
      if (target >= floor + 20) {
        bid += 10;
      } else if (target >= floor + 10) {
        bid += 5;
      }
      if (match.mustStopOpponents > 0.75 && target - bid >= 5) {
        bid += 5;
      }
      if (match.shouldReduceVariance > 0.8 && conservativeHand && bid > floor) {
        bid -= 5;
      }
      return Math.min(getRuleConfig().maxBid, Math.max(floor, Math.min(target, bid)));
    }

    if (teammateHolding) {
      var pressure = match.shouldIncreaseVariance +
        match.mustStopOpponents * 0.6 -
        match.shouldReduceVariance * 0.8;
      var teamOnlyAnchor = state.teamOnlyBidAnchor === null ? state.currentBid : state.teamOnlyBidAnchor;
      var teamOnlyLift = Math.max(0, state.currentBid - teamOnlyAnchor);
      var takeoverThreshold = activeOpponents === 0 ? 25 : 20;
      var teamEdge = target - state.currentBid;
      var maxTeamOnlyBid = Math.min(getRuleConfig().maxBid, teamOnlyAnchor + 10);

      if (pressure > 0.8) {
        takeoverThreshold -= 5;
      }
      if (activeOpponents === 0) {
        takeoverThreshold = teamOnlyLift >= 5 ? 15 : 10;
        if (teamEdge < takeoverThreshold || floor > maxTeamOnlyBid) {
          return null;
        }
        return Math.min(target, maxTeamOnlyBid, floor);
      }
      if (teamEdge < takeoverThreshold) {
        return null;
      }

      bid = floor;
      if (activeOpponents > 0 && teamEdge >= takeoverThreshold + 15) {
        bid += 5;
      }

      return Math.min(getRuleConfig().maxBid, Math.min(target, bid));
    }

    bid = floor;
    extraRoom = target - floor;

    if (extraRoom >= 20) {
      bid += 10;
    } else if (extraRoom >= 10) {
      bid += 5;
    }
    if (match.trailingPressure > 0.65 && target - bid >= 5) {
      bid += 5;
    }
    if (match.mustStopOpponents > 0.7 && target - bid >= 5) {
      bid += 5;
    }
    if (match.closingPressure > 0.7 && bid > floor) {
      bid -= 5;
    }
    if (match.shouldReduceVariance > 0.8 && conservativeHand && bid > floor) {
      bid -= 5;
    }

    return Math.min(getRuleConfig().maxBid, Math.min(target, bid));
  }

  function countActiveOpponents(player) {
    if (isCallPartnerRuleset() && state.callPartnerPlayer === null) {
      return activePlayersForState().reduce(function (active, otherPlayer) {
        if (otherPlayer !== player && !state.passed[otherPlayer]) {
          return active + 1;
        }
        return active;
      }, 0);
    }

    var team = teamForPlayer(player);
    var active = 0;

    activePlayersForState().forEach(function (otherPlayer) {
      if (teamForPlayer(otherPlayer) !== team && !state.passed[otherPlayer]) {
        active += 1;
      }
    });

    return active;
  }

  function estimateHandStrength(cards) {
    return cards.reduce(function (total, card) {
      if (card.isRook) {
        return total + 28;
      }
      if (card.rank === 1) {
        return total + 16;
      }
      if (card.rank >= 12) {
        return total + 8;
      }
      if (card.rank >= 10) {
        return total + 6;
      }
      if (card.rank === 5) {
        return total + 5;
      }
      return total + 2;
    }, 0);
  }

  function getAiProfile(player) {
    var persona = personaForPlayer(state, player);
    var styleId = persona ? persona.styleId : (AI_STYLE_BY_PLAYER[player] || "steady");
    var tuning = persona && profile.aiTuning && profile.aiTuning[persona.id] ? profile.aiTuning[persona.id] : {};
    var base = AI_PROFILES[styleId] || AI_PROFILES.steady;
    var merged = {};

    Object.keys(base).forEach(function (key) {
      merged[key] = base[key];
    });
    AI_TUNING_KEYS.forEach(function (key) {
      if (typeof tuning[key] === "number") {
        merged[key] = tuning[key];
      }
    });
    return merged;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function roundToBidStep(value) {
    return Math.round(value / getRuleConfig().bidStep) * getRuleConfig().bidStep;
  }

  function teammateForPlayer(player) {
    if (isCallPartnerRuleset()) {
      if (!state.callPartnerCardId) {
        return null;
      }
      if (player === state.bidder) {
        return state.callPartnerPlayer;
      }
      if (player === state.callPartnerPlayer) {
        return state.bidder;
      }
      return null;
    }
    return (player + 2) % 4;
  }

  function getAiMatchState(player, profile) {
    var matchTarget = getRuleConfig().matchTarget;
    var closingThreshold = matchTarget * 0.86;
    var closingWindow = Math.max(40, matchTarget * 0.14);
    var stopWindow = Math.max(60, matchTarget * 0.19);
    var clinchWindow = Math.max(65, matchTarget * 0.21);
    var varianceMargin = Math.max(90, matchTarget * 0.34);
    var deficitScale = Math.max(120, matchTarget * 0.3);
    var team = teamForPlayer(player);
    var opponentTeam = team === 0 ? 1 : 0;
    var ourScore = isCallPartnerRuleset()
      ? (state.individualMatchPoints[player] || 0)
      : state.matchPoints[team];
    var theirScore = isCallPartnerRuleset()
      ? activePlayersForState().reduce(function (best, otherPlayer) {
          if (otherPlayer === player) {
            return best;
          }
          return Math.max(best, state.individualMatchPoints[otherPlayer] || 0);
        }, 0)
      : state.matchPoints[opponentTeam];
    var deficit = theirScore - ourScore;
    var ourDistanceToWin = Math.max(0, getRuleConfig().matchTarget - ourScore);
    var theirDistanceToWin = Math.max(0, getRuleConfig().matchTarget - theirScore);
    var trailingPressure = clamp(deficit / deficitScale, 0, 1) * profile.riskBias;
    var closingPressure = clamp((ourScore - closingThreshold) / closingWindow, 0, 1) * profile.safetyBias;
    var disruptionPressure = clamp((theirScore - closingThreshold) / closingWindow, 0, 1) * profile.disruptionBias;
    var mustStopOpponents = clamp((stopWindow - theirDistanceToWin) / stopWindow, 0, 1) * profile.denialBias;
    var canClinchSoon = clamp((clinchWindow - ourDistanceToWin) / clinchWindow, 0, 1) * profile.contractLockBias;
    var leadMargin = ourScore - theirScore;
    var shouldReduceVariance = clamp(
      Math.max(canClinchSoon * 0.9, leadMargin > 0 ? leadMargin / varianceMargin : 0) * profile.safetyBias,
      0,
      1
    );
    var shouldIncreaseVariance = clamp(
      Math.max(trailingPressure, mustStopOpponents * 0.85) * profile.riskBias,
      0,
      1
    );

    return {
      team: team,
      opponentTeam: opponentTeam,
      ourScore: ourScore,
      theirScore: theirScore,
      ourDistanceToWin: ourDistanceToWin,
      theirDistanceToWin: theirDistanceToWin,
      leadingMargin: leadMargin,
      trailingPressure: trailingPressure,
      closingPressure: closingPressure,
      disruptionPressure: disruptionPressure,
      mustStopOpponents: mustStopOpponents,
      canClinchSoon: canClinchSoon,
      shouldReduceVariance: shouldReduceVariance,
      shouldIncreaseVariance: shouldIncreaseVariance
    };
  }

  function getAiRoundState(player, analysis) {
    var team = teamForPlayer(player);
    var opponentTeam = team === 0 ? 1 : 0;
    var bidderTeam = state.bidder === null ? null : teamForPlayer(state.bidder);
    var hand = state.hands[player] || state.initialHands[player] || [];
    var remainingCards = hand ? hand.length : getRuleConfig().handSize;
    var awardedPoints = state.roundPoints[0] + state.roundPoints[1];
    var remainingCardPoints = Math.max(0, scoringTotalPoints() - awardedPoints);
    var lastTrickSwing = remainingCards > 0 ? getRuleConfig().lastTrickBonus + buriedKittyPoints() : 0;
    var totalSwingRemaining = remainingCardPoints + (remainingCards > 0 ? getRuleConfig().lastTrickBonus : 0);
    var bidderPoints = bidderTeam === null ? 0 : state.roundPoints[bidderTeam];
    var contractPressure = 0;
    var disruptionPressure = 0;
    var pointsNeededToMake = 0;
    var contractLocked = 0;
    var setUrgency = 0;
    var extraPointPressure = 0;
    var closerWindow;
    var closerStrength;
    var closerPressure;

    if (bidderTeam === team && state.winningBid !== null) {
      pointsNeededToMake = Math.max(0, state.winningBid - state.roundPoints[team]);
      contractPressure = clamp(
        pointsNeededToMake / Math.max(25, remainingCardPoints * 0.6 + lastTrickSwing),
        0,
        1
      );
      contractLocked = clamp(
        (state.roundPoints[team] - state.winningBid + Math.max(10, lastTrickSwing * 0.35)) /
          Math.max(25, lastTrickSwing + 15),
        0,
        1
      ) * 1.05;
      extraPointPressure = clamp(
        Math.max(0, remainingCardPoints - pointsNeededToMake) / 85,
        0,
        1
      );
    } else if (bidderTeam !== null && state.winningBid !== null) {
      pointsNeededToMake = Math.max(0, state.winningBid - bidderPoints);
      disruptionPressure = clamp((bidderPoints - (state.winningBid - 45)) / 50, 0, 1);
      setUrgency = clamp((45 - pointsNeededToMake) / 45, 0, 1);
      extraPointPressure = clamp(
        Math.max(0, state.roundPoints[team] - state.roundPoints[opponentTeam]) / 80,
        0,
        1
      );
    }

    closerWindow = clamp((5 - remainingCards) / 3, 0, 1);
    closerStrength = state.phase === "play" ? estimateCloserStrength(player, hand, state.trump, analysis) : 0;
    closerPressure = clamp(closerWindow * (closerStrength / 9), 0, 1);

    return {
      team: team,
      opponentTeam: opponentTeam,
      bidderTeam: bidderTeam,
      ourRoundPoints: state.roundPoints[team],
      theirRoundPoints: state.roundPoints[opponentTeam],
      bidderPoints: bidderPoints,
      pointsNeededToMake: pointsNeededToMake,
      remainingCardPoints: remainingCardPoints,
      totalSwingRemaining: totalSwingRemaining,
      lastTrickSwing: lastTrickSwing,
      contractPressure: contractPressure,
      disruptionPressure: disruptionPressure,
      contractLocked: contractLocked,
      setUrgency: setUrgency,
      extraPointPressure: extraPointPressure,
      closerWindow: closerWindow,
      closerStrength: closerStrength,
      closerPressure: closerPressure,
      remainingCards: remainingCards
    };
  }

  function evaluateCloserCandidate(card, player, hand, trump, analysis) {
    var suit = effectiveSuit(card, trump);
    var higherUnknown = countHigherUnknownCards(card, player, trump, hand, analysis);
    var score = cardControlScore(card, trump) * 1.9;

    if (suit === trump) {
      score += 4.5;
    }
    if (card.isRook) {
      score += 5;
    } else if (card.rank === 1) {
      score += 2.8;
    }
    if (higherUnknown === 0) {
      score += 2;
    }
    score += cardPoints(card) * 0.15;
    score -= higherUnknown * 2.1;

    return {
      id: card.id,
      score: score,
      higherUnknown: higherUnknown,
      isTrump: suit === trump
    };
  }

  function estimateCloserStrength(player, hand, trump, analysis) {
    if (!hand || !hand.length || !trump) {
      return 0;
    }

    return hand.reduce(function (best, card) {
      return Math.max(best, evaluateCloserCandidate(card, player, hand, trump, analysis).score);
    }, 0);
  }

  function findReservedCloser(player, hand, trump, round, analysis) {
    var candidates;
    var threshold;
    var best;

    if (!hand || hand.length <= 1 || !trump || !round || round.remainingCards > 5) {
      return null;
    }

    candidates = hand.map(function (card) {
      return evaluateCloserCandidate(card, player, hand, trump, analysis);
    }).sort(function (a, b) {
      return b.score - a.score;
    });
    best = candidates[0];
    threshold = round.remainingCards <= 3 ? 4.5 : 6.2;

    if (!best || best.score < threshold) {
      return null;
    }
    if (best.higherUnknown > Math.max(1, round.remainingCards - 2) && !best.isTrump) {
      return null;
    }

    return best;
  }

  function deriveAiTacticalMode(player, profile, match, round) {
    var mode = {
      label: "balanced",
      pushToMake: 0,
      setTheBid: 0,
      cashPoints: 0,
      preserveCloser: 0,
      protectLead: 0,
      feedPartner: 0,
      denyPoints: 0
    };

    if (round.bidderTeam === null) {
      return mode;
    }

    if (round.bidderTeam === round.team) {
      mode.pushToMake = clamp(
        round.contractPressure * (1.1 + match.shouldIncreaseVariance * 0.35) +
          match.mustStopOpponents * 0.2,
        0,
        1.6
      );
      mode.protectLead = clamp(
        round.contractLocked * profile.contractLockBias +
          match.shouldReduceVariance * 0.8 +
          match.canClinchSoon * 0.35,
        0,
        1.6
      );
      mode.preserveCloser = clamp(
        round.closerPressure * profile.closerBias +
          round.closerWindow * (0.35 + mode.protectLead * 0.5),
        0,
        1.6
      );
      mode.cashPoints = clamp(
        round.contractLocked * 0.55 +
          round.extraPointPressure * profile.extraPointGreed +
          match.shouldIncreaseVariance * 0.45 -
          match.shouldReduceVariance * 0.35,
        0,
        1.4
      );
      mode.feedPartner = clamp(
        profile.partnerTrust * 0.35 +
          mode.protectLead * 0.3 +
          round.contractLocked * 0.2,
        0,
        1.3
      );
      mode.denyPoints = clamp(
        match.mustStopOpponents * 0.3 + match.shouldReduceVariance * 0.2,
        0,
        0.8
      );
      if (mode.protectLead >= 1 && mode.preserveCloser > mode.pushToMake) {
        mode.label = "protect_contract";
      } else if (mode.pushToMake > 0.95) {
        mode.label = "press_for_make";
      } else if (mode.cashPoints > 0.9) {
        mode.label = "cash_points";
      }
      return mode;
    }

    mode.setTheBid = clamp(
      round.setUrgency * 1.15 * profile.denialBias +
        match.mustStopOpponents * 0.7 +
        match.disruptionPressure * 0.4,
      0,
      1.7
    );
    mode.denyPoints = clamp(
      match.mustStopOpponents * 0.8 + round.setUrgency * 0.5,
      0,
      1.5
    );
    mode.protectLead = clamp(
      match.shouldReduceVariance * 0.6 + mode.setTheBid * 0.25,
      0,
      1.2
    );
    mode.preserveCloser = clamp(
      round.closerPressure * profile.closerBias +
        round.closerWindow * 0.3 +
        mode.setTheBid * 0.25,
      0,
      1.4
    );
    mode.cashPoints = clamp(
      round.extraPointPressure * profile.extraPointGreed * 0.45 +
        match.shouldIncreaseVariance * 0.35 -
        match.mustStopOpponents * 0.25,
      0,
      1.1
    );
    mode.feedPartner = clamp(
      profile.partnerTrust * 0.25 + mode.protectLead * 0.25,
      0,
      1
    );
    if (mode.setTheBid > 0.95) {
      mode.label = "set_the_bid";
    } else if (mode.preserveCloser > 0.95) {
      mode.label = "preserve_closer";
    }

    return mode;
  }

  function buildEffectiveSuitCounts(cards, trump) {
    var counts = { red: 0, green: 0, yellow: 0, orange: 0 };

    cards.forEach(function (card) {
      counts[effectiveSuit(card, trump)] += 1;
    });

    return counts;
  }

  function countSuitInHand(cards, suit, trump) {
    return cards.reduce(function (total, card) {
      return total + (effectiveSuit(card, trump) === suit ? 1 : 0);
    }, 0);
  }

  function getPlayedCards() {
    return collectPlayedCardsModule(state);
  }

  function buildAiTurnAnalysis(player) {
    return createAiTurnAnalysisModule({
      state: state,
      player: player,
      hand: state.hands[player] || [],
      trump: state.trump,
      rules: getRuleConfig(),
      suits: SUITS,
      buildDeck: buildDeckModule
    });
  }

  function countRemainingTrumpOutsidePlayer(player, analysis) {
    return countRemainingTrumpOutsidePlayerModule(
      player,
      state.hands[player] || [],
      state.trump,
      analysis || buildAiTurnAnalysis(player),
      effectiveSuit
    );
  }

  function countHigherUnknownCards(card, player, trump, knownCards, analysis) {
    return countHigherUnknownCardsModule(
      card,
      trump,
      knownCards || state.hands[player] || [],
      analysis || buildAiTurnAnalysis(player),
      effectiveSuit,
      playStrength
    );
  }

  function cardControlScore(card, trump) {
    if (card.isRook) {
      return 6.5;
    }
    if (card.rank === 1) {
      return card.suit === trump ? 7.5 : 5.5;
    }
    if (card.suit === trump) {
      if (card.rank === 14) {
        return 5.2;
      }
      if (card.rank === 13) {
        return 4.2;
      }
      if (card.rank === 12) {
        return 3.4;
      }
      if (card.rank === 11) {
        return 2.8;
      }
      if (card.rank === 10) {
        return 2.4;
      }
    }
    if (card.rank === 14) {
      return 3.1;
    }
    if (card.rank === 13) {
      return 2.1;
    }
    if (card.rank === 12) {
      return 1.3;
    }
    return card.rank >= 10 ? 0.6 : 0;
  }

  function evaluateTrumpPlan(cards, trump, player) {
    var profile = getAiProfile(player);
    var counts = buildEffectiveSuitCounts(cards, trump);
    var score = 0;
    var trumpCount = counts[trump];
    var trumpControl = 0;
    var sideControl = 0;
    var voids = 0;
    var shortSuits = 0;
    var longestSide = 0;

    cards.forEach(function (card) {
      var suit = effectiveSuit(card, trump);
      score += cardPoints(card) * 0.12 * profile.scoringProtection;
      if (suit === trump) {
        trumpControl += cardControlScore(card, trump);
      } else {
        sideControl += cardControlScore(card, trump) * 0.85;
      }
    });

    SUITS.forEach(function (suit) {
      if (suit === trump) {
        return;
      }
      if (counts[suit] === 0) {
        voids += 1;
        return;
      }
      if (counts[suit] === 1) {
        shortSuits += 1;
      }
      longestSide = Math.max(longestSide, counts[suit]);
    });

    score += trumpCount * 3.8 * profile.trumpPressure;
    score += trumpControl * profile.captureBias;
    score += sideControl * 0.75;
    score += voids * 1.8 * profile.disruptionBias;
    score += shortSuits * 0.9 * profile.discardPragmatism;
    if (longestSide >= 3) {
      score += (longestSide - 2) * 0.8;
    }
    if (trumpCount >= 5) {
      score += 5;
    }
    if (trumpCount >= 6) {
      score += 7;
    }
    if (trumpCount <= 2) {
      score -= 7;
    }

    return {
      trump: trump,
      score: score,
      trumpCount: trumpCount,
      trumpControl: trumpControl,
      sideControl: sideControl
    };
  }

  function evaluateBidPlan(player) {
    var profile = getAiProfile(player);
    var match = getAiMatchState(player, profile);
    var cards = state.initialHands[player];
    var raw = estimateHandStrength(cards);
    var suitPlans = SUITS.map(function (suit) {
      return evaluateTrumpPlan(cards, suit, player);
    }).sort(function (a, b) {
      return b.score - a.score;
    });
    var best = suitPlans[0];
    var second = suitPlans[1];
    var score = raw * 0.55 + best.score * 0.95 + second.score * 0.25;
    var bidOffset;

    score += match.trailingPressure * 8;
    score += match.disruptionPressure * 6;
    score -= match.closingPressure * 8;
    score += match.shouldIncreaseVariance * 5;
    score += match.mustStopOpponents * 5;
    score -= match.shouldReduceVariance * 6;

    bidOffset = Math.max(0, roundToBidStep((score - 74) * 1.55 * profile.bidAggression));

    return {
      score: score,
      bestTrump: best.trump,
      targetBid: clamp(getRuleConfig().minBid + bidOffset, getRuleConfig().minBid, getRuleConfig().maxBid)
    };
  }

  function aiKeepScore(card, cards, trump, player) {
    var profile = getAiProfile(player);
    var suit = effectiveSuit(card, trump);
    var counts = buildEffectiveSuitCounts(cards, trump);
    var score = 0;

    if (card.isRook) {
      return 999;
    }
    if (suit === trump) {
      score += 18 + trickRank(card, trump) * 1.9 * profile.trumpPressure;
      score += cardPoints(card) * 0.7 * profile.scoringProtection;
    } else {
      score += cardControlScore(card, trump) * 3.4;
      score += cardPoints(card) * 0.8 * profile.scoringProtection;
      if (counts[suit] <= 2) {
        score += 1.8;
      }
      if (counts[suit] >= 4 && card.rank <= 8 && cardPoints(card) === 0) {
        score -= 2.5;
      }
      if (card.rank <= 4 && cardPoints(card) === 0) {
        score -= 3.5 * profile.discardPragmatism;
      }
    }
    if (card.rank === 1) {
      score += 5;
    }
    return score;
  }

  function controlStrengthInSuit(cards, suit, trump) {
    return cards.reduce(function (best, card) {
      if (effectiveSuit(card, trump) !== suit) {
        return best;
      }
      return Math.max(best, cardControlScore(card, trump) + cardPoints(card) * 0.08);
    }, 0);
  }

  function hasWinningCardsInAllSuits(cards, trump) {
    return [trump].concat(SUITS.filter(function (suit) {
      return suit !== trump;
    })).every(function (suit) {
      var strength = controlStrengthInSuit(cards, suit, trump);

      if (suit === trump) {
        return countSuitInHand(cards, suit, trump) >= 4 && strength >= 5.2;
      }
      return strength >= 3;
    });
  }

  function evaluateDiscardHandShape(cards, trump, player) {
    var profile = getAiProfile(player);
    var counts = buildEffectiveSuitCounts(cards, trump);
    var coveredEverywhere = hasWinningCardsInAllSuits(cards, trump);
    var shortSuitWeight = coveredEverywhere ? 1.2 : 4.6;
    var voidWeight = coveredEverywhere ? 2.2 : 8.5;
    var score = cards.reduce(function (total, card) {
      return total + aiKeepScore(card, cards, trump, player) * 0.34;
    }, 0);

    score += counts[trump] * 2.8 * profile.trumpPressure;

    SUITS.forEach(function (suit) {
      var count;
      var control;

      if (suit === trump) {
        return;
      }

      count = counts[suit];
      control = controlStrengthInSuit(cards, suit, trump);

      if (count === 0) {
        score += voidWeight * profile.discardPragmatism;
      } else if (count === 1) {
        score += shortSuitWeight * profile.discardPragmatism;
      } else if (count === 2) {
        score += shortSuitWeight * 0.45 * profile.discardPragmatism;
      }

      if (control >= 3) {
        score += 1.2;
      } else if (count >= 2) {
        score -= (count - 1) * 2.2 * profile.discardPragmatism;
        if (count >= 4) {
          score -= 4.5;
        }
      }
    });

    return score;
  }

  function scoreAiDiscardCandidate(card, cards, trump, player) {
    var profile = getAiProfile(player);
    var suit = effectiveSuit(card, trump);
    var suitCountBefore = countSuitInHand(cards, suit, trump);
    var suitControl = controlStrengthInSuit(cards, suit, trump);
    var nextCards = cards.filter(function (entry) {
      return entry.id !== card.id;
    });
    var suitCountAfter = countSuitInHand(nextCards, suit, trump);
    var score = evaluateDiscardHandShape(nextCards, trump, player) - aiKeepScore(card, cards, trump, player) * 0.55;

    if (suit === trump) {
      score -= 7 * profile.trumpPressure;
    } else {
      if (suitCountAfter === 0 && suitControl < 3) {
        score += 7.5 * profile.discardPragmatism;
      } else if (suitCountAfter === 1 && suitControl < 3) {
        score += 3.8 * profile.discardPragmatism;
      }
      if (suitCountBefore >= 3 && suitCountAfter >= 2 && suitControl < 2.6 && card.rank <= 8 && cardPoints(card) === 0) {
        score += 2.4;
      }
    }

    if (cardPoints(card) > 0) {
      score -= cardPoints(card) * 2.8 * profile.scoringProtection;
    }
    if (!card.isRook && card.rank <= 4 && suit !== trump) {
      score += 1.5;
    }

    return score;
  }

  function currentTrickPoints() {
    return state.trick.reduce(function (sum, play) {
      return sum + cardPoints(play.card);
    }, 0);
  }

  function buriedKittyPoints() {
    return state.buriedKitty.reduce(function (sum, card) {
      return sum + cardPoints(card);
    }, 0);
  }

  function endgameRetentionPenalty(card, context) {
    var remainingCards = context.round.remainingCards;
    var swingScale = clamp(context.lastTrickSwing / 25, 1, 2);
    var modeBias = clamp(
      1 +
        context.mode.preserveCloser * 0.9 +
        context.mode.protectLead * 0.35 -
        context.mode.pushToMake * 0.25 -
        context.mode.setTheBid * 0.15,
      0.6,
      2.2
    );
    var keepScore;
    var weight;

    if (remainingCards > 3) {
      return 0;
    }

    keepScore = aiKeepScore(card, context.hand, state.trump, context.player);
    if (remainingCards === 3) {
      weight = 0.06;
    } else if (remainingCards === 2) {
      weight = 0.18;
    } else {
      weight = 0;
    }

    return keepScore * weight * swingScale * modeBias;
  }

  function reservedCloserPenalty(card, context) {
    var urgencyRelief;
    var timingMultiplier;

    if (!context.reservedCloser || context.round.remainingCards <= 1 || card.id !== context.reservedCloser.id) {
      return 0;
    }

    urgencyRelief =
      context.mode.pushToMake * 5 +
      context.mode.setTheBid * 4.5 +
      context.mode.denyPoints * 2.5;
    timingMultiplier = context.round.remainingCards === 5
      ? 0.65
      : context.round.remainingCards === 4
        ? 0.9
        : 1.2;

    return Math.max(0, (13 + context.reservedCloser.score * 1.8) * timingMultiplier - urgencyRelief);
  }

  function shouldReleaseReservedCloser(context, reservedScore, alternativeScore) {
    var gain;
    var urgency;
    var protection;

    if (!context.reservedCloser || context.round.remainingCards <= 1) {
      return true;
    }

    gain = reservedScore - alternativeScore;
    urgency =
      context.mode.pushToMake * 9 +
      context.mode.setTheBid * 8 +
      context.mode.denyPoints * 4 +
      Math.min(8, context.trickPoints * 0.35) +
      (context.isLastToAct ? 2 : 0);
    protection =
      12 +
      context.mode.protectLead * 8 +
      context.mode.preserveCloser * 10 +
      context.round.closerPressure * 8 +
      (context.round.remainingCards <= 3 ? 4 : 0);

    return gain >= protection - urgency;
  }

  function estimateVisibleWinnerConfidence(winningPlay, player, playersAfter, analysis) {
    if (!winningPlay) {
      return 0;
    }
    return estimateUnknownWinnerConfidenceModule(
      winningPlay.card,
      state.trump,
      state.hands[player] || [],
      playersAfter,
      analysis || buildAiTurnAnalysis(player),
      effectiveSuit,
      playStrength
    );
  }

  function buildAiPlayContext(player) {
    var analysis = buildAiTurnAnalysis(player);
    var profile = getAiProfile(player);
    var match = getAiMatchState(player, profile);
    var round = getAiRoundState(player, analysis);
    var winningPlay = null;
    var playersAfter = (activePlayersForState().length - 1) - state.trick.length;
    var teammateWinning = false;
    var teammateWinConfidence = 0;
    var mode;
    var reservedCloser;

    if (state.trick.length) {
      winningPlay = state.trick[determineTrickWinner(state.trick, state.leadSuit, state.trump)];
      teammateWinning = teamForPlayer(winningPlay.player) === teamForPlayer(player) &&
        winningPlay.player !== player;
      if (teammateWinning) {
        teammateWinConfidence = estimateVisibleWinnerConfidence(winningPlay, player, playersAfter, analysis);
      }
    }

    mode = deriveAiTacticalMode(player, profile, match, round);
    reservedCloser = findReservedCloser(player, state.hands[player], state.trump, round, analysis);

    return {
      player: player,
      team: teamForPlayer(player),
      partner: teammateForPlayer(player),
      hand: state.hands[player],
      profile: profile,
      match: match,
      round: round,
      mode: mode,
      reservedCloser: reservedCloser,
      trickPoints: currentTrickPoints(),
      lastTrickSwing: round.lastTrickSwing || (getRuleConfig().lastTrickBonus + buriedKittyPoints()),
      playersAfter: playersAfter,
      isLastToAct: state.trick.length === activePlayersForState().length - 1,
      remainingTrumpElsewhere: countRemainingTrumpOutsidePlayer(player, analysis),
      winningPlay: winningPlay,
      winningTeam: winningPlay ? teamForPlayer(winningPlay.player) : null,
      teammateWinning: teammateWinning,
      teammateWinConfidence: teammateWinConfidence,
      analysis: analysis
    };
  }

  function estimateWinningConfidence(card, context) {
    if (context.isLastToAct) {
      return 1;
    }
    return estimateUnknownWinnerConfidenceModule(
      card,
      state.trump,
      context.hand,
      context.playersAfter,
      context.analysis,
      effectiveSuit,
      playStrength
    );
  }

  function scoreAiLeadChoice(card, context) {
    var profile = context.profile;
    var mode = context.mode;
    var suit = effectiveSuit(card, state.trump);
    var higherUnknown = countHigherUnknownCards(card, context.player, state.trump, context.hand, context.analysis);
    var suitCount = countSuitInHand(context.hand, suit, state.trump);
    var isTrump = suit === state.trump;
    var control = Math.max(0, 3 - higherUnknown);
    var preservePenalty = endgameRetentionPenalty(card, context);
    var reservePenalty = reservedCloserPenalty(card, context);
    var score = 0;

    if (!isTrump) {
      control -= Math.min(2, context.remainingTrumpElsewhere * 0.15);
    }

    score += control * 8 * profile.captureBias;
    score += suitCount * 1.1;
    score += cardControlScore(card, state.trump) * 1.8;
    score += context.match.trailingPressure * 3 * profile.riskBias;
    score -= context.match.closingPressure * higherUnknown * 2 * profile.safetyBias;
    score += context.match.disruptionPressure * (isTrump ? 5 : 2) * profile.disruptionBias;
    score += context.round.contractPressure * (isTrump ? 6 : 3);
    score += context.round.disruptionPressure * (isTrump ? 4 : 2) * profile.disruptionBias;
    score += mode.pushToMake * (isTrump ? 6 : 2.5);
    score += mode.setTheBid * (isTrump ? 5 : 2);
    score += mode.cashPoints * (control >= 1.5 ? cardPoints(card) * 0.45 : 0);
    score -= mode.protectLead * higherUnknown * 2.5;
    score += mode.denyPoints * (isTrump ? 3.5 : 1.5);
    if (isTrump) {
      score += 4 * profile.trumpPressure;
    }
    if (cardPoints(card) > 0 && control < 1.5) {
      score -= cardPoints(card) * 0.9 * profile.scoringProtection;
      score -= context.match.closingPressure * 6 * profile.safetyBias;
    }
    if (isTrump && higherUnknown > 1) {
      score -= mode.preserveCloser * 4;
    }
    if (!isTrump && suitCount <= 1 && cardPoints(card) === 0) {
      score += 1.5;
    }
    score -= preservePenalty;
    score -= reservePenalty;

    return score;
  }

  function scoreAiSlough(card, context) {
    var profile = context.profile;
    var mode = context.mode;
    var suit = effectiveSuit(card, state.trump);
    var suitCount = countSuitInHand(context.hand, suit, state.trump);
    var preservePenalty = endgameRetentionPenalty(card, context);
    var reservePenalty = reservedCloserPenalty(card, context);
    var score = 0;

    score += suit === state.trump ? -6 : 3;
    score += (16 - trickRank(card, state.trump)) * 0.45;
    score -= cardPoints(card) * 1.15 * profile.scoringProtection;
    score -= cardControlScore(card, state.trump) * 1.4;
    if (suitCount <= 2) {
      score += 1.5;
    }
    if (context.winningTeam === context.team && context.winningPlay && context.winningPlay.player !== context.player) {
      score += 3.5 * profile.partnerTrust;
    }
    if (context.teammateWinning) {
      score += 4 * context.teammateWinConfidence * profile.partnerTrust;
      score += cardPoints(card) * 1.9 * context.teammateWinConfidence * profile.partnerTrust;
      score += mode.feedPartner * context.teammateWinConfidence * (1.5 + cardPoints(card) * 0.9);
      if (suit === state.trump) {
        score -= 3.5 * context.teammateWinConfidence;
      }
    } else {
      score -= mode.denyPoints * cardPoints(card) * 0.9;
    }
    if (suit === state.trump) {
      score -= mode.preserveCloser * 2.5;
    }
    score -= preservePenalty;
    score -= reservePenalty;

    return score;
  }

  function scoreAiFollowChoice(card, context) {
    var profile = context.profile;
    var mode = context.mode;
    var canWin = canBeatCurrentWinner(card);
    var confidence = canWin ? estimateWinningConfidence(card, context) : 0;
    var trickValue = context.trickPoints + cardPoints(card);
    var preserve = aiKeepScore(card, context.hand, state.trump, context.player);
    var preservePenalty = endgameRetentionPenalty(card, context);
    var score = -preserve * 0.08 - preservePenalty;

    if (context.hand.length === 1) {
      trickValue += context.lastTrickSwing;
    }

    if (canWin) {
      score += 8 + trickValue * 0.95 * profile.captureBias;
      score += confidence * 7;
      score += context.match.trailingPressure * 4 * profile.riskBias;
      score += context.match.disruptionPressure * 5 * profile.disruptionBias;
      score -= context.match.closingPressure * (1 - confidence) * 8 * profile.safetyBias;
      score += context.round.contractPressure * 7;
      score += context.round.disruptionPressure * 5 * profile.disruptionBias;
      score += mode.pushToMake * trickValue * 0.45;
      score += mode.setTheBid * Math.max(context.trickPoints, trickValue) * 0.4;
      score += mode.denyPoints * context.trickPoints * 0.55;
      score -= mode.protectLead * (1 - confidence) * 6;
      if (context.isLastToAct) {
        score += 4;
      }
      if (context.winningTeam === context.team && context.winningPlay && context.winningPlay.player !== context.player) {
        score -= 7 * profile.partnerTrust;
      }
      if (context.teammateWinning) {
        score -= (10 + (context.isLastToAct ? 10 : 0)) * context.teammateWinConfidence * profile.partnerTrust;
        score -= cardControlScore(card, state.trump) *
          (1.5 + context.teammateWinConfidence) *
          profile.partnerTrust;
        if (effectiveSuit(card, state.trump) === state.trump) {
          score -= 5 * context.teammateWinConfidence * profile.partnerTrust;
        }
      }
      if (cardPoints(card) > 0 && trickValue < 10 && !context.isLastToAct) {
        score -= 2 * profile.scoringProtection;
        score -= context.match.closingPressure * 4 * profile.safetyBias;
      }
      if (effectiveSuit(card, state.trump) === state.trump) {
        score -= mode.preserveCloser * 2.8;
      }
      score -= reservedCloserPenalty(card, context);
    } else {
      score += scoreAiSlough(card, context);
    }

    return score;
  }

  function recordBid(player, bid) {
    state.passed[player] = false;
    state.currentBid = bid;
    state.currentBidHolder = player;
    state.bidStatuses[player] = String(bid);
    addBidFeed(biddingPlayerName(player) + " bids " + bid + ".");
    advanceBidTurn();
    updateTeammateOnlyBidState();
    syncSelectedBid();
    markMatchDirty();
  }

  function recordPass(player) {
    state.passed[player] = true;
    state.bidStatuses[player] = "Pass";
    addBidFeed(biddingPlayerName(player) + " passes.");
    advanceBidTurn();
    updateTeammateOnlyBidState();
    markMatchDirty();
  }

  function addBidFeed(text) {
    state.bidEntries.push(text);
  }

  function advanceBidTurn() {
    var playerCount = activePlayersForState().length;
    var next = state.currentBidTurn;
    var tries = 0;

    do {
      next = (next + 1) % playerCount;
      tries += 1;
    } while (tries < playerCount && state.passed[next]);

    state.currentBidTurn = next;
  }

  function getMinimumBid() {
    return state.currentBid === null
      ? getRuleConfig().minBid
      : Math.min(getRuleConfig().maxBid, state.currentBid + getRuleConfig().bidStep);
  }

  function syncSelectedBid() {
    state.selectedBid = Math.min(getRuleConfig().maxBid, Math.max(getMinimumBid(), state.selectedBid));
  }

  function finishBidding() {
    state.bidder = state.currentBidHolder === null ? 0 : state.currentBidHolder;
    state.winningBid = state.currentBid === null ? getRuleConfig().minBid : state.currentBid;
    addBidFeed(biddingPlayerName(state.bidder) + " wins the bid at " + state.winningBid + ".");
    state.biddingComplete = true;
    state.busy = false;
    markMatchDirty();
    render();
  }

  function openTrumpPhase() {
    state.phase = "trump";
    state.trumpStage = "setup";
    state.kittyReviewHand = state.initialHands[state.bidder].concat(state.kitty);
    state.selectedTrump = state.bidder === 0 ? null : chooseAiTrump(state.kittyReviewHand);
    state.selectedDiscards = [];
    state.exchangeOrder = [];
    state.exchangeIndex = 0;
    state.exchangeSwapsUsed = Array(MAX_PLAYER_COUNT).fill(0);
    state.exchangeSelectedHandCardId = null;
    state.exchangeSelectedKittyCardId = null;
    state.callPartnerCardId = null;
    state.callPartnerPlayer = null;
    state.callPartnerRevealed = false;
    state.askPartnerToLead = false;
    state.pendingCallPartnerCardId = null;
    state.pendingAskPartnerToLead = false;
    state.aiTrumpReady = false;
    state.aiTrumpMeterStarted = false;
    markMatchDirty();

    if (state.bidder !== 0) {
      state.selectedDiscards = chooseAiDiscards(state.kittyReviewHand, state.selectedTrump);
      finalizeBidderHand();
      if (isWoodsonRuleset()) {
        state.selectedTrump = chooseAiTrump(state.kittyReviewHand);
      }
      if (isCallPartnerRuleset()) {
        var aiCallChoice = chooseAiCalledPartner();
        if (aiCallChoice) {
          selectCalledPartner(aiCallChoice.cardId, aiCallChoice.askPartnerToLead);
        }
      }
      state.busy = true;
      render();
      window.requestAnimationFrame(function () {
        if (state.phase === "trump" && state.bidder !== 0 && !state.aiTrumpReady) {
          state.aiTrumpMeterStarted = true;
          renderTrumpPhase();
        }
      });
      schedule(function () {
        state.aiTrumpReady = true;
        state.busy = false;
        markMatchDirty();
        render();
      }, 1500);
      return;
    }
    state.busy = false;
    render();
  }

  function chooseAiTrump(cards) {
    var player = state.bidder;
    var hand = cards || state.initialHands[player];
    var plans = SUITS.map(function (suit) {
      return evaluateTrumpPlan(hand, suit, player);
    }).sort(function (a, b) {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.trumpCount !== a.trumpCount) {
        return b.trumpCount - a.trumpCount;
      }
      return b.trumpControl - a.trumpControl;
    });

    return plans[0].trump;
  }

  function dealForPlay() {
    var startingHands;

    clearPlayerReactionCooldown();
    clearPlayReaction(false);
    startingHands = isWoodsonRuleset() && state.trumpStage === "exchange"
      ? cloneHands(state.hands)
      : prepareRoundHands();
    state.hands = startingHands;
    if (isWoodsonRuleset() && state.trumpStage === "exchange") {
      state.initialHands = cloneHands(startingHands);
      state.kittyReviewHand = startingHands[state.bidder].slice();
    }
    state.phase = "play";
    state.trumpStage = "play";
    state.currentPlayer = openingLeader();
    state.trick = [];
    state.leadSuit = null;
    state.winningCardPlayer = null;
    state.playerPoints = Array(MAX_PLAYER_COUNT).fill(0);
    state.roundPoints = [0, 0];
    state.trickCounts = [0, 0];
    state.roundMessage = openingPlayMessage();
    state.busy = false;
    markMatchDirty();
    render();
    maybeRunAiTurn();
  }

  function prepareRoundHands() {
    var hands = cloneHands(state.initialHands);
    hands[state.bidder] = state.kittyReviewHand.slice();

    activePlayersForState().forEach(function (player) {
      sortHand(hands[player], state.trump);
    });

    return hands;
  }

  function chooseAiDiscards(cards, trump) {
    var player = state.bidder;
    var discardCount = getRuleConfig().kittySize;
    var working = cards.slice();
    var selected = [];
    var selectable = cards.filter(function (card) {
      return canDiscardFromBidderSetup(card);
    });
    var best;

    if (selectable.length < discardCount) {
      selectable = cards.slice();
    }

    while (selected.length < discardCount && working.length) {
      best = null;
      selectable = working.filter(function (card) {
        return canDiscardFromBidderSetup(card);
      });

      if (selectable.length < discardCount - selected.length) {
        selectable = working.slice();
      }

      selectable.forEach(function (card) {
        var score = scoreAiDiscardCandidate(card, working, trump, player);

        if (!best || score > best.score) {
          best = {
            id: card.id,
            score: score
          };
        }
      });

      if (!best) {
        break;
      }

      selected.push(best.id);
      working = working.filter(function (card) {
        return card.id !== best.id;
      });
    }

    return selected;
  }

  function maybeRunAiTurn() {
    if (state.phase !== "play" || state.busy || state.currentPlayer === 0) {
      return;
    }

    state.busy = true;
    render();

    schedule(function () {
      if (state.phase !== "play" || state.currentPlayer === 0) {
        state.busy = false;
        render();
        return;
      }
      var choice = chooseAiPlay(state.currentPlayer);

      if (!choice) {
        recoverAiTurn(state.currentPlayer);
        return;
      }

      playCard(state.currentPlayer, choice.id);
    }, AI_DELAY);
  }

  function chooseAiPlay(player) {
    var context = buildAiPlayContext(player);
    var legal = getLegalCards(player);
    return selectBestAiPlayModule({
      legalCards: legal,
      context: context,
      trickLength: state.trick.length,
      scoreLeadChoice: scoreAiLeadChoice,
      scoreFollowChoice: scoreAiFollowChoice,
      shouldReleaseReservedCloser: shouldReleaseReservedCloser
    });
  }

  function recoverAiTurn(player) {
    var hand = state.hands[player] || [];
    var nextPlayer = (player + 1) % activePlayersForState().length;

    console.warn("AI turn recovery triggered", {
      player: player,
      handSize: hand.length,
      trickSize: state.trick.length,
      currentPlayer: state.currentPlayer,
      phase: state.phase
    });

    if (hand.length) {
      state.busy = false;
      playCard(player, hand[0].id);
      return;
    }

    state.busy = false;

    if (state.trick.length >= activePlayersForState().length) {
      resolveTrick();
      return;
    }

    if (state.hands.some(function (cards) { return cards.length > 0; })) {
      state.currentPlayer = nextPlayer;
      render();
      maybeRunAiTurn();
      return;
    }

    if (state.trick.length) {
      resolveTrick();
      return;
    }

    finishRound();
  }

  function canBeatCurrentWinner(card) {
    var simulated = state.trick.concat([{ player: -1, card: card }]);
    return determineTrickWinner(simulated, state.leadSuit, state.trump) === simulated.length - 1;
  }

  function playHumanCard(cardId) {
    if (state.phase !== "play" || state.busy || state.currentPlayer !== 0) {
      return;
    }
    playCard(0, cardId);
  }

  function playCard(player, cardId) {
    var hand = state.hands[player];
    var index = hand.findIndex(function (card) {
      return card.id === cardId;
    });
    var card;

    if (index === -1) {
      return;
    }

    card = hand[index];
    if (!isCardLegal(player, card)) {
      return;
    }

    hand.splice(index, 1);
    state.trick.push({ player: player, card: card });
    markMatchDirty();
    if (isCallPartnerRuleset() && state.callPartnerCardId === card.id && !state.callPartnerRevealed) {
      state.callPartnerRevealed = true;
    }
    if (card.isRook) {
      showSticker("rook");
    }

    if (state.trick.length === 1) {
      state.leadSuit = effectiveSuit(card, state.trump);
    }

    if (state.trick.length < activePlayersForState().length) {
      state.currentPlayer = (player + 1) % activePlayersForState().length;
      clearPlayReaction(false);
      state.roundMessage = (player === 0 ? "You play " : PLAYER_NAMES[player] + " plays ") + fullCardLabel(card, state.trump) + ".";
      if (isCallPartnerRuleset() && state.callPartnerCardId === card.id) {
        state.roundMessage += " " + PLAYER_NAMES[player] + " is the partner.";
      }
      if (card.isRook) {
        maybeShowAiPlayReaction("rook", player);
      }
      state.busy = false;
      render();
      maybeRunAiTurn();
      return;
    }

    resolveTrick();
  }

  function resolveTrick() {
    var winningIndex = determineTrickWinner(state.trick, state.leadSuit, state.trump);
    var winner = state.trick[winningIndex].player;
    var team = teamForPlayer(winner);
    var pointsWon = state.trick.reduce(function (sum, play) {
      return sum + cardPoints(play.card);
    }, 0);
    var isLastTrick = activePlayersForState().every(function (player) {
      return (state.hands[player] || []).length === 0;
    });
    var completedTrick = state.trick.map(function (play) {
      return {
        player: play.player,
        card: play.card
      };
    });
    var scoringItems = collectScoringItems(completedTrick, isLastTrick, winner);

    if (isLastTrick) {
      pointsWon += state.buriedKitty.reduce(function (sum, card) {
        return sum + cardPoints(card);
      }, 0);
      pointsWon += getRuleConfig().lastTrickBonus;
    }

    state.roundPoints[team] += pointsWon;
    state.playerPoints[winner] += pointsWon;
    state.trickCounts[team] += 1;
    state.winningCardPlayer = null;
    state.previousTrick = {
      cards: completedTrick,
      leader: completedTrick[0].player,
      winner: winner,
      points: pointsWon,
      scoringItems: scoringItems
    };
    state.completedTricks.push(state.previousTrick);
    clearPlayReaction(false);
    state.roundMessage = trickWinMessage(winner, pointsWon);
    state.busy = true;
    markMatchDirty();
    if (!isLastTrick && pointsWon >= BIG_TRICK_THRESHOLD) {
      maybeShowAiPlayReaction("big_trick", winner);
    }
    render();

    state.winnerRevealId = window.setTimeout(function () {
      state.winnerRevealId = null;
      state.winningCardPlayer = winner;
      render();
    }, TRICK_WINNER_REVEAL_DELAY);

    schedule(function () {
      clearWinnerReveal();
      state.trick = [];
      state.leadSuit = null;
      state.currentPlayer = winner;
      state.winningCardPlayer = null;
      state.busy = false;
      markMatchDirty();

      if (isLastTrick) {
        finishRound();
      } else {
        render();
        maybeRunAiTurn();
      }
    }, TRICK_DELAY);
  }

  function finishRound() {
    var noPenaltyScoring = getRuleConfig().contractScoring === "none";
    var isCallPartner = isCallPartnerRuleset();
    var bidderTeam = teamForPlayer(state.bidder);
    var otherTeam = bidderTeam === 0 ? 1 : 0;
    var bidMade = state.roundPoints[bidderTeam] >= state.winningBid;
    var bidMargin = Math.abs(state.roundPoints[bidderTeam] - state.winningBid);
    var summaryUs = roundSummaryPoints(0, bidderTeam, bidMade);
    var summaryThem = roundSummaryPoints(1, bidderTeam, bidMade);
    var bidderName = PLAYER_NAMES[state.bidder];
    var bidderTotal = state.roundPoints[bidderTeam];
    var usAccrued = state.roundPoints[0];
    var themAccrued = state.roundPoints[1];
    var scoringScale = SCORE_METER_MAX;
    var story = buildSummaryStory(bidderTeam, bidderName, bidderTotal, bidMade, bidMargin);
    var stickerType = getSummaryStoryStickerType();
    var stickerAsset = stickerType ? randomSummaryStickerAsset(stickerType) : null;
    var bidSidePlayers = roundTeamPlayers(0);
    var otherSidePlayers = roundTeamPlayers(1);

    clearPlayerReactionCooldown();
    clearPlayReaction(false);
    if (isCallPartner && state.callPartnerCardId && !state.callPartnerRevealed) {
      state.callPartnerRevealed = true;
    }

    if (isCallPartner) {
      state.previousCallPartnerStandingOrder = state.callPartnerStandingOrder ? state.callPartnerStandingOrder.slice() : null;
      bidSidePlayers.forEach(function (player) {
        state.individualMatchPoints[player] += bidMade ? state.roundPoints[0] : -state.winningBid;
      });
      otherSidePlayers.forEach(function (player) {
        state.individualMatchPoints[player] += state.roundPoints[1];
      });
      state.callPartnerStandingOrder = buildCallPartnerStandingOrder(state.individualMatchPoints);
    } else if (noPenaltyScoring) {
      state.matchPoints[0] += state.roundPoints[0];
      state.matchPoints[1] += state.roundPoints[1];
    } else if (bidMade) {
      state.matchPoints[bidderTeam] += state.roundPoints[bidderTeam];
      state.matchPoints[otherTeam] += state.roundPoints[otherTeam];
    } else {
      state.matchPoints[bidderTeam] -= state.winningBid;
      state.matchPoints[otherTeam] += state.roundPoints[otherTeam];
    }
    state.matchMaxDeficit = Math.max(state.matchMaxDeficit, Math.max(0, state.matchPoints[1] - state.matchPoints[0]));

    state.summary = {
      us: summaryUs,
      them: summaryThem,
      bid: PLAYER_NAMES[state.bidder] + " bid " + state.winningBid,
      bidMade: bidMade,
      bidderTeam: bidderTeam,
      partnerName: isCallPartner && state.callPartnerPlayer !== null ? PLAYER_NAMES[state.callPartnerPlayer] : "",
      result: noPenaltyScoring ? (bidMade ? "Bid Made" : "No Penalty") : (bidMade ? "Made" : "Set"),
      bidMargin: bidMargin,
      margin: (bidMade ? "Made it by " : "Missed it by ") + bidMargin + " points",
      storyLabel: story.label,
      storyHeadline: story.headline,
      storyMood: story.mood
    };
    state.scoringInterstitial = {
      usAccrued: usAccrued,
      themAccrued: themAccrued,
      bidderTeam: bidderTeam,
      bidderName: bidderName,
      winningBid: state.winningBid,
      bidMarkerPct: (state.winningBid / scoringScale) * 100,
      stickerAsset: stickerAsset,
      stickerLandscape: Boolean(stickerAsset && (stickerAsset.indexOf("lsp") !== -1 || stickerAsset.indexOf("facepalm") !== -1)),
      outcomeLine: noPenaltyScoring
        ? bidderName + " bid " + state.winningBid + ". Us " + summaryUs + " • Them " + summaryThem + "."
        : bidMade
        ? bidderName + " made the bid. Us " + summaryUs + " • Them " + summaryThem + "."
        : bidderName + " got set. Us " + summaryUs + " • Them " + summaryThem + "."
    };
    state.scoringMeterProgress = [0, 0];
    state.scoringOutcomeVisible = false;
    state.roundHistory.unshift({
      round: "R" + state.roundNumber,
      bid: PLAYER_NAMES[state.bidder] + " bid " + state.winningBid,
      madeBid: bidMade,
      isLatest: true,
      win: noPenaltyScoring ? "•" : (bidMade ? "✓" : "X"),
      us: summaryUs,
      them: summaryThem
    });
    state.roundHistory.slice(1).forEach(function (row) {
      row.isLatest = false;
    });
    recordRoundStats(bidMade);

    state.phase = "scoring";
    state.summaryStep = 1;
    state.summaryScoringOpen = false;
    state.busy = true;
    state.roundMessage = "";
    state.dealer = (state.dealer + 1) % activePlayersForState().length;
    state.roundNumber += 1;
    markMatchDirty();

    if (isCallPartner) {
      state.gameOver = individualMatchWinnerForRound(bidMade, bidderTeam) !== null;
    } else if (state.matchPoints[0] >= getRuleConfig().matchTarget || state.matchPoints[1] >= getRuleConfig().matchTarget) {
      state.gameOver = true;
    }
    recordMatchCompletion();

    render();

    schedule(function () {
      if (state.phase !== "scoring" || !state.scoringInterstitial) {
        return;
      }
      state.scoringMeterProgress[0] = (Math.min(state.scoringInterstitial.usAccrued, scoringScale) / scoringScale) * 100;
      render();
      schedule(function () {
        if (state.phase !== "scoring" || !state.scoringInterstitial) {
          return;
        }
        state.scoringMeterProgress[1] = (Math.min(state.scoringInterstitial.themAccrued, scoringScale) / scoringScale) * 100;
        render();
        schedule(function () {
          if (state.phase !== "scoring" || !state.scoringInterstitial) {
            return;
          }
          state.scoringOutcomeVisible = true;
          render();
          schedule(function () {
            if (state.phase !== "scoring") {
              return;
            }
            state.phase = "summary";
            state.busy = false;
            markMatchDirty();
            render();
          }, SCORING_TOTAL_DELAY);
        }, SCORING_OUTCOME_DELAY);
      }, SCORING_COLUMN_STAGGER_DELAY);
    }, SCORING_REVEAL_DELAY);
  }

  function roundSummaryPoints(team, bidderTeam, bidMade) {
    if (getRuleConfig().contractScoring === "none") {
      return state.roundPoints[team];
    }
    if (team === bidderTeam) {
      return bidMade ? state.roundPoints[team] : -state.winningBid;
    }
    return state.roundPoints[team];
  }

  function determineTrickWinner(trick, leadSuit, trump) {
    return determineTrickWinnerModule(trick, leadSuit, trump, getRuleConfig());
  }

  function playStrength(card, leadSuit, trump) {
    return playStrengthModule(card, leadSuit, trump, getRuleConfig());
  }

  function trickRank(card, trump) {
    return trickRankModule(card, trump, getRuleConfig());
  }

  function effectiveSuit(card, trump) {
    return effectiveSuitModule(card, trump, getRuleConfig());
  }

  function cardPoints(card) {
    return cardPointsModule(card, getRuleConfig());
  }

  function getLegalCards(player) {
    return getLegalCardsModule(state, player, getRuleConfig());
  }

  function getLegalCardIdSet(player) {
    return getLegalCardIdSetModule(state, player, getRuleConfig());
  }

  function isCardLegal(player, card) {
    return getLegalCardIdSet(player).has(card.id);
  }

  function teamForPlayer(player) {
    if (isCallPartnerRuleset()) {
      if (state.bidder === null) {
        return player === 0 ? 0 : 1;
      }
      if (player === state.bidder || (state.callPartnerPlayer !== null && player === state.callPartnerPlayer)) {
        return 0;
      }
      return 1;
    }
    return player % 2 === 0 ? 0 : 1;
  }

  function buildDeck() {
    return buildDeckModule(getRuleConfig(), SUITS);
  }

  function shuffle(items, seed) {
    var current = items.length;
    var random = seed || 1;

    while (current > 0) {
      random = (random * 9301 + 49297) % 233280;
      var index = Math.floor((random / 233280) * current);
      current -= 1;
      var temp = items[current];
      items[current] = items[index];
      items[index] = temp;
    }
  }

  function sortHand(hand, trump) {
    hand.sort(function (a, b) {
      var suitOrder = suitSortValue(a, trump) - suitSortValue(b, trump);
      if (suitOrder !== 0) {
        return suitOrder;
      }
      return trickRank(b, trump) - trickRank(a, trump);
    });
  }

  function suitSortValue(card, trump) {
    if (card.isRook) {
      return trump ? 1 : 0;
    }
    if (trump && card.suit === trump) {
      return 1;
    }
    return SUITS.indexOf(card.suit) + 2;
  }

  function cardLabel(card) {
    return card.isRook ? "Rook" : String(card.rank);
  }

  function fullCardLabel(card, trump) {
    if (card.isRook) {
      return "Rook";
    }
    return card.rank + " " + SUIT_LABEL[effectiveSuit(card, trump)];
  }

  function biddingPlayerName(player) {
    return playerLabel(player, true);
  }

  function render() {
    setPhaseVisibilityModule(ui, state.phase);
    var topbar = currentScoreTextForTopbar();

    ui.usScoreText.textContent = topbar.primary;
    ui.themScoreText.textContent = topbar.secondary;
    ui.usScoreBar.style.width = topbar.primaryWidth;
    ui.themScoreBar.style.width = topbar.secondaryWidth;
    if (ui.summaryMatchTarget) {
      ui.summaryMatchTarget.textContent = String(getRuleConfig().matchTarget);
    }

    if (state.phase === "welcome") {
      renderWelcomePhase();
    } else if (state.phase === "setup") {
      renderSetupPhase();
    } else if (state.phase === "bidding") {
      renderBiddingPhase();
    } else if (state.phase === "trump") {
      renderTrumpPhase();
    } else if (state.phase === "play") {
      renderPlayPhase();
    } else if (state.phase === "scoring") {
      renderScoringInterstitial();
    } else if (state.phase === "summary") {
      renderSummaryPhase();
    }
    applyMatchSummaryBackground();
    renderHistoryDrawer();
    renderSetupRulesDrawer();
    renderMenuSheet();
    syncTopbarScrollState();
    processAchievementToastQueue();
  }

  function renderWelcomePhase() {
    var matchesPlayed = profile.totals.matchesCompleted;
    var humanBidAttempts = profile.human.bidsMade + profile.human.bidsSet;
    var savedExists = !!savedMatchMeta;
    var winRate = matchesPlayed ? Math.round((profile.totals.matchesWon / matchesPlayed) * 100) : 0;

    ui.welcomeTitle.textContent = savedExists ? "Welcome Back" : "Welcome";
    ui.welcomeMessage.textContent = "";
    ui.welcomeMessage.classList.add("hidden");
    ui.savedMatchPanel.classList.toggle("hidden", !savedExists);
    ui.continueSavedGame.classList.toggle("hidden", !savedExists);
    ui.startNewGame.className = savedExists ? "ghost-button" : "primary-button";
    ui.startNewGame.textContent = savedExists ? "Start New Match" : "Start New Match";

    if (savedExists) {
      ui.savedMatchPhase.textContent = savedMatchMeta.phaseLabel;
      ui.savedMatchRound.textContent = savedMatchMeta.roundLabel;
      ui.savedMatchScore.textContent = savedMatchMeta.scoreLabel;
      ui.savedMatchDetail.textContent = savedMatchMeta.detail;
    }

    ui.profileMatches.textContent = String(matchesPlayed);
    ui.profileRecord.textContent = profile.totals.matchesWon + "-" + profile.totals.matchesLost;
    ui.profileRounds.textContent = String(profile.totals.roundsCompleted);
    ui.profileBids.textContent = profile.human.bidsMade + "/" + humanBidAttempts;
    ui.profileStatus.textContent = matchesPlayed
      ? winRate + "% match win rate"
      : "No completed matches yet";
    ui.profileDetail.textContent = matchesPlayed
      ? "Best round " + profile.human.bestRoundPoints + ". Streak " + profile.streaks.currentMatchWinStreak + "."
      : "Stats build as you play.";
  }

  function renderSetupPhase() {
    var config = gameTypeConfig(state.gameTypeId);
    var seatIds = displayedSetupSeatPersonaIds();
    var filled = normalizeSetupSeatPersonaIds(state.setupSeatPersonaIds, state.gameTypeId).filter(Boolean).length;
    var guide = rulesGuideForGameType(state.gameTypeId);

    if (state.setupCycling) {
      ui.setupSeatsStatus.textContent = "Filling seats...";
    } else if (filled === seatIds.length) {
      ui.setupSeatsStatus.textContent = "Seats filled and ready";
    } else {
      ui.setupSeatsStatus.textContent = filled + "/" + seatIds.length + " seats filled";
    }
    ui.setupPartnerHint.textContent = "";
    ui.setupPartnerHint.classList.add("hidden");
    ui.setupGameTypeSelect.disabled = state.setupCycling;
    ui.fillSetupSeats.disabled = state.setupCycling || selectedSetupSeatsFilled();
    ui.refreshSetupSeats.disabled = state.setupCycling || !filled;
    ui.confirmSetup.disabled = state.setupCycling || !selectedSetupSeatsFilled();
    ui.setupRulesSummaryText.textContent = guide.summary;

    renderSetupGameTypeSelect();
    renderSetupRosterGrid(seatIds);
    renderSetupSelectedSeats(seatIds, config);
  }

  function renderSetupGameTypeSelect() {
    ui.setupGameTypeSelect.innerHTML = "";

    Object.keys(GAME_TYPES).forEach(function (gameTypeId) {
      var config = gameTypeConfig(gameTypeId);
      var option = document.createElement("option");

      option.value = gameTypeId;
      option.textContent = config.label;
      option.selected = gameTypeId === state.gameTypeId;
      ui.setupGameTypeSelect.appendChild(option);
    });
  }

  function renderSetupRosterGrid(selectedSeatIds) {
    ui.setupRosterGrid.innerHTML = "";

    AI_PERSONAS.forEach(function (persona) {
      var card = document.createElement("article");
      var avatar = document.createElement("span");
      var name = document.createElement("strong");
      var descriptor = document.createElement("span");

      card.className = "setup-roster-card";
      card.classList.toggle("is-selected", selectedSeatIds.indexOf(persona.id) !== -1);
      card.classList.toggle("is-cycling", state.setupCycling && selectedSeatIds.indexOf(persona.id) !== -1);
      avatar.className = "setup-roster-avatar";
      avatar.classList.add(ROSTER_AVATAR_STYLE[persona.id] || "avatar-default");
      avatar.setAttribute("aria-hidden", "true");
      name.textContent = persona.name;
      descriptor.textContent = persona.descriptor;
      card.appendChild(avatar);
      card.appendChild(name);
      card.appendChild(descriptor);
      ui.setupRosterGrid.appendChild(card);
    });
  }

  function renderSetupSelectedSeats(selectedSeatIds, config) {
    ui.setupSelectedSeats.innerHTML = "";
    ui.setupSelectedSeats.setAttribute("data-seat-count", String(selectedSeatIds.length));

    selectedSeatIds.forEach(function (personaId, index) {
      var slot = document.createElement("div");
      var seatLabel = document.createElement("span");
      var occupant = document.createElement("strong");
      var descriptor = document.createElement("small");
      var persona = personaId ? AI_PERSONA_BY_ID[personaId] : null;

      slot.className = "setup-seat-slot";
      if (config.partnerSeat === index) {
        slot.classList.add("is-partner");
      }
      seatLabel.textContent = config.partnerSeat === index
        ? "Partner"
        : (config.partnerSeat === null ? "Seat " + (index + 1) : "Opponent");
      occupant.textContent = persona ? persona.name : "Open";
      descriptor.textContent = persona ? persona.descriptor : "Waiting";
      slot.appendChild(seatLabel);
      slot.appendChild(occupant);
      slot.appendChild(descriptor);
      ui.setupSelectedSeats.appendChild(slot);
    });
  }

  function renderSetupRulesDrawer() {
    var guide;

    if (!ui.setupRulesDrawer || !ui.setupRulesBackdrop || !ui.setupRulesContent) {
      return;
    }

    if (state.phase !== "setup" || !state.setupRulesOpen) {
      ui.setupRulesDrawer.classList.remove("open");
      ui.setupRulesDrawer.setAttribute("aria-hidden", "true");
      ui.setupRulesBackdrop.classList.add("hidden");
      ui.setupRulesContent.innerHTML = "";
      return;
    }

    guide = rulesGuideForGameType(state.gameTypeId);
    ui.setupRulesTitle.textContent = gameTypeConfig(state.gameTypeId).label;
    ui.setupRulesDrawer.classList.add("open");
    ui.setupRulesDrawer.setAttribute("aria-hidden", "false");
    ui.setupRulesBackdrop.classList.remove("hidden");
    ui.setupRulesContent.innerHTML = "";

    guide.sections.forEach(function (section) {
      var card = document.createElement("section");
      var title = document.createElement("h3");
      var table = document.createElement("div");

      card.className = "history-card rules-card";
      title.textContent = section.title;
      card.appendChild(title);
      table.className = "rules-table";

      section.rows.forEach(function (rowData) {
        var row = document.createElement("div");
        var label = document.createElement("span");
        var value = document.createElement("strong");

        row.className = "rules-row";
        label.textContent = rowData[0];
        value.textContent = rowData[1];
        row.appendChild(label);
        row.appendChild(value);
        table.appendChild(row);
      });

      card.appendChild(table);
      ui.setupRulesContent.appendChild(card);
    });
  }

  function renderBiddingPhase() {
    var preBid = !state.biddingStarted && !state.biddingComplete;
    var dealDone = !state.dealAnimating && state.dealRevealed;
    var showDealing = preBid && !dealDone;
    var showDealSummary = preBid && dealDone;
    var visibleStickerCount = Math.max(0, Math.min(DEAL_STICKER_COUNT, state.dealVisibleCount));

    ui.biddingPhaseLabel.textContent = preBid ? "Dealing" : "Bidding";
    ui.biddingTitle.textContent = preBid
      ? (dealDone ? "Deal Complete" : "Dealing")
      : (state.biddingComplete ? "Bid Winner" : "Choose Your Bid");
    ui.biddingTitle.classList.remove("is-dealing");
    ui.currentHighLabel.textContent = state.biddingComplete ? "Bid winner" : "Current high bid";
    ui.currentHighBid.textContent = !state.biddingStarted || state.currentBid === null
      ? "n/a"
      : biddingPlayerName(state.currentBidHolder) + " " + state.currentBid;
    if (state.biddingComplete) {
      ui.currentHighBid.textContent = biddingPlayerName(state.bidder) + " " + state.winningBid;
    }
    ui.turnRow.classList.toggle("hidden", state.biddingComplete);
    ui.currentTurn.textContent = biddingPlayerName(state.currentBidTurn);
    ui.selectedBid.textContent = String(state.selectedBid);
    ui.decreaseBid.disabled = state.selectedBid <= getMinimumBid() || state.busy || state.biddingComplete || !state.biddingStarted;
    ui.increaseBid.disabled = state.selectedBid >= getRuleConfig().maxBid || state.busy || state.biddingComplete || !state.biddingStarted;
    ui.placeBid.disabled = state.currentBidTurn !== 0 || state.busy || state.biddingComplete || !state.biddingStarted;
    ui.passBid.disabled = state.currentBidTurn !== 0 || state.busy || state.biddingComplete || !state.biddingStarted;
    ui.handStrengthHint.textContent = biddingStrengthHint(state.initialHands[0]);
    ui.handStrengthHint.classList.toggle("hidden", !dealDone);
    ui.dealingSequence.classList.toggle("hidden", !showDealing);
    ui.dealingSequence.classList.toggle("is-active", showDealing);
    ui.dealSummary.classList.toggle("hidden", !showDealSummary);
    ui.biddingHandHeader.classList.toggle("hidden", showDealing);
    ui.biddingHand.classList.toggle("hidden", showDealing);
    ui.dealingStickers.forEach(function (sticker, index) {
      sticker.classList.toggle("is-visible", showDealing && index < visibleStickerCount);
    });
    ui.currentHighRow.classList.toggle("bid-winner", state.biddingComplete);
    ui.turnRow.classList.toggle("active-turn", !preBid && !state.biddingComplete);
    ui.bidPicker.classList.toggle("is-disabled", state.currentBidTurn !== 0 || state.busy || state.biddingComplete || !state.biddingStarted);
    ui.currentHighRow.classList.toggle("hidden", preBid);
    ui.turnRow.classList.toggle("hidden", preBid || state.biddingComplete);
    ui.startBidding.classList.toggle("hidden", state.biddingStarted || state.biddingComplete || !dealDone);
    ui.bidPicker.classList.toggle("hidden", preBid || state.biddingComplete);
    ui.bidActions.classList.toggle("hidden", preBid || state.biddingComplete);
    ui.continueToTrump.classList.toggle("hidden", !state.biddingComplete);
    ui.bidStatusBoard.classList.toggle("hidden", preBid);
    renderBidStatusBoard();
    if (showDealSummary) {
      renderDealSummary();
    } else {
      ui.dealSummary.innerHTML = "";
    }
    if (showDealing) {
      ui.biddingHand.innerHTML = "";
      ui.biddingHand.classList.remove("reveal-hand");
    } else {
      renderHandGrid(ui.biddingHand, state.initialHands[0], null, "reference");
      ui.biddingHand.classList.toggle("reveal-hand", state.dealRevealAnimating);
    }
  }

  function renderTrumpPhase() {
    var isWoodsonExchange = woodsonExchangeActive();
    var isWoodsonDeclare = isWoodsonRuleset() && state.trumpStage === "declare";
    var isWoodsonSetup = isWoodsonRuleset() && state.trumpStage === "setup";
    var isCallStage = isCallPartnerRuleset() && state.trumpStage === "callPartner";
    var exchangePlayer = woodsonCurrentPlayer();
    var showingHumanExchange = isWoodsonExchange && exchangePlayer === 0;
    var aiPartnerCard;

    if (ui.aiPartnerCallSummary) {
      ui.aiPartnerCallSummary.classList.add("hidden");
    }
    if (ui.aiPartnerCallCard) {
      ui.aiPartnerCallCard.innerHTML = "";
    }

    if (state.bidder === null) {
      ui.trumpPhaseLabel.textContent = "Power and Kitty";
      ui.trumpTitle.textContent = "Get Set Up";
      ui.trumpBidAmount.textContent = "-";
      ui.trumpProcessing.classList.add("hidden");
      ui.trumpProcessingBar.style.width = "0";
      ui.trumpKittyBlock.classList.remove("hidden");
      ui.trumpReferenceBlock.classList.add("hidden");
      if (ui.trumpHandLabel) {
        ui.trumpHandLabel.innerHTML = "Hand and kitty <span class=\"kitty-legend-icon\" aria-hidden=\"true\"></span>";
      }
      if (ui.trumpReferenceLabel) {
        ui.trumpReferenceLabel.textContent = "Your hand";
      }
      ui.aiTrumpContinue.disabled = true;
      ui.aiTrumpContinue.classList.add("hidden");
      ui.confirmTrump.classList.remove("hidden");
      ui.exchangeDone.classList.add("hidden");
      ui.discardStatusRow.classList.add("hidden");
      ui.confirmTrump.disabled = true;
      renderHandGrid(ui.trumpHand, [], null, "reference");
      renderHandGrid(ui.trumpReferenceHand, [], null, "reference");
      return;
    }

    if (isCallStage) {
      ui.trumpPhaseLabel.textContent = "Call Partner";
      ui.trumpTitle.textContent = "Choose The Partner Card";
      ui.trumpBidAmount.textContent = PLAYER_NAMES[state.bidder] + " at " + state.winningBid + " • " + SUIT_LABEL[state.trump] + " power";
      ui.trumpProcessing.classList.add("hidden");
      ui.trumpKittyBlock.classList.remove("hidden");
      ui.trumpReferenceBlock.classList.remove("hidden");
      ui.discardStatusRow.classList.remove("hidden");
      if (ui.discardStatusLabel) {
        ui.discardStatusLabel.textContent = "Partner leads";
      }
      ui.discardStatus.textContent = state.pendingAskPartnerToLead ? "Yes" : "No";
      if (ui.trumpHandLabel) {
        ui.trumpHandLabel.textContent = "Your final hand";
      }
      if (ui.trumpReferenceLabel) {
        ui.trumpReferenceLabel.textContent = "Callable cards";
      }
      ui.aiTrumpContinue.classList.add("hidden");
      ui.confirmTrump.classList.remove("hidden");
      ui.exchangeDone.classList.remove("hidden");
      ui.confirmTrump.textContent = "Start Round";
      ui.exchangeDone.textContent = state.pendingAskPartnerToLead ? "Partner Leads: On" : "Partner Leads: Off";
      ui.confirmTrump.disabled = !state.pendingCallPartnerCardId || state.busy;
      ui.exchangeDone.disabled = state.busy;
      ui.trumpButtons.forEach(function (button) {
        button.classList.remove("selected");
        button.disabled = true;
      });
      renderHandGrid(ui.trumpHand, state.kittyReviewHand, null, "reference");
      renderHandGrid(ui.trumpReferenceHand, callablePartnerCards(), togglePendingCallPartnerCard, "call-partner");
      return;
    }

    if (isWoodsonDeclare) {
      ui.trumpPhaseLabel.textContent = "Choose Power";
      ui.trumpTitle.textContent = "Lock In Power Suit";
      ui.trumpBidAmount.textContent = PLAYER_NAMES[state.bidder] + " at " + state.winningBid;
      ui.trumpProcessing.classList.add("hidden");
      ui.trumpKittyBlock.classList.remove("hidden");
      ui.trumpReferenceBlock.classList.remove("hidden");
      ui.discardStatusRow.classList.remove("hidden");
      if (ui.discardStatusLabel) {
        ui.discardStatusLabel.textContent = "Final kitty";
      }
      ui.discardStatus.textContent = String(state.buriedKitty.length);
      if (ui.trumpHandLabel) {
        ui.trumpHandLabel.textContent = "Your final hand";
      }
      if (ui.trumpReferenceLabel) {
        ui.trumpReferenceLabel.textContent = "Face-up kitty";
      }
      ui.aiTrumpContinue.classList.add("hidden");
      ui.confirmTrump.classList.remove("hidden");
      ui.exchangeDone.classList.add("hidden");
      ui.confirmTrump.textContent = "Show Exchange";
      ui.confirmTrump.disabled = !state.selectedTrump || state.busy;
      ui.trumpButtons.forEach(function (button) {
        var suit = button.getAttribute("data-trump");
        button.classList.toggle("selected", suit === state.selectedTrump);
        button.disabled = state.busy;
      });
      renderHandGrid(ui.trumpHand, state.kittyReviewHand, null, "reference");
      renderHandGrid(ui.trumpReferenceHand, state.buriedKitty, null, "reference");
      return;
    }

    if (isWoodsonExchange) {
      ui.trumpPhaseLabel.textContent = "Kitty Exchange";
      ui.trumpTitle.textContent = exchangePlayer === 0
        ? "Trade With The Kitty"
        : PLAYER_NAMES[exchangePlayer] + " is trading";
      ui.trumpBidAmount.textContent = PLAYER_NAMES[state.bidder] + " at " + state.winningBid + " • " + SUIT_LABEL[state.trump] + " power";
      ui.confirmTrump.textContent = "Swap Selected";
      ui.discardStatusRow.classList.remove("hidden");
      if (ui.discardStatusLabel) {
        ui.discardStatusLabel.textContent = "Swaps used";
      }
      ui.discardStatus.textContent = woodsonSwapCount(exchangePlayer) + "/3";
      ui.trumpProcessing.classList.toggle("hidden", showingHumanExchange);
      ui.trumpKittyBlock.classList.remove("hidden");
      ui.trumpReferenceBlock.classList.remove("hidden");
      ui.aiTrumpContinue.classList.add("hidden");
      ui.confirmTrump.classList.toggle("hidden", !showingHumanExchange);
      ui.exchangeDone.classList.toggle("hidden", !showingHumanExchange);
      if (!showingHumanExchange) {
        ui.trumpProcessingText.textContent = PLAYER_NAMES[exchangePlayer] + " is deciding what to trade.";
        ui.trumpProcessingBar.style.width = "100%";
      }
      ui.trumpButtons.forEach(function (button) {
        button.classList.remove("selected");
        button.disabled = true;
      });
      ui.confirmTrump.disabled = !showingHumanExchange || !state.exchangeSelectedHandCardId || !state.exchangeSelectedKittyCardId || woodsonSwapCount(0) >= 3;
      ui.exchangeDone.disabled = !showingHumanExchange;
      if (ui.trumpHandLabel) {
        ui.trumpHandLabel.textContent = exchangePlayer === 0 ? "Your hand" : PLAYER_NAMES[exchangePlayer] + "'s hand";
      }
      if (ui.trumpReferenceLabel) {
        ui.trumpReferenceLabel.textContent = "Face-up kitty";
      }
      renderHandGrid(
        ui.trumpHand,
        state.hands[exchangePlayer] || [],
        showingHumanExchange ? toggleWoodsonExchangeHandSelection : null,
        showingHumanExchange ? "woodson-hand" : "reference"
      );
      renderHandGrid(
        ui.trumpReferenceHand,
        state.kitty,
        showingHumanExchange ? toggleWoodsonExchangeKittySelection : null,
        showingHumanExchange ? "woodson-kitty" : "reference"
      );
      return;
    }

    ui.trumpPhaseLabel.textContent = "Power and Kitty";
    ui.trumpTitle.textContent = isWoodsonSetup ? "Review The Kitty" : "Get Set Up";
    ui.trumpBidAmount.textContent = PLAYER_NAMES[state.bidder] + " at " + state.winningBid;
    ui.confirmTrump.textContent = isWoodsonSetup ? "Lock Kitty" : (isWoodsonRuleset() ? "Show Exchange" : "Confirm Selection");
    if (ui.trumpHandLabel) {
      ui.trumpHandLabel.innerHTML = "Hand and kitty <span class=\"kitty-legend-icon\" aria-hidden=\"true\"></span>";
    }
    if (ui.trumpReferenceLabel) {
      ui.trumpReferenceLabel.textContent = isWoodsonSetup ? "Your starting hand" : "Your hand";
    }
    ui.discardStatusRow.classList.toggle("hidden", state.bidder !== 0);
    if (ui.discardStatusLabel) {
      ui.discardStatusLabel.textContent = "Discard " + bidderDiscardCount() + " cards";
    }
    ui.discardStatus.textContent = state.selectedDiscards.length + "/" + bidderDiscardCount();
    ui.trumpProcessing.classList.toggle("hidden", state.bidder === 0);
    ui.trumpKittyBlock.classList.toggle("hidden", state.bidder !== 0);
    ui.trumpReferenceBlock.classList.toggle("hidden", state.bidder === 0);
    ui.aiTrumpContinue.classList.toggle("hidden", state.bidder === 0);
    ui.confirmTrump.classList.toggle("hidden", state.bidder !== 0);
    ui.exchangeDone.classList.add("hidden");
    if (state.bidder !== 0) {
      ui.trumpProcessingText.textContent = state.aiTrumpReady
        ? PLAYER_NAMES[state.bidder] + " chose " + SUIT_LABEL[state.selectedTrump] + " as the Power suit."
        : PLAYER_NAMES[state.bidder] + " is deciding ...";
      ui.trumpProcessingBar.style.width = state.aiTrumpReady || state.aiTrumpMeterStarted ? "100%" : "0";
      ui.aiTrumpContinue.textContent = isWoodsonRuleset() ? "Continue to Exchange" : "Let's Play";
      ui.aiTrumpContinue.disabled = !state.aiTrumpReady;
      aiPartnerCard = state.aiTrumpReady && isCallPartnerRuleset() ? calledPartnerCardData() : null;
      if (aiPartnerCard && ui.aiPartnerCallSummary) {
        ui.aiPartnerCallSummary.classList.remove("hidden");
        renderHandGrid(ui.aiPartnerCallCard, [aiPartnerCard], null, "reference");
        if (ui.aiPartnerCallTitle) {
          ui.aiPartnerCallTitle.textContent = calledPartnerCardLabel();
        }
        if (ui.aiPartnerCallLead) {
          ui.aiPartnerCallLead.textContent = state.askPartnerToLead ? "Partner leads" : "Bidder leads";
          ui.aiPartnerCallLead.classList.toggle("is-on", state.askPartnerToLead);
        }
        if (ui.aiPartnerCallDetail) {
          ui.aiPartnerCallDetail.textContent = state.askPartnerToLead
            ? PLAYER_NAMES[state.bidder] + " asked the called partner to open the round."
            : PLAYER_NAMES[state.bidder] + " kept the opening lead.";
        }
      }
    }

    ui.trumpButtons.forEach(function (button) {
      var suit = button.getAttribute("data-trump");
      var selected = suit === state.selectedTrump && (state.bidder === 0 || state.aiTrumpReady);
      button.classList.toggle("selected", selected);
      button.disabled = state.bidder !== 0 || state.busy || isWoodsonSetup;
    });

    ui.confirmTrump.disabled = state.busy ||
      (state.bidder === 0 && state.selectedDiscards.length !== bidderDiscardCount()) ||
      (!isWoodsonSetup && !state.selectedTrump);
    renderHandGrid(
      ui.trumpHand,
      sortedCombinedBidderCards(),
      state.bidder === 0 ? toggleDiscard : null,
      state.bidder === 0 ? "kitty" : "reference"
    );
    renderHandGrid(ui.trumpReferenceHand, state.initialHands[0], null, "reference");
  }

  function renderPlayPhase() {
    var reactionCoolingDown = Date.now() < state.playerReactionReadyAt;
    var seats = seatLayout();

    ui.playTrump.textContent = state.trump ? SUIT_LABEL[state.trump] : "-";
    ui.playTrump.className = "trump-display";
    ui.playTrump.innerHTML = "";
    if (state.trump) {
      var chip = document.createElement("span");
      chip.className = "trump-chip trump-" + state.trump;
      ui.playTrump.appendChild(chip);
      ui.playTrump.appendChild(document.createTextNode(SUIT_LABEL[state.trump]));
    } else {
      ui.playTrump.textContent = "-";
    }
    renderPlayContract();
    ui.playMessage.textContent = currentPlayLaneMessage();
    ui.playMessage.classList.toggle("is-turn", state.currentPlayer === 0 && !state.busy);
    if (ui.playReactionToast) {
      ui.playReactionToast.textContent = state.playReactionText || "";
      ui.playReactionToast.classList.toggle("hidden", !state.playReactionText);
    }
    ui.handHint.textContent = state.currentPlayer === 0 && !state.busy ? "Your turn to play" : PLAYER_NAMES[state.currentPlayer] + " to play";
    ui.reactionNice.disabled = reactionCoolingDown || state.stickerActive;
    ui.reactionOof.disabled = reactionCoolingDown || state.stickerActive;
    applySeatVisibility();
    seats.forEach(function (seatData) {
      seatData.name.textContent = seatDisplayName(seatData.player);
      seatData.count.textContent = state.playerPoints[seatData.player] + " pts";
      seatData.name.parentNode.classList.toggle("is-bidder-seat", isCallPartnerRuleset() && seatData.player === state.bidder);
      seatData.name.parentNode.classList.toggle(
        "is-partner-seat",
        isCallPartnerRuleset() && state.callPartnerRevealed && seatData.player === state.callPartnerPlayer
      );
    });
    syncSeatHighlight();
    seats.forEach(function (seatData) {
      renderSlot(seatData.slot, playForSeat(seatData.player), state.winningCardPlayer === seatData.player);
    });
    renderHandGrid(ui.playerHand, state.hands[0], state.currentPlayer === 0 && !state.busy ? playHumanCard : null, "play");
  }

  function renderScoringInterstitial() {
    var scoring = state.scoringInterstitial;
    var usProgress;
    var themProgress;

    if (!scoring) {
      return;
    }

    usProgress = Math.max(0, Math.min(100, state.scoringMeterProgress[0]));
    themProgress = Math.max(0, Math.min(100, state.scoringMeterProgress[1]));
    ui.scoringTitle.textContent = "Round " + state.roundNumber + " Score Reveal";
    ui.scoringSubtitle.textContent = scoring.bidderName + " bid " + scoring.winningBid + ". Counting points.";
    if (ui.scoringLabelUs) {
      ui.scoringLabelUs.textContent = isCallPartnerRuleset() ? "Bid side" : "Us";
    }
    if (ui.scoringLabelThem) {
      ui.scoringLabelThem.textContent = isCallPartnerRuleset() ? "Opponents" : "Them";
    }
    ui.scoringUsPoints.textContent = String(scoring.usAccrued);
    ui.scoringThemPoints.textContent = String(scoring.themAccrued);
    ui.scoringUsFill.style.width = usProgress + "%";
    ui.scoringThemFill.style.width = themProgress + "%";
    ui.scoringUsBidMarker.classList.toggle("hidden", scoring.bidderTeam !== 0);
    ui.scoringThemBidMarker.classList.toggle("hidden", scoring.bidderTeam !== 1);

    if (scoring.bidderTeam === 0) {
      ui.scoringUsBidMarker.style.left = scoring.bidMarkerPct + "%";
      ui.scoringUsBidMarker.style.opacity = scoring.usAccrued >= scoring.winningBid ? "1" : "0.72";
    } else {
      ui.scoringThemBidMarker.style.left = scoring.bidMarkerPct + "%";
      ui.scoringThemBidMarker.style.opacity = scoring.themAccrued >= scoring.winningBid ? "1" : "0.72";
    }

    ui.scoringOutcome.classList.toggle("hidden", !state.scoringOutcomeVisible);
    if (state.scoringOutcomeVisible) {
      ui.scoringOutcome.textContent = scoring.outcomeLine;
      renderScoringStorySticker();
    } else {
      clearScoringStorySticker();
    }
  }

  function renderScoringStorySticker() {
    var scoring = state.scoringInterstitial;
    var image;

    if (!ui.scoringStorySticker || !scoring || !scoring.stickerAsset) {
      clearScoringStorySticker();
      return;
    }

    ui.scoringStorySticker.innerHTML = "";
    ui.scoringStorySticker.classList.remove("hidden");
    ui.scoringStorySticker.classList.toggle("is-landscape", Boolean(scoring.stickerLandscape));

    image = document.createElement("img");
    image.src = scoring.stickerAsset;
    image.alt = "";
    image.decoding = "async";
    image.setAttribute("aria-hidden", "true");
    ui.scoringStorySticker.appendChild(image);
  }

  function clearScoringStorySticker() {
    if (!ui.scoringStorySticker) {
      return;
    }

    ui.scoringStorySticker.innerHTML = "";
    ui.scoringStorySticker.classList.add("hidden");
    ui.scoringStorySticker.classList.remove("is-landscape");
  }

  function currentPlayLaneMessage() {
    return state.roundMessage || "";
  }

  function syncTopbarScrollState() {
    if (!ui.topbar) {
      return;
    }
    ui.topbar.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function contractPillClass(cardId) {
    var card = buildDeck().find(function (entry) {
      return entry.id === cardId;
    });

    if (!card) {
      return "is-hidden";
    }
    if (card.isRook) {
      return "is-rook";
    }
    return "is-" + card.suit;
  }

  function renderPlayContract() {
    var contractText;
    var pill;

    if (!state.winningBid) {
      ui.playContract.textContent = "-";
      return;
    }

    if (!isCallPartnerRuleset() || !state.callPartnerCardId) {
      ui.playContract.textContent = PLAYER_NAMES[state.bidder] + " bid " + state.winningBid;
      return;
    }

    ui.playContract.innerHTML = "";
    contractText = document.createElement("span");
    contractText.className = "contract-bid-text";
    contractText.textContent = PLAYER_NAMES[state.bidder] + " bid " + state.winningBid;
    pill = document.createElement("span");
    pill.className = "contract-pill " + (humanKnowsCalledPartnerCard() ? contractPillClass(state.callPartnerCardId) : "is-hidden");
    pill.textContent = humanKnowsCalledPartnerCard() ? calledPartnerCardLabel() : "Partner hidden";
    ui.playContract.appendChild(contractText);
    ui.playContract.appendChild(document.createTextNode(" "));
    ui.playContract.appendChild(pill);
  }

  function clearPlayerReactionCooldown() {
    if (state.playerReactionCooldownId !== null) {
      window.clearTimeout(state.playerReactionCooldownId);
      state.playerReactionCooldownId = null;
    }
    state.playerReactionReadyAt = 0;
  }

  function clearPlayReaction(shouldRender) {
    if (state.playReactionTimeoutId !== null) {
      window.clearTimeout(state.playReactionTimeoutId);
      state.playReactionTimeoutId = null;
    }
    if (!state.playReactionText) {
      return;
    }
    state.playReactionText = "";
    if (shouldRender && state.phase === "play") {
      renderPlayPhase();
    }
  }

  function startPlayerReactionCooldown() {
    clearPlayerReactionCooldown();
    state.playerReactionReadyAt = Date.now() + PLAYER_REACTION_COOLDOWN;
    state.playerReactionCooldownId = window.setTimeout(function () {
      state.playerReactionCooldownId = null;
      state.playerReactionReadyAt = 0;
      if (state.phase === "play") {
        renderPlayPhase();
      }
    }, PLAYER_REACTION_COOLDOWN);
  }

  function randomPlayerReactionStickerType(tone) {
    var positivePool = ["bid_made", "big_trick"];

    if (tone === "nice") {
      return positivePool[Math.floor(Math.random() * positivePool.length)];
    }
    return "bid_set";
  }

  function triggerPlayerStickerReaction(tone) {
    var type;

    if (state.phase !== "play" || state.stickerActive || Date.now() < state.playerReactionReadyAt) {
      return;
    }

    type = randomPlayerReactionStickerType(tone);
    if (!showSticker(type, { bypassCooldown: true })) {
      return;
    }

    startPlayerReactionCooldown();
    renderPlayPhase();
  }

  function randomAiPlayReactionSpeaker(excludedPlayer) {
    var candidates = activeAiSeatsForState().filter(function (player) {
      return player !== excludedPlayer;
    });

    if (!candidates.length) {
      candidates = activeAiSeatsForState();
    }
    if (!candidates.length) {
      return null;
    }

    return PLAYER_NAMES[candidates[Math.floor(Math.random() * candidates.length)]];
  }

  function showPlayReactionText(text, duration) {
    clearPlayReaction(false);
    state.playReactionText = text;
    state.playReactionTimeoutId = window.setTimeout(function () {
      state.playReactionTimeoutId = null;
      state.playReactionText = "";
      if (state.phase === "play") {
        renderPlayPhase();
      }
    }, duration || PLAY_REACTION_DURATION);
  }

  function maybeShowAiPlayReaction(kind, featuredPlayer) {
    var lines = AI_PLAY_REACTION_COPY[kind];
    var speaker;
    var line;
    var chance = kind === "rook" ? 0.78 : 0.58;

    if (state.phase !== "play" || !lines || !lines.length || Math.random() > chance) {
      return;
    }

    speaker = randomAiPlayReactionSpeaker(featuredPlayer);
    if (!speaker) {
      return;
    }

    line = lines[Math.floor(Math.random() * lines.length)];
    showPlayReactionText(speaker + ": " + line, PLAY_REACTION_DURATION);
  }

  function showSticker(type, options) {
    var config = STICKER_CONFIG[type];
    var now = Date.now();
    var asset;
    var sticker;
    var optionsData = options || {};

    if (!config || !ui.stickerOverlay) {
      return false;
    }
    if (state.stickerActive) {
      return false;
    }
    if (!optionsData.bypassCooldown && now - state.stickerLastShownAt < STICKER_COOLDOWN) {
      return false;
    }

    clearSticker(true);
    state.stickerActive = true;
    state.stickerLastShownAt = now;

    sticker = document.createElement("div");
    sticker.className = "sticker-burst sticker-size-" + config.size + " sticker-intensity-" + config.intensity;
    sticker.style.setProperty("--sticker-duration", config.duration + "ms");
    asset = randomStickerAsset(config);

    if (asset) {
      var image = document.createElement("img");
      image.className = "sticker-image";
      image.src = asset;
      image.alt = "";
      image.decoding = "async";
      image.setAttribute("aria-hidden", "true");
      sticker.appendChild(image);
    } else {
      var placeholder = document.createElement("div");
      placeholder.className = "sticker-placeholder tone-" + (config.tone || "neutral");
      placeholder.textContent = config.label;
      sticker.appendChild(placeholder);
    }

    ui.stickerOverlay.appendChild(sticker);

    sticker.addEventListener("animationend", function () {
      clearSticker();
    }, { once: true });

    state.stickerCleanupId = window.setTimeout(function () {
      clearSticker();
    }, config.duration + 120);

    return true;
  }

  function randomStickerAsset(config) {
    if (!config.assets || !config.assets.length) {
      return config.asset || null;
    }
    return config.assets[Math.floor(Math.random() * config.assets.length)];
  }

  function clearSticker(skipRender) {
    if (state.stickerCleanupId !== null) {
      window.clearTimeout(state.stickerCleanupId);
      state.stickerCleanupId = null;
    }
    state.stickerActive = false;
    if (ui.stickerOverlay) {
      ui.stickerOverlay.innerHTML = "";
    }
    if (!skipRender && state.phase === "play") {
      renderPlayPhase();
    }
  }

  function playForSeat(player) {
    return state.trick.find(function (play) {
      return play.player === player;
    });
  }

  function renderSlot(slot, play, isWinner) {
    slot.innerHTML = "";

    var card = play ? createPlayedCardNode(play.card, isWinner) : document.createElement("div");
    if (!play) {
      card.className = "played-card empty";
    }

    slot.appendChild(card);
  }

  function renderSummaryPhase() {
    if (!state.summary) {
      return;
    }

    ui.summaryPhaseLabel.textContent = state.summaryStep === 1
      ? "Round Summary"
      : "Match Summary";
    ui.summaryTitle.textContent = state.summaryStep === 1 ? summaryHeading() : matchSummaryHeading();
    if (ui.summaryUsLabel) {
      ui.summaryUsLabel.textContent = isCallPartnerRuleset() ? "Bid side this round" : "Us this round";
    }
    if (ui.summaryThemLabel) {
      ui.summaryThemLabel.textContent = isCallPartnerRuleset() ? "Opponents this round" : "Them this round";
    }
    if (ui.summaryTableLabelUs) {
      ui.summaryTableLabelUs.textContent = isCallPartnerRuleset() ? "Bid side" : "Us";
    }
    if (ui.summaryTableLabelThem) {
      ui.summaryTableLabelThem.textContent = isCallPartnerRuleset() ? "Opponents" : "Them";
    }
    ui.summaryUs.textContent = state.summary.us;
    ui.summaryThem.textContent = state.summary.them;
    ui.summaryBid.textContent = state.summary.bid;
    if (ui.summaryResult) {
      ui.summaryResult.textContent = state.summary.result;
    }
    ui.nextRound.disabled = state.busy;
    ui.nextRound.textContent = summaryButtonLabel();
    ui.summarySeeStats.classList.toggle("hidden", !(state.summaryStep === 2 && state.gameOver));
    ui.summarySeeStats.classList.toggle("summary-secondary-action", state.summaryStep === 2 && state.gameOver);
    ui.summaryGrid.classList.toggle("hidden", state.summaryStep === 2);
    ui.backToRoundSummary.classList.toggle("hidden", state.summaryStep !== 2);
    ui.summaryNav.classList.toggle("has-back", state.summaryStep === 2);
    ui.summaryHistoryNav.classList.toggle("hidden", state.summaryStep !== 2);
    ui.toggleScoring.classList.toggle("hidden", state.summaryStep !== 1);
    ui.toggleScoring.textContent = state.summaryScoringOpen ? "Hide scoring cards" : "View scoring cards";
    ui.summaryScoring.classList.toggle("hidden", state.summaryStep !== 1 || !state.summaryScoringOpen);
    ui.summaryHistory.classList.toggle("hidden", state.summaryStep !== 2);
    ui.summaryStory.classList.toggle("hidden", state.summaryStep !== 1);
    ui.summaryProfileCard.classList.toggle("hidden", !(state.summaryStep === 2 && state.gameOver));
    ui.summaryFinalResult.classList.toggle("hidden", !(state.summaryStep === 2 && state.gameOver));
    clearSummaryStorySticker();

    if (state.summaryStep === 1) {
      if (ui.summaryNav.parentNode !== ui.phaseSummary.querySelector(".panel-card")) {
        ui.phaseSummary.querySelector(".panel-card").insertBefore(ui.summaryNav, ui.toggleScoring);
      }
      ui.summaryStoryLabel.textContent = state.summary.storyLabel;
      ui.summaryStoryHeadline.textContent = state.summary.storyHeadline;
      ui.summaryStoryMood.textContent = state.summary.storyMood;
      ui.summaryDetail.textContent = state.summary.margin || "";
      if (state.summaryScoringOpen) {
        renderSummaryScoring();
      } else {
        ui.summaryScoringGrid.innerHTML = "";
      }
      ui.summaryTableBody.innerHTML = "";
      applyMatchSummaryBackground();
      return;
    }

    if (ui.summaryNav.parentNode !== ui.summaryHistoryNav) {
      ui.summaryHistoryNav.appendChild(ui.summaryNav);
    }
    ui.summaryDetail.textContent = "";
    clearSummaryStorySticker();
    ui.summaryMatchScoreboard.classList.toggle("hidden", isCallPartnerRuleset());
    ui.summaryStandings.classList.toggle("hidden", !isCallPartnerRuleset());
    if (isCallPartnerRuleset()) {
      var leader = leadingOtherPlayer();
      if (ui.summaryMatchLabelPrimary) {
        ui.summaryMatchLabelPrimary.textContent = "You";
      }
      if (ui.summaryMatchLabelSecondary) {
        ui.summaryMatchLabelSecondary.textContent = PLAYER_NAMES[leader];
      }
      ui.summaryMatchUs.textContent = state.individualMatchPoints[0];
      ui.summaryMatchThem.textContent = state.individualMatchPoints[leader];
      renderCallPartnerStandings();
    } else {
      if (ui.summaryMatchLabelPrimary) {
        ui.summaryMatchLabelPrimary.textContent = "Us";
      }
      if (ui.summaryMatchLabelSecondary) {
        ui.summaryMatchLabelSecondary.textContent = "Them";
      }
      ui.summaryMatchUs.textContent = state.matchPoints[0];
      ui.summaryMatchThem.textContent = state.matchPoints[1];
      ui.summaryStandings.innerHTML = "";
    }
    ui.summaryMatchNote.textContent = matchSummaryNote();
    renderFinalResultBanner();
    applyMatchSummaryBackground();
    if (state.gameOver) {
      renderSummaryProfileCard();
    }
    renderSummaryTable();
  }

  function finalResultHeadline() {
    if (isCallPartnerRuleset()) {
      return didHumanWinCurrentMatch() ? "You Won The Match" : matchWinnerLabel() + " Won The Match";
    }
    return didHumanWinCurrentMatch() ? "You Won The Match" : "You Lost The Match";
  }

  function finalResultScoreLine() {
    if (isCallPartnerRuleset()) {
      var winner = currentCallPartnerMatchWinnerPlayer();
      var leader = winner === null || winner === 0 ? leadingOtherPlayer() : winner;
      return "You " + state.individualMatchPoints[0] + " • " + PLAYER_NAMES[leader] + " " + state.individualMatchPoints[leader];
    }
    return "Us " + state.matchPoints[0] + " • Them " + state.matchPoints[1];
  }

  function finalResultDetail() {
    var target = getRuleConfig().matchTarget;

    if (isCallPartnerRuleset()) {
      return didHumanWinCurrentMatch()
        ? "You reached " + target + " first and closed out the match."
        : matchWinnerLabel() + " reached " + target + " first and ended the match.";
    }

    return didHumanWinCurrentMatch()
      ? "Your side got to " + target + " first."
      : "The other team got to " + target + " first.";
  }

  function renderFinalResultBanner() {
    if (!ui.summaryFinalResult) {
      return;
    }

    if (!(state.summaryStep === 2 && state.gameOver)) {
      ui.summaryFinalResult.classList.add("hidden");
      ui.summaryFinalResult.classList.remove("is-win");
      ui.summaryFinalResult.classList.remove("is-loss");
      return;
    }

    ui.summaryFinalResult.classList.remove("hidden");
    ui.summaryFinalResult.classList.toggle("is-win", didHumanWinCurrentMatch());
    ui.summaryFinalResult.classList.toggle("is-loss", !didHumanWinCurrentMatch());
    ui.summaryFinalResultEyebrow.textContent = "Match Over";
    ui.summaryFinalResultTitle.textContent = finalResultHeadline();
    ui.summaryFinalResultScore.textContent = finalResultScoreLine();
    ui.summaryFinalResultDetail.textContent = finalResultDetail();
  }

  function applyMatchSummaryBackground() {
    var asset = null;
    var humanWon = didHumanWinCurrentMatch();

    if (!ui.matchSummaryBackdrop) {
      return;
    }

    if (state.phase === "summary" && state.summaryStep === 2 && state.gameOver) {
      asset = getMatchSummaryGifAsset();
    }

    if (asset) {
      ui.matchSummaryBackdrop.style.setProperty("--match-summary-gif", 'url("' + asset + '")');
      ui.matchSummaryBackdrop.classList.add("is-visible");
      ui.matchSummaryBackdrop.classList.toggle("is-win", humanWon);
      ui.matchSummaryBackdrop.classList.toggle("is-loss", !humanWon);
      return;
    }

    ui.matchSummaryBackdrop.style.removeProperty("--match-summary-gif");
    ui.matchSummaryBackdrop.classList.remove("is-visible");
    ui.matchSummaryBackdrop.classList.remove("is-win");
    ui.matchSummaryBackdrop.classList.remove("is-loss");
  }

  function getMatchSummaryGifAsset() {
    var outcome;
    var assets;

    if (state.summaryMatchGif) {
      return state.summaryMatchGif;
    }

    outcome = didHumanWinCurrentMatch() ? "win" : "loss";
    assets = MATCH_SUMMARY_GIF_CONFIG[outcome];

    if (!assets || !assets.length) {
      return null;
    }

    state.summaryMatchGif = assets[Math.floor(Math.random() * assets.length)];
    return state.summaryMatchGif;
  }

  function renderSummaryProfileCard() {
    ui.summaryProfileStatus.textContent = profileWinRateText();
    ui.summaryProfileRecord.textContent = profile.totals.matchesWon + "-" + profile.totals.matchesLost;
    ui.summaryProfileBidRate.textContent = profileBidRateText();
    ui.summaryProfileBestRound.textContent = String(profile.human.bestRoundPoints);
    ui.summaryProfileStreak.textContent = String(profile.streaks.currentMatchWinStreak);
    ui.summaryProfileDetail.textContent =
      "Rounds logged: " + profile.totals.roundsCompleted + ". Human bids won: " +
      profile.human.bidsWon + ". Includes all game modes.";
  }

  function renderSummaryStorySticker() {
    var stickerType;
    var asset;
    var image;

    if (!ui.summaryStorySticker || !state.summary) {
      return;
    }

    stickerType = getSummaryStoryStickerType();
    asset = stickerType ? randomSummaryStickerAsset(stickerType) : null;

    if (!asset) {
      clearSummaryStorySticker();
      return;
    }

    ui.summaryStorySticker.innerHTML = "";
    ui.summaryStorySticker.classList.remove("hidden");
    ui.summaryStorySticker.classList.toggle("is-landscape", asset.indexOf("lsp") !== -1 || asset.indexOf("facepalm") !== -1);

    image = document.createElement("img");
    image.src = asset;
    image.alt = "";
    image.decoding = "async";
    image.setAttribute("aria-hidden", "true");
    ui.summaryStorySticker.appendChild(image);
  }

  function clearSummaryStorySticker() {
    if (!ui.summaryStorySticker) {
      return;
    }
    ui.summaryStorySticker.innerHTML = "";
    ui.summaryStorySticker.classList.add("hidden");
    ui.summaryStorySticker.classList.remove("is-landscape");
  }

  function getSummaryStoryStickerType() {
    var bidderTeam;
    var bidMade;
    var bidMargin;

    if (!state.summary) {
      return null;
    }

    bidderTeam = state.summary.bidderTeam;
    bidMade = state.summary.bidMade;
    bidMargin = state.summary.bidMargin;

    if (getRuleConfig().contractScoring === "none" || isCallPartnerRuleset()) {
      return null;
    }

    if (bidMade) {
      if (bidderTeam === 0) {
        return bidMargin <= SUMMARY_CLOSE_CALL_MARGIN ? "summary_close_call" : "summary_win";
      }
      return "summary_team_loss";
    }

    if (bidderTeam === 0) {
      return state.bidder === 0 ? "summary_self_loss" : "summary_team_loss";
    }

    return "summary_win";
  }

  function randomSummaryStickerAsset(type) {
    var assets = SUMMARY_STICKER_CONFIG[type];

    if (!assets || !assets.length) {
      return null;
    }

    return assets[Math.floor(Math.random() * assets.length)];
  }

  function summaryHeading() {
    var bidderName = state.bidder === 0 ? "You" : PLAYER_NAMES[state.bidder];
    var bidderTeam = teamForPlayer(state.bidder);
    var sideLabel = isCallPartnerRuleset() && state.callPartnerPlayer !== null
      ? (state.bidder === 0 ? "You + " + PLAYER_NAMES[state.callPartnerPlayer] : bidderName + " + " + PLAYER_NAMES[state.callPartnerPlayer])
      : null;

    if (isCallPartnerRuleset()) {
      return sideLabel
        ? (state.summary && state.summary.bidMade ? sideLabel + " made the bid" : sideLabel + " missed the bid")
        : (bidderName + " bid " + state.winningBid);
    }

    if (getRuleConfig().contractScoring === "none") {
      return bidderTeam === 0 ? "Your team scored the round" : bidderName + "'s team scored the round";
    }

    if (bidderTeam === 0) {
      return state.summary && state.summary.bidMade
        ? (sideLabel || "Your team") + " made the bid"
        : (sideLabel || "Your team") + " missed the bid";
    }
    return state.summary && state.summary.bidMade ? bidderName + " made the bid" : "You set " + bidderName;
  }

  function matchSummaryHeading() {
    return state.gameOver ? "Match Over" : "Overall Score";
  }

  function summaryButtonLabel() {
    if (state.summaryStep === 1) {
      return "Continue";
    }
    return state.gameOver ? "Start New Match" : "Next Round";
  }

  function matchSummaryNote() {
    if (isCallPartnerRuleset() && !state.gameOver) {
      return "First player to " + getRuleConfig().matchTarget + " wins.";
    }
    if (state.gameOver) {
      return matchWinnerLabel() + " got to " + getRuleConfig().matchTarget + " first.";
    }
    return "First to " + getRuleConfig().matchTarget + " wins.";
  }

  function matchWinnerLabel() {
    if (isCallPartnerRuleset()) {
      var winner = currentCallPartnerMatchWinnerPlayer();
      return winner === null ? "No one" : PLAYER_NAMES[winner];
    }
    return state.matchPoints[0] > state.matchPoints[1] ? "Us" : "Them";
  }

  function buildSummaryStory(bidderTeam, bidderName, bidderTotal, bidMade, bidMargin) {
    var bidderIsUs = bidderTeam === 0;
    var mood = bidOutcomeMood(bidMargin);
    var bidderSideLabel = isCallPartnerRuleset() && state.callPartnerPlayer !== null
      ? bidderName + " + " + PLAYER_NAMES[state.callPartnerPlayer]
      : bidderName;

    if (isCallPartnerRuleset()) {
      return {
        label: bidderName + "'s bid",
        headline: bidderSideLabel + " needed " + state.winningBid + " and finished with " + bidderTotal + ".",
        mood: bidMade ? bidderSideLabel + " got there. " + mood.make : bidderSideLabel + " came up short. " + mood.miss
      };
    }

    if (getRuleConfig().contractScoring === "none") {
      if (bidderIsUs) {
        return {
          label: state.bidder === 0 ? "Your bid" : bidderName + "'s bid",
          headline: "Your team scored " + bidderTotal + " after a bid of " + state.winningBid + ".",
          mood: bidMade ? "Your side cleared the bid and kept the points." : "No set penalty here. Every counter still counted."
        };
      }
      return {
        label: bidderName + "'s bid",
        headline: bidderName + "'s team scored " + bidderTotal + " after a bid of " + state.winningBid + ".",
        mood: bidMade ? bidderName + " cleared the bid and kept the points." : "No set penalty here. The round still counted normally."
      };
    }

    if (bidderIsUs) {
      return {
        label: state.bidder === 0 ? "Your bid" : bidderName + "'s bid",
        headline: (isCallPartnerRuleset() ? bidderSideLabel : "Your team") + " needed " + state.winningBid + " and finished with " + bidderTotal + ".",
        mood: bidMade ? "Your side got there. " + mood.make : "Your side came up short. " + mood.miss
      };
    }

    return {
      label: bidderName + "'s bid",
      headline: bidderSideLabel + " needed " + state.winningBid + " and finished with " + bidderTotal + ".",
      mood: bidMade
        ? bidderName + " got there. " + mood.oppMake
        : "Your team set " + bidderName + ". " + mood.oppMiss
    };
  }

  function bidOutcomeMood(margin) {
    if (margin <= 5) {
      return {
        make: "A razor-thin finish.",
        miss: "It was right there.",
        oppMake: "They barely escaped.",
        oppMiss: "You caught them at the line."
      };
    }
    if (margin <= 20) {
      return {
        make: "A solid make.",
        miss: "Not far off.",
        oppMake: "They had just enough room.",
        oppMiss: "Your team shut the door in time."
      };
    }
    return {
      make: "That one was never really in doubt.",
      miss: "That one slipped away hard.",
      oppMake: "They were in control most of the way.",
      oppMiss: "Your team took over that round."
    };
  }

  function renderHistoryDrawer() {
    var hasHistory = !!state.previousTrick && state.phase === "play";

    ui.historyToggle.classList.toggle("hidden", !hasHistory);

    if (!hasHistory) {
      state.historyOpen = false;
      ui.historyDrawer.classList.remove("open");
      ui.historyBackdrop.classList.add("hidden");
      if (ui.historyContent.innerHTML) {
        ui.historyContent.innerHTML = "";
      }
      return;
    }

    ui.historyDrawer.classList.toggle("open", state.historyOpen);
    ui.historyBackdrop.classList.toggle("hidden", !state.historyOpen);

    if (!state.historyOpen) {
      return;
    }

    ui.historyContent.innerHTML = "";
    state.previousTrick.cards.forEach(function (play) {
      var row = document.createElement("div");
      var info = document.createElement("div");
      var name = document.createElement("h3");
      var meta = document.createElement("p");
      row.className = "history-play";
      info.className = "history-play-info";
      name.textContent = playerLabel(play.player, true);
      meta.textContent = play.player === state.previousTrick.leader ? "Led the trick" : "Followed";
      info.appendChild(name);
      info.appendChild(meta);
      row.appendChild(createPlayedCardNode(play.card, false));
      row.appendChild(info);
      ui.historyContent.appendChild(row);
    });
    var summaryCard = document.createElement("div");
    summaryCard.className = "history-card";
    summaryCard.innerHTML =
      "<h3>Result</h3>" +
      "<p>" + playerLabel(state.previousTrick.winner, true) + " won the trick (" + summaryPointText(state.previousTrick.points) + ").</p>";
    ui.historyContent.appendChild(summaryCard);
  }

  function renderSummaryTable() {
    ui.summaryTableBody.innerHTML = "";
    state.roundHistory.slice().reverse().forEach(function (rowData) {
      var row = document.createElement("tr");
      var badgeClass = rowData.win === "•"
        ? "is-neutral"
        : (rowData.madeBid ? "is-made" : "is-set");
      row.className = rowData.isLatest ? "latest-round" : "";
      row.innerHTML =
        "<td class=\"round-col\">" + rowData.round + "</td>" +
        "<td class=\"bid-col\">" + rowData.bid + "</td>" +
        "<td class=\"win-col\"><span class=\"win-badge " + badgeClass + "\">" + rowData.win + "</span></td>" +
        "<td class=\"score-col\">" + rowData.us + "</td>" +
        "<td class=\"score-col\">" + rowData.them + "</td>";
      ui.summaryTableBody.appendChild(row);
    });
  }

  function renderCallPartnerStandings() {
    var order;

    if (!ui.summaryStandings) {
      return;
    }

    ui.summaryStandings.innerHTML = "";
    order = currentCallPartnerStandingOrder();

    order.forEach(function (player, index) {
      var row = document.createElement("div");
      var rank = document.createElement("span");
      var name = document.createElement("strong");
      var score = document.createElement("span");
      var move = document.createElement("span");
      var movement = callPartnerStandingMovement(player);

      row.className = "standings-row" +
        (player === 0 ? " is-human" : "") +
        (isCallPartnerRuleset() && player === state.bidder ? " is-bidder" : "") +
        (isCallPartnerRuleset() && state.callPartnerRevealed && player === state.callPartnerPlayer ? " is-partner" : "");
      rank.className = "standings-rank";
      name.className = "standings-name";
      score.className = "standings-score";
      move.className = "standings-move";

      rank.textContent = callPartnerRankLabel(order, index);
      name.textContent = player === 0 ? "You" : PLAYER_NAMES[player];
      score.textContent = (state.individualMatchPoints[player] || 0) + " points";
      move.textContent = movement.text;
      move.classList.add("is-" + movement.direction);

      row.appendChild(rank);
      row.appendChild(name);
      row.appendChild(score);
      row.appendChild(move);
      ui.summaryStandings.appendChild(row);
    });
  }

  function renderSummaryScoring() {
    var grouped = Array(MAX_PLAYER_COUNT).fill(null).map(function () { return []; });

    ui.summaryScoringGrid.innerHTML = "";
    state.completedTricks.forEach(function (trick) {
      trick.scoringItems.forEach(function (item) {
        grouped[trick.winner].push(item);
      });
    });
    if (isCallPartnerRuleset()) {
      buildScoringTeamGroup("Bid Side", roundTeamPlayers(0), grouped);
      buildScoringTeamGroup("Opponents", roundTeamPlayers(1), grouped);
      return;
    }
    buildScoringTeamGroup("Us", [0, 2], grouped);
    buildScoringTeamGroup("Them", [1, 3], grouped);
  }

  function shouldShowRedOneTrumpDot(card) {
    return Boolean(
      card &&
      state.trump &&
      getRuleConfig().redOneAlwaysTrump &&
      card.rank === 1 &&
      card.suit === "red"
    );
  }

  function renderHandGrid(container, hand, clickHandler, mode) {
    renderHandGridModule({
      container: container,
      hand: hand || [],
      clickHandler: clickHandler,
      mode: mode,
      state: state,
      legalCardIdSet: mode === "play" && clickHandler ? getLegalCardIdSet(0) : new Set(),
      canDiscardFromBidderSetup: canDiscardFromBidderSetup,
      canDiscardInWoodsonExchange: canDiscardInWoodsonExchange,
      isCardFromKitty: isCardFromKitty,
      triggerCardLockout: triggerCardLockout,
      cardFaceClass: cardFaceClass,
      cardLabel: cardLabel,
      suitClass: suitClass,
      shouldShowRedOneTrumpDot: shouldShowRedOneTrumpDot
    });
  }

  function renderDealSummary() {
    var playerCount = activeAiSeatsForState().length;

    ui.dealSummary.innerHTML = "";
    ui.dealSummary.style.gridTemplateColumns = "repeat(" + playerCount + ", minmax(0, 1fr))";
    ui.dealSummary.classList.toggle("is-five-player", playerCount > 3);

    activeAiSeatsForState().forEach(function (player, index) {
      var card = document.createElement("div");
      var name = document.createElement("span");
      var badge = document.createElement("strong");
      var count = state.initialHands[player] && state.initialHands[player].length
        ? state.initialHands[player].length
        : state.dealSeatCounts[index];

      card.className = "deal-summary-card";
      card.classList.toggle("is-compact", playerCount > 3);
      if (teamForPlayer(player) === teamForPlayer(0)) {
        card.classList.add("is-teammate");
      }
      name.className = "deal-summary-name";
      badge.className = "deal-summary-badge";
      name.textContent = PLAYER_NAMES[player];
      badge.textContent = "(" + count + ")";
      card.appendChild(name);
      card.appendChild(badge);
      ui.dealSummary.appendChild(card);
    });
  }

  function renderBidStatusBoard() {
    var playerCount = activePlayersForState().length;

    ui.bidStatusBoard.innerHTML = "";
    ui.bidStatusBoard.style.gridTemplateColumns = "repeat(" + playerCount + ", minmax(0, 1fr))";
    ui.bidStatusBoard.classList.toggle("is-five-player", playerCount > 4);

    activePlayersForState().forEach(function (player) {
      var card = document.createElement("div");
      var name = document.createElement("span");
      var meta = document.createElement("span");
      var status = document.createElement("strong");

      card.className = "bid-status-card" +
        (player === state.currentBidTurn && !state.biddingComplete ? " active-bidder" : "") +
        (teamForPlayer(player) === teamForPlayer(0) && player !== 0 ? " teammate-bidder" : "") +
        (state.passed[player] ? " passed-bidder" : "") +
        (player === state.currentBidHolder ? " high-bidder" : "") +
        (state.biddingComplete && player === state.bidder ? " won-bidder" : "");
      card.classList.toggle("is-compact", playerCount > 4);
      name.className = "bid-status-name";
      meta.className = "bid-status-meta";
      status.className = "bid-status-value";
      name.textContent = PLAYER_NAMES[player];
      if (teamForPlayer(player) === teamForPlayer(0) && player !== 0) {
        name.textContent += " •";
      }
      meta.textContent = state.biddingComplete && player === state.bidder
        ? "Bid winner"
        : state.passed[player]
          ? "Passed"
          : player === state.currentBidTurn && !state.biddingComplete
            ? "Bidding now"
            : player === state.currentBidHolder
              ? "High bid"
              : "In";
      status.textContent = state.biddingComplete && player === state.bidder
        ? "Won " + state.winningBid
        : state.bidStatuses[player];
      card.appendChild(name);
      card.appendChild(meta);
      card.appendChild(status);
      ui.bidStatusBoard.appendChild(card);
    });
  }

  function toggleDiscard(cardId) {
    if (state.phase !== "trump" || state.bidder !== 0) {
      return;
    }

    var index = state.selectedDiscards.indexOf(cardId);
    var card = combinedBidderCards().find(function (entry) {
      return entry.id === cardId;
    });

    if (!card || !canDiscardFromBidderSetup(card)) {
      return;
    }

    if (index !== -1) {
      state.selectedDiscards.splice(index, 1);
    } else if (state.selectedDiscards.length < bidderDiscardCount()) {
      state.selectedDiscards.push(cardId);
    } else {
      return;
    }
    markMatchDirty();
    renderTrumpPhase();
  }

  function toggleWoodsonExchangeHandSelection(cardId) {
    if (!woodsonExchangeActive() || woodsonCurrentPlayer() !== 0 || woodsonSwapCount(0) >= 3) {
      return;
    }
    state.exchangeSelectedHandCardId = state.exchangeSelectedHandCardId === cardId ? null : cardId;
    markMatchDirty();
    renderTrumpPhase();
  }

  function toggleWoodsonExchangeKittySelection(cardId) {
    if (!woodsonExchangeActive() || woodsonCurrentPlayer() !== 0 || woodsonSwapCount(0) >= 3) {
      return;
    }
    state.exchangeSelectedKittyCardId = state.exchangeSelectedKittyCardId === cardId ? null : cardId;
    markMatchDirty();
    renderTrumpPhase();
  }

  function togglePendingCallPartnerCard(cardId) {
    if (!isCallPartnerRuleset() || state.phase !== "trump" || state.trumpStage !== "callPartner" || state.bidder !== 0) {
      return;
    }
    state.pendingCallPartnerCardId = state.pendingCallPartnerCardId === cardId ? null : cardId;
    markMatchDirty();
    renderTrumpPhase();
  }

  function confirmWoodsonExchangeSelection() {
    if (!woodsonExchangeActive() || woodsonCurrentPlayer() !== 0 || state.busy) {
      return;
    }
    if (!state.exchangeSelectedHandCardId || !state.exchangeSelectedKittyCardId) {
      return;
    }
    if (!performWoodsonSwap(0, state.exchangeSelectedHandCardId, state.exchangeSelectedKittyCardId)) {
      return;
    }
    state.exchangeSelectedHandCardId = null;
    state.exchangeSelectedKittyCardId = null;
    markMatchDirty();
    renderTrumpPhase();
  }

  function combinedBidderCards() {
    return state.initialHands[state.bidder].concat(state.kitty);
  }

  function sortedCombinedBidderCards() {
    var cards = combinedBidderCards().slice();
    sortHand(cards, state.selectedTrump || state.trump);
    return cards;
  }

  function isCardFromKitty(cardId) {
    return state.kitty.some(function (card) {
      return card.id === cardId;
    });
  }

  function seatLayout() {
    if (isCallPartnerRuleset()) {
      return [
        { player: 0, name: ui.seatBottomName, count: ui.seatBottomCount, slot: ui.slotBottom },
        { player: 1, name: ui.seatLeftName, count: ui.seatLeftCount, slot: ui.slotLeft },
        { player: 2, name: ui.seatTopLeftName, count: ui.seatTopLeftCount, slot: ui.slotTopLeft },
        { player: 3, name: ui.seatTopRightName, count: ui.seatTopRightCount, slot: ui.slotTopRight },
        { player: 4, name: ui.seatRightName, count: ui.seatRightCount, slot: ui.slotRight }
      ];
    }

    return [
      { player: 0, name: ui.seatBottomName, count: ui.seatBottomCount, slot: ui.slotBottom },
      { player: 1, name: ui.seatLeftName, count: ui.seatLeftCount, slot: ui.slotLeft },
      { player: 2, name: ui.seatTopName, count: ui.seatTopCount, slot: ui.slotTop },
      { player: 3, name: ui.seatRightName, count: ui.seatRightCount, slot: ui.slotRight }
    ];
  }

  function applySeatVisibility() {
    var showFive = isCallPartnerRuleset();

    ui.tableArea.classList.toggle("is-five-player", showFive);
    ui.seatTopName.parentNode.classList.toggle("hidden", showFive);
    ui.slotTop.classList.toggle("hidden", showFive);
    ui.seatTopLeftName.parentNode.classList.toggle("hidden", !showFive);
    ui.seatTopRightName.parentNode.classList.toggle("hidden", !showFive);
    ui.slotTopLeft.classList.toggle("hidden", !showFive);
    ui.slotTopRight.classList.toggle("hidden", !showFive);
  }

  function seatDisplayName(player) {
    return PLAYER_NAMES[player];
  }

  function syncSeatHighlight() {
    seatLayout().forEach(function (seatData) {
      seatData.name.parentNode.classList.toggle("active-seat", state.currentPlayer === seatData.player);
    });
  }

  function suitClass(card) {
    if (card.isRook) {
      return "suit-rook";
    }
    return "suit-" + card.suit;
  }

  function cardFaceClass(card) {
    if (card.isRook) {
      return "face-rook";
    }
    return "face-" + card.suit;
  }

  function cloneHands(hands) {
    return hands.map(function (hand) {
      return hand.slice();
    });
  }

  function resetMatchSession() {
    state.matchPoints = [0, 0];
    state.individualMatchPoints = [0, 0, 0, 0, 0];
    state.callPartnerStandingOrder = null;
    state.previousCallPartnerStandingOrder = null;
    state.roundHistory = [];
    state.roundNumber = 1;
    state.dealer = 0;
    state.gameOver = false;
    state.summaryMatchGif = null;
  }

  function scoreProgressWidth(score) {
    var matchTarget = getRuleConfig().matchTarget;
    var clamped = Math.max(0, Math.min(matchTarget, score));
    return (clamped / matchTarget) * 100 + "%";
  }

  function schedule(fn, delay) {
    clearPendingTimeout();
    state.timeoutId = window.setTimeout(function () {
      state.timeoutId = null;
      fn();
    }, delay);
  }

  function clearPendingTimeout() {
    if (state.timeoutId !== null) {
      window.clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
    clearWinnerReveal();
  }

  function clearWinnerReveal() {
    if (state.winnerRevealId !== null) {
      window.clearTimeout(state.winnerRevealId);
      state.winnerRevealId = null;
    }
  }

  function playerLabel(player, includeTeammate) {
    if (player === 0) {
      return "You";
    }
    if (includeTeammate && (!isCallPartnerRuleset() || state.callPartnerRevealed) && teamForPlayer(player) === teamForPlayer(0)) {
      return PLAYER_NAMES[player] + " (Teammate)";
    }
    return PLAYER_NAMES[player];
  }

  function collectScoringItems(trickCards, isLastTrick) {
    var items = [];

    trickCards.forEach(function (play) {
      if (cardPoints(play.card) > 0) {
        items.push({
          label: fullCardLabel(play.card, state.trump),
          points: cardPoints(play.card),
          suit: effectiveSuit(play.card, state.trump)
        });
      }
    });

    if (isLastTrick) {
      state.buriedKitty.forEach(function (card) {
        if (cardPoints(card) > 0) {
          items.push({
            label: "Kitty " + fullCardLabel(card, state.trump),
            points: cardPoints(card),
            suit: effectiveSuit(card, state.trump)
          });
        }
      });
      if (getRuleConfig().lastTrickBonus > 0) {
        items.push({
          label: "Last Trick",
          points: getRuleConfig().lastTrickBonus
        });
      }
    }

    return items;
  }

  function summaryPointText(points) {
    return points > 0 ? "+" + points + " points" : "no points";
  }

  function trickWinMessage(winner, pointsWon) {
    var subject = winner === 0 ? "You" : PLAYER_NAMES[winner];
    return subject + " win" + (winner === 0 ? "" : "s") + " the trick (" + summaryPointText(pointsWon) + ").";
  }

  function playerLeadMessage(player) {
    return player === 0 ? "You lead the first trick." : PLAYER_NAMES[player] + " leads the first trick.";
  }

  function openingPlayMessage() {
    var leader = openingLeader();

    if (isCallPartnerRuleset() && state.askPartnerToLead && state.callPartnerPlayer !== null) {
      return PLAYER_NAMES[state.bidder] + " asked " + PLAYER_NAMES[state.callPartnerPlayer] + " to lead.";
    }
    if (state.bidder === 0) {
      return playerLeadMessage(leader);
    }
    return PLAYER_NAMES[state.bidder] + " chose " + SUIT_LABEL[state.trump] + " as the Power suit. " + playerLeadMessage(leader);
  }

  function createPlayedCardNode(cardData, isWinner) {
    var card = document.createElement("div");
    var rank;
    var suit;

    card.className = "played-card" +
      (isWinner ? " winner" : "") +
      (cardData.isRook ? " rook-card" : "") +
      " " + cardFaceClass(cardData);
    if (cardData.isRook && state.phase === "play" && state.trump) {
      card.className += " show-rook-trump rook-trump-" + state.trump;
    }
    if (shouldShowRedOneTrumpDot(cardData)) {
      card.className += " show-red-one-trump rook-trump-" + state.trump;
    }
    rank = document.createElement("div");
    suit = document.createElement("div");
    rank.className = "played-rank";
    rank.textContent = cardLabel(cardData);
    suit.className = "played-suit " + suitClass(cardData);
    card.appendChild(rank);
    card.appendChild(suit);
    return card;
  }

  function finalizeBidderHand() {
    state.buriedKitty = combinedBidderCards().filter(function (card) {
      return state.selectedDiscards.indexOf(card.id) !== -1;
    });
    state.kittyReviewHand = combinedBidderCards().filter(function (card) {
      return state.selectedDiscards.indexOf(card.id) === -1;
    });
    sortHand(state.buriedKitty, state.selectedTrump || state.trump);
    sortHand(state.kittyReviewHand, state.selectedTrump || state.trump);
    markMatchDirty();
  }

  function buildScoringTeamGroup(teamName, players, grouped) {
    var wrapper = document.createElement("div");
    var heading = document.createElement("div");

    wrapper.className = "scoring-team-group";
    heading.className = "scoring-team-heading";
    heading.textContent = teamName;
    wrapper.appendChild(heading);

    players.forEach(function (player) {
      wrapper.appendChild(createScoringPlayerCard(player, grouped[player]));
    });

    ui.summaryScoringGrid.appendChild(wrapper);
  }

  function createScoringPlayerCard(player, itemsData) {
    var card = document.createElement("div");
    var header = document.createElement("div");
    var title = document.createElement("strong");
    var total = document.createElement("span");
    var items = document.createElement("div");
    var playerTotal = itemsData.reduce(function (sum, item) {
      return sum + item.points;
    }, 0);

    card.className = "scoring-player-card";
    header.className = "scoring-player-header";
    items.className = "scoring-items";
    title.textContent = playerLabel(player, true);
    total.textContent = playerTotal + " points";
    header.appendChild(title);
    header.appendChild(total);
    card.appendChild(header);

    if (!itemsData.length) {
      var empty = document.createElement("p");
      empty.className = "scoring-empty";
      empty.textContent = "No scoring cards";
      card.appendChild(empty);
      return card;
    }

    itemsData.forEach(function (item) {
      var token = document.createElement("span");
      token.className = "scoring-item" + (item.suit ? " suit-token suit-token-" + item.suit : "");
      token.textContent = item.label;
      items.appendChild(token);
    });
    card.appendChild(items);
    return card;
  }

  function runDealAnimation() {
    if (state.phase !== "bidding" || !state.dealAnimating) {
      return;
    }

    if (state.dealVisibleCount < 1) {
      state.dealVisibleCount = 1;
      render();
    }

    if (state.dealVisibleCount < DEAL_STICKER_COUNT) {
      schedule(function () {
        state.dealVisibleCount = Math.min(DEAL_STICKER_COUNT, state.dealVisibleCount + 1);
        render();
        runDealAnimation();
      }, DEAL_ANIMATION_STEP);
      return;
    }

    schedule(function () {
      state.dealAnimating = false;
      state.dealSeatCounts = activeAiSeatsForState().map(function (player) {
        return state.initialHands[player].length;
      });
      state.dealRevealed = true;
      state.dealRevealAnimating = true;
      render();
      window.setTimeout(function () {
        state.dealRevealAnimating = false;
        render();
      }, 260);
    }, DEAL_ANIMATION_STEP + DEAL_COMPLETE_HOLD_DELAY);
  }

  function triggerCardLockout(cardNode) {
    cardNode.classList.remove("card-lockout");
    cardNode.offsetWidth;
    cardNode.classList.add("card-lockout");
    window.setTimeout(function () {
      cardNode.classList.remove("card-lockout");
    }, 160);
  }

  function biddingStrengthHint(cards) {
    var profile = handStrengthProfile(cards || []);
    return profile.label;
  }

  function handStrengthProfile(cards) {
    var rawStrength = estimateHandStrength(cards);
    var scoringCount = 0;
    var suitCounts = { red: 0, green: 0, yellow: 0, orange: 0 };
    var bestSuit = 0;

    cards.forEach(function (card) {
      if (cardPoints(card) > 0) {
        scoringCount += 1;
      }
      if (card.isRook) {
        bestSuit = Math.max(bestSuit, 2);
        return;
      }
      suitCounts[card.suit] += 1;
      bestSuit = Math.max(bestSuit, suitCounts[card.suit]);
    });

    rawStrength += scoringCount * 4;
    rawStrength += bestSuit >= 5 ? 10 : 0;
    rawStrength += bestSuit >= 6 ? 8 : 0;

    if (rawStrength >= 120) {
      return { label: "Strong hand" };
    }
    if (rawStrength >= 92) {
      return { label: "Medium hand" };
    }
    return { label: "Weak hand" };
  }

  function migrateLegacyBlackSuit(value) {
    if (Array.isArray(value)) {
      return value.map(migrateLegacyBlackSuit);
    }
    if (value && typeof value === "object") {
      var next = {};
      Object.keys(value).forEach(function (key) {
        next[key] = migrateLegacyBlackSuit(value[key]);
      });
      return next;
    }
    if (typeof value === "string") {
      return value
        .replace(/\bBlack\b/g, "Orange")
        .replace(/\bblack\b/g, "orange");
    }
    if (value === "black") {
      return "orange";
    }
    return value;
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
      return;
    }

    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {
        return null;
      });
    });
  }

  initMatchPersistence();
  loadProfile();
  refreshSavedMatchMeta();
  cacheDom();
  syncAppFooter();
  bindEvents();
  render();
  registerServiceWorker();
}());
