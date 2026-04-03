(function () {
  var SUITS = ["red", "green", "yellow", "orange"];
  var SUIT_LABEL = {
    red: "Red",
    green: "Green",
    yellow: "Yellow",
    orange: "Orange"
  };
  var PLAYER_NAMES = ["You", "Bea", "Mae", "Cal"];
  var RULESETS = {
    kentuckyHouse: {
      id: "kentuckyHouse",
      label: "Kentucky House Rules",
      minBid: 100,
      maxBid: 200,
      bidStep: 5,
      matchTarget: 500,
      lastTrickBonus: 20,
      scoring: {
        rook: 20,
        rank1: 15,
        rank14: 10,
        rank10: 10,
        rank5: 5
      }
    }
  };
  var DEFAULT_RULESET_ID = "kentuckyHouse";
  var PLAYERS = [0, 1, 2, 3];
  var BID_DELAY = 1200;
  var AI_DELAY = 700;
  var TRICK_DELAY = 1200;
  var TRICK_WINNER_REVEAL_DELAY = 140;
  var SUMMARY_DELAY = 900;
  var CLOSE_WIN_MARGIN = 50;
  var SUMMARY_CLOSE_CALL_MARGIN = 10;
  var STICKER_COOLDOWN = 260;
  var BIG_TRICK_THRESHOLD = 30;
  var MATCH_SUMMARY_GIF_CONFIG = {
    win: [
      "img/gifs/bg-gif-winning-liz.gif",
      "img/gifs/bg-gif-winning.gif"
    ],
    loss: [
      "img/gifs/bg-gif-losing-homer.gif",
      "img/gifs/bg-gif-losing-ohno.gif"
    ]
  };
  var STICKER_CONFIG = {
    rook: {
      assets: [
        "img/stickers/rook-caw.png"
      ],
      size: "large",
      intensity: "strong",
      duration: 780,
      impact: "strong"
    },
    big_trick: {
      assets: [
        "img/stickers/big-trick-cool.png",
        "img/stickers/big-trick-dance.png",
        "img/stickers/big-trick-parrot.png",
        "img/stickers/big-trick-pop-tart.png"
      ],
      size: "medium",
      intensity: "medium",
      duration: 680
    },
    bid_set: {
      assets: [
        "img/stickers/bid-set-britney.png",
        "img/stickers/bid-set-pain.png",
        "img/stickers/bid-set-suffering.png",
        "img/stickers/bid-set-tears.png"
      ],
      size: "large",
      intensity: "strong",
      duration: 840
    },
    bid_made: {
      assets: [
        "img/stickers/bid-made-bday-dog.png",
        "img/stickers/bid-made-doge.png",
        "img/stickers/bid-made-my-day.png",
        "img/stickers/bid-made-shaq.png"
      ],
      size: "medium",
      intensity: "medium",
      duration: 760
    },
    game_win: {
      assets: [
        "img/stickers/game-win-fire.png",
        "img/stickers/game-win-jonah.png",
        "img/stickers/game-win-yaas.png"
      ],
      size: "xlarge",
      intensity: "strong",
      duration: 1040
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
  var ACHIEVEMENT_DEFS = [
    {
      id: "first_match_win",
      title: "First Feather",
      description: "Win your first completed match.",
      stickerPool: STICKER_CONFIG.game_win.assets
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
      stickerPool: STICKER_CONFIG.bid_made.assets
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
      stickerPool: STICKER_CONFIG.game_win.assets
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
    }
  ];
  var MINI_STICKER_DEFS = {
    first_match_win: {
      label: "First win",
      assetPool: STICKER_CONFIG.game_win.assets
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
      assetPool: STICKER_CONFIG.bid_made.assets
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
  var COLLECTOR_SHEET_SLOT_COUNT = 12;
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
    }
  };
  var AI_STYLE_BY_PLAYER = [null, "steady", "bold", "disruptor"];
  var STORAGE_SCHEMA_VERSION = 1;
  var PROFILE_STORAGE_KEY = "kentucky-rook.profile";
  var ACTIVE_MATCH_STORAGE_KEY = "kentucky-rook.active-match";
  var PERSISTED_STATE_KEYS = [
    "phase",
    "rulesetId",
    "dealer",
    "roundNumber",
    "bidder",
    "winningBid",
    "trump",
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
    "hands",
    "trick",
    "leadSuit",
    "currentPlayer",
    "winningCardPlayer",
    "playerPoints",
    "roundPoints",
    "matchPoints",
    "trickCounts",
    "roundMessage",
    "summary",
    "summaryStep",
    "summaryMatchGif",
    "summaryScoringOpen",
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

  function createState() {
    return {
      phase: "welcome",
      rulesetId: DEFAULT_RULESET_ID,
      dealer: 0,
      roundNumber: 1,
      bidder: null,
      winningBid: null,
      trump: null,
      selectedTrump: null,
      selectedBid: RULESETS[DEFAULT_RULESET_ID].minBid,
      currentBid: null,
      currentBidHolder: null,
      currentBidTurn: 0,
      bidEntries: [],
      bidStatuses: ["-", "-", "-", "-"],
      passed: [false, false, false, false],
      initialHands: [[], [], [], []],
      kitty: [],
      buriedKitty: [],
      kittyReviewHand: [],
      selectedDiscards: [],
      hands: [[], [], [], []],
      trick: [],
      leadSuit: null,
      currentPlayer: 0,
      winningCardPlayer: null,
      playerPoints: [0, 0, 0, 0],
      roundPoints: [0, 0],
      matchPoints: [0, 0],
      trickCounts: [0, 0],
      roundMessage: "",
      summary: null,
      summaryStep: 1,
      summaryMatchGif: null,
      summaryScoringOpen: false,
      aiTrumpReady: false,
      aiTrumpMeterStarted: false,
      dealAnimating: true,
      dealVisibleCount: 0,
      dealSeatCounts: [0, 0, 0],
      dealRevealed: false,
      dealRevealAnimating: false,
      biddingComplete: false,
      biddingStarted: false,
      menuOpen: false,
      menuView: "hub",
      historyOpen: false,
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
      busy: false,
      timeoutId: null,
      winnerRevealId: null,
      stickerCleanupId: null,
      stickerActive: false,
      stickerLastShownAt: 0
    };
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
        opponentSetRounds: 0
      },
      streaks: {
        currentMatchWinStreak: 0,
        bestMatchWinStreak: 0
      },
      achievements: {
        unlocked: {}
      },
      miniStickers: [],
      rulesets: {},
      playerRecords: {},
      lastMatch: null
    };
  }

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function safeStorageRemove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function parseStoredJson(key) {
    var raw = safeStorageGet(key);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      safeStorageRemove(key);
      return null;
    }
  }

  function normalizeProfile(raw) {
    var nextProfile = createProfile();
    var totals = raw && raw.totals ? raw.totals : {};
    var human = raw && raw.human ? raw.human : {};
    var performance = raw && raw.performance ? raw.performance : {};
    var opponents = raw && raw.opponents ? raw.opponents : {};
    var streaks = raw && raw.streaks ? raw.streaks : {};

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
    nextProfile.streaks.currentMatchWinStreak = Number(streaks.currentMatchWinStreak) || 0;
    nextProfile.streaks.bestMatchWinStreak = Number(streaks.bestMatchWinStreak) || 0;
    nextProfile.achievements = normalizeAchievementProgress(raw && raw.achievements);
    nextProfile.miniStickers = normalizeMiniStickers(raw && raw.miniStickers);
    nextProfile.rulesets = normalizeRulesetRecords(raw && raw.rulesets);
    nextProfile.playerRecords = normalizePlayerRecords(raw && raw.playerRecords);
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
        tilt: typeof item.tilt === "number" ? item.tilt : 0
      };
    });

    return next;
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

  function loadProfile() {
    var beforeCount;

    profile = normalizeProfile(parseStoredJson(PROFILE_STORAGE_KEY));
    beforeCount = unlockedAchievementCount();
    evaluateAchievements();
    if (unlockedAchievementCount() !== beforeCount) {
      saveProfile();
    }
  }

  function saveProfile() {
    profile.version = STORAGE_SCHEMA_VERSION;
    safeStorageSet(PROFILE_STORAGE_KEY, JSON.stringify(profile));
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

  function unlockAchievement(id) {
    var def = achievementById(id);

    if (!def || isAchievementUnlocked(id)) {
      return false;
    }

    profile.achievements.unlocked[id] = {
      unlockedAt: new Date().toISOString(),
      stickerAsset: stickerAssetFromPool(def.stickerPool),
      tilt: randomStickerTilt()
    };
    return true;
  }

  function evaluateAchievements() {
    unlockAchievementIf("first_match_win", profile.totals.matchesWon >= 1);
    unlockAchievementIf("bid_caller", profile.human.bidsWon >= 5);
    unlockAchievementIf("contract_clutch", profile.human.bidsMade >= 3);
    unlockAchievementIf("set_em_up", profile.opponents.opponentSetRounds >= 3);
    unlockAchievementIf("big_round", profile.human.bestRoundPoints >= 100);
    unlockAchievementIf("perfect_200", profile.human.perfectBid200Made >= 1);
    unlockAchievementIf("close_shave", profile.performance.closeWins >= 1);
    unlockAchievementIf("comeback_kid", profile.performance.comebackWins >= 1);
  }

  function unlockAchievementIf(id, condition) {
    if (condition) {
      unlockAchievement(id);
    }
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

    return {
      phaseLabel: savedPhaseLabel(savedState),
      roundLabel: savedRoundLabel(savedState),
      scoreLabel: "Us " + savedState.matchPoints[0] + " • Them " + savedState.matchPoints[1],
      detail: savedMatchDetail(savedState)
    };
  }

  function savedPhaseLabel(savedState) {
    if (savedState.phase === "bidding") {
      return savedState.biddingComplete ? "Bid Locked In" : "Bidding";
    }
    if (savedState.phase === "trump") {
      return "Trump Setup";
    }
    if (savedState.phase === "play") {
      return "In Play";
    }
    if (savedState.phase === "summary") {
      return savedState.gameOver ? "Final Score Saved" : "Round Summary";
    }
    return "Saved Match";
  }

  function savedRoundLabel(savedState) {
    if (savedState.phase === "summary") {
      return "Round " + Math.max(1, savedState.roundNumber - 1);
    }
    return "Round " + savedState.roundNumber;
  }

  function savedMatchDetail(savedState) {
    if (savedState.phase === "play") {
      return PLAYER_NAMES[savedState.currentPlayer] + " to play.";
    }
    if (savedState.phase === "trump") {
      return PLAYER_NAMES[savedState.bidder] + " won " + savedState.winningBid + ".";
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

    return snapshot;
  }

  function saveActiveMatch() {
    var payload;

    if (state.phase === "welcome") {
      return;
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
    }
  }

  function clearActiveMatch() {
    safeStorageRemove(ACTIVE_MATCH_STORAGE_KEY);
    savedMatchMeta = null;
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
    nextState.historyOpen = false;
    nextState.busy = false;
    nextState.timeoutId = null;
    nextState.winnerRevealId = null;
    nextState.stickerCleanupId = null;
    nextState.stickerActive = false;
    nextState.stickerLastShownAt = 0;
    nextState.aiTrumpMeterStarted = false;
    nextState.dealAnimating = false;
    nextState.dealVisibleCount = 13;
    nextState.dealSeatCounts = [13, 13, 13];
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

    assignState(nextState);
  }

  function continueSavedMatch() {
    var payload = loadSavedMatchPayload();

    if (!payload) {
      refreshSavedMatchMeta();
      render();
      return;
    }

    clearPendingTimeout();
    clearSticker();
    hydrateStateFromSnapshot(payload.state);
    state.menuOpen = false;
    state.menuView = "hub";
    updateProfileTimestamp();
    saveProfile();
    render();

    if (state.phase === "bidding" && state.biddingStarted && !state.biddingComplete && state.currentBidTurn !== 0) {
      continueBidding();
    } else if (state.phase === "play") {
      maybeRunAiTurn();
    }
  }

  function beginNewMatch() {
    var nextState = createState();

    clearPendingTimeout();
    clearSticker();
    clearActiveMatch();
    nextState.matchId = createMatchId();
    nextState.matchStartedAt = new Date().toISOString();
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
      if (bidMade) {
        profile.human.bidsMade += 1;
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
    var rulesetRecord;
    var won;

    if (!state.gameOver || state.profileMatchCompleteRecorded) {
      return;
    }

    won = state.matchPoints[0] > state.matchPoints[1];
    margin = Math.abs(state.matchPoints[0] - state.matchPoints[1]);
    updateProfileTimestamp();
    profile.totals.matchesCompleted += 1;
    profile.performance.bestMatchScore = Math.max(profile.performance.bestMatchScore, state.matchPoints[0]);
    if (won) {
      profile.totals.matchesWon += 1;
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
    return RULESETS[state.rulesetId] || RULESETS[DEFAULT_RULESET_ID];
  }

  function scoringTotalPoints() {
    var scoring = getRuleConfig().scoring;
    return (scoring.rank1 * 4) + scoring.rank14 * 4 + scoring.rank10 * 4 + scoring.rank5 * 4 + scoring.rook;
  }

  function cacheDom() {
    ui.phaseWelcome = document.getElementById("phaseWelcome");
    ui.phaseBidding = document.getElementById("phaseBidding");
    ui.phaseTrump = document.getElementById("phaseTrump");
    ui.phasePlay = document.getElementById("phasePlay");
    ui.phaseSummary = document.getElementById("phaseSummary");
    ui.summaryPanel = ui.phaseSummary ? ui.phaseSummary.querySelector(".panel-card") : null;
    ui.menuToggle = document.getElementById("menuToggle");
    ui.menuSheet = document.getElementById("menuSheet");
    ui.menuClose = document.getElementById("menuClose");
    ui.menuBackdrop = document.getElementById("menuBackdrop");
    ui.menuTitle = document.getElementById("menuTitle");
    ui.menuContext = document.getElementById("menuContext");
    ui.menuHubView = document.getElementById("menuHubView");
    ui.menuProfileView = document.getElementById("menuProfileView");
    ui.menuProfileBack = document.getElementById("menuProfileBack");
    ui.menuActionStatus = document.getElementById("menuActionStatus");
    ui.menuPrimaryAction = document.getElementById("menuPrimaryAction");
    ui.menuSecondaryAction = document.getElementById("menuSecondaryAction");
    ui.menuViewProfile = document.getElementById("menuViewProfile");
    ui.menuProfileStatus = document.getElementById("menuProfileStatus");
    ui.menuProfileMatches = document.getElementById("menuProfileMatches");
    ui.menuProfileRecord = document.getElementById("menuProfileRecord");
    ui.menuProfileBidRate = document.getElementById("menuProfileBidRate");
    ui.menuProfileBestRound = document.getElementById("menuProfileBestRound");
    ui.menuProfileDetail = document.getElementById("menuProfileDetail");
    ui.menuProgressStatus = document.getElementById("menuProgressStatus");
    ui.menuProgressRounds = document.getElementById("menuProgressRounds");
    ui.menuProgressBidsMade = document.getElementById("menuProgressBidsMade");
    ui.menuProgressBidsWon = document.getElementById("menuProgressBidsWon");
    ui.menuProgressStreak = document.getElementById("menuProgressStreak");
    ui.menuRulesetName = document.getElementById("menuRulesetName");
    ui.menuRulesDetail = document.getElementById("menuRulesDetail");
    ui.menuHelpDetail = document.getElementById("menuHelpDetail");
    ui.menuFullProfileStatus = document.getElementById("menuFullProfileStatus");
    ui.menuFullMatchesStarted = document.getElementById("menuFullMatchesStarted");
    ui.menuFullMatchesCompleted = document.getElementById("menuFullMatchesCompleted");
    ui.menuFullWins = document.getElementById("menuFullWins");
    ui.menuFullLosses = document.getElementById("menuFullLosses");
    ui.menuFullRounds = document.getElementById("menuFullRounds");
    ui.menuFullBestRound = document.getElementById("menuFullBestRound");
    ui.menuFullProfileDetail = document.getElementById("menuFullProfileDetail");
    ui.menuFullPerformanceStatus = document.getElementById("menuFullPerformanceStatus");
    ui.menuFullAvgRoundPoints = document.getElementById("menuFullAvgRoundPoints");
    ui.menuFullBestMatchScore = document.getElementById("menuFullBestMatchScore");
    ui.menuFullBiggestWinMargin = document.getElementById("menuFullBiggestWinMargin");
    ui.menuFullBiggestLossMargin = document.getElementById("menuFullBiggestLossMargin");
    ui.menuFullComebackWins = document.getElementById("menuFullComebackWins");
    ui.menuFullCloseWins = document.getElementById("menuFullCloseWins");
    ui.menuFullBidStatus = document.getElementById("menuFullBidStatus");
    ui.menuFullBidsWon = document.getElementById("menuFullBidsWon");
    ui.menuFullAvgWinningBid = document.getElementById("menuFullAvgWinningBid");
    ui.menuFullPerfect200 = document.getElementById("menuFullPerfect200");
    ui.menuFullOpponentSetRate = document.getElementById("menuFullOpponentSetRate");
    ui.menuFullOpponentSetRaw = document.getElementById("menuFullOpponentSetRaw");
    ui.menuFullBidAttempts = document.getElementById("menuFullBidAttempts");
    ui.menuFullRulesetStatus = document.getElementById("menuFullRulesetStatus");
    ui.menuRulesetRecords = document.getElementById("menuRulesetRecords");
    ui.menuFullPlayerStatus = document.getElementById("menuFullPlayerStatus");
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
    ui.handStrengthHint = document.getElementById("handStrengthHint");
    ui.dealSeats = document.getElementById("dealSeats");
    ui.dealFillMae = document.getElementById("dealFillMae");
    ui.dealFillBea = document.getElementById("dealFillBea");
    ui.dealFillCal = document.getElementById("dealFillCal");
    ui.dealPile = document.getElementById("dealPile");
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
    ui.discardStatus = document.getElementById("discardStatus");
    ui.confirmTrump = document.getElementById("confirmTrump");
    ui.trumpKittyBlock = document.getElementById("trumpKittyBlock");
    ui.trumpReferenceBlock = document.getElementById("trumpReferenceBlock");
    ui.trumpReferenceHand = document.getElementById("trumpReferenceHand");
    ui.trumpHand = document.getElementById("trumpHand");
    ui.trumpButtons = Array.prototype.slice.call(document.querySelectorAll(".trump-button"));
    ui.playTrump = document.getElementById("playTrump");
    ui.playContract = document.getElementById("playContract");
    ui.playMessage = document.getElementById("playMessage");
    ui.handHint = document.getElementById("handHint");
    ui.playerHand = document.getElementById("playerHand");
    ui.stickerOverlay = document.getElementById("stickerOverlay");
    ui.tableArea = document.querySelector(".table-area");
    ui.seatTopCount = document.getElementById("seatTopCount");
    ui.seatLeftCount = document.getElementById("seatLeftCount");
    ui.seatRightCount = document.getElementById("seatRightCount");
    ui.seatBottomCount = document.getElementById("seatBottomCount");
    ui.seatTopName = document.getElementById("seatTopName");
    ui.seatLeftName = document.getElementById("seatLeftName");
    ui.seatRightName = document.getElementById("seatRightName");
    ui.seatBottomName = document.getElementById("seatBottomName");
    ui.slotTop = document.getElementById("slotTop");
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
    ui.summaryUs = document.getElementById("summaryUs");
    ui.summaryThem = document.getElementById("summaryThem");
    ui.summaryBid = document.getElementById("summaryBid");
    ui.summaryResult = document.getElementById("summaryResult");
    ui.summaryDetail = document.getElementById("summaryDetail");
    ui.summaryNav = document.getElementById("summaryNav");
    ui.toggleScoring = document.getElementById("toggleScoring");
    ui.summaryScoring = document.getElementById("summaryScoring");
    ui.summaryScoringGrid = document.getElementById("summaryScoringGrid");
    ui.summaryHistory = document.getElementById("summaryHistory");
    ui.summaryHistoryNav = document.getElementById("summaryHistoryNav");
    ui.summaryMatchUs = document.getElementById("summaryMatchUs");
    ui.summaryMatchThem = document.getElementById("summaryMatchThem");
    ui.summaryMatchNote = document.getElementById("summaryMatchNote");
    ui.summaryMatchTarget = document.getElementById("summaryMatchTarget");
    ui.summaryProfileCard = document.getElementById("summaryProfileCard");
    ui.summaryProfileStatus = document.getElementById("summaryProfileStatus");
    ui.summaryProfileRecord = document.getElementById("summaryProfileRecord");
    ui.summaryProfileBidRate = document.getElementById("summaryProfileBidRate");
    ui.summaryProfileBestRound = document.getElementById("summaryProfileBestRound");
    ui.summaryProfileStreak = document.getElementById("summaryProfileStreak");
    ui.summaryProfileDetail = document.getElementById("summaryProfileDetail");
    ui.summaryTableBody = document.getElementById("summaryTableBody");
    ui.nextRound = document.getElementById("nextRound");
    ui.backToRoundSummary = document.getElementById("backToRoundSummary");
    ui.historyToggle = document.getElementById("historyToggle");
    ui.historyDrawer = document.getElementById("historyDrawer");
    ui.historyClose = document.getElementById("historyClose");
    ui.historyBackdrop = document.getElementById("historyBackdrop");
    ui.historyContent = document.getElementById("historyContent");
  }

  function bindEvents() {
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

    ui.menuPrimaryAction.addEventListener("click", function () {
      handleMenuAction(ui.menuPrimaryAction.getAttribute("data-action"));
    });

    ui.menuSecondaryAction.addEventListener("click", function () {
      handleMenuAction(ui.menuSecondaryAction.getAttribute("data-action"));
    });

    ui.menuViewProfile.addEventListener("click", function () {
      state.menuView = "profile";
      renderMenuSheet();
    });

    ui.menuProfileBack.addEventListener("click", function () {
      state.menuView = "hub";
      renderMenuSheet();
    });

    ui.showAchievementBook.addEventListener("click", function () {
      state.stickerBookPage = "achievements";
      renderStickerBook();
    });

    ui.showCollectorSheet.addEventListener("click", function () {
      state.stickerBookPage = "collector";
      renderStickerBook();
    });

    ui.startNewGame.addEventListener("click", function () {
      if (state.phase !== "welcome") {
        return;
      }
      beginNewMatch();
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
      render();
    });

    ui.increaseBid.addEventListener("click", function () {
      if (state.phase !== "bidding" || state.busy || state.biddingComplete) {
        return;
      }
      state.selectedBid = Math.min(getRuleConfig().maxBid, state.selectedBid + getRuleConfig().bidStep);
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
        renderTrumpPhase();
      });
    });

    ui.confirmTrump.addEventListener("click", function () {
      if (state.phase !== "trump" || !state.selectedTrump || state.busy) {
        return;
      }
      if (state.bidder === 0) {
        finalizeBidderHand();
      } else if (!state.aiTrumpReady) {
        return;
      }
      state.trump = state.selectedTrump;
      dealForPlay();
    });

    ui.aiTrumpContinue.addEventListener("click", function () {
      if (state.phase !== "trump" || state.bidder === 0 || !state.aiTrumpReady || state.busy) {
        return;
      }
      state.trump = state.selectedTrump;
      dealForPlay();
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
        beginNewMatch();
        return;
      }
      startRound();
    });

    ui.backToRoundSummary.addEventListener("click", function () {
      if (state.phase !== "summary" || state.summaryStep !== 2) {
        return;
      }
      state.summaryStep = 1;
      render();
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

  function handleMenuAction(action) {
    if (action === "view_profile") {
      state.menuView = "profile";
      renderMenuSheet();
      return;
    }
    if (action === "back_to_hub") {
      state.menuView = "hub";
      renderMenuSheet();
      return;
    }
    if (action === "continue_saved") {
      closeMenuSheet();
      continueSavedMatch();
      return;
    }
    if (action === "start_new") {
      closeMenuSheet();
      beginNewMatch();
      return;
    }
    closeMenuSheet();
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
      return "Fresh profile";
    }
    return Math.round((profile.totals.matchesWon / matches) * 100) + "% match win rate";
  }

  function menuContextText() {
    return "";
  }

  function renderFullProfileView() {
    var bidAttempts = profileBidAttemptCount();
    var avgRoundPoints = profile.totals.roundsCompleted
      ? formatAverage(profile.totals.usPointsEarned / profile.totals.roundsCompleted)
      : 0;
    var avgWinningBid = profile.human.winningBidCount
      ? formatAverage(profile.human.winningBidTotal / profile.human.winningBidCount)
      : 0;
    var unlockedCount = unlockedAchievementCount();

    ui.menuFullProfileStatus.textContent = profileWinRateText();
    ui.menuFullMatchesStarted.textContent = String(profile.totals.matchesStarted);
    ui.menuFullMatchesCompleted.textContent = String(profile.totals.matchesCompleted);
    ui.menuFullWins.textContent = String(profile.totals.matchesWon);
    ui.menuFullLosses.textContent = String(profile.totals.matchesLost);
    ui.menuFullRounds.textContent = String(profile.totals.roundsCompleted);
    ui.menuFullBestRound.textContent = String(profile.human.bestRoundPoints);
    ui.menuFullProfileDetail.textContent = profile.lastMatch
      ? "Last recorded match finished " + (profile.lastMatch.won ? "with a win" : "with a loss") +
        " at Us " + profile.lastMatch.usScore + " / Them " + profile.lastMatch.themScore + "."
      : "No completed match yet. As you play, this screen will build a long-term picture of your style and results.";
    ui.menuFullPerformanceStatus.textContent = avgRoundPoints + " avg";
    ui.menuFullAvgRoundPoints.textContent = String(avgRoundPoints);
    ui.menuFullBestMatchScore.textContent = String(profile.performance.bestMatchScore);
    ui.menuFullBiggestWinMargin.textContent = String(profile.performance.biggestWinMargin);
    ui.menuFullBiggestLossMargin.textContent = String(profile.performance.biggestLossMargin);
    ui.menuFullComebackWins.textContent = String(profile.performance.comebackWins);
    ui.menuFullCloseWins.textContent = String(profile.performance.closeWins);
    ui.menuFullBidStatus.textContent = profileBidRateText();
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
    ui.menuFullProgressStatus.textContent = "Tracking " + getRuleConfig().label;
    ui.menuFullUsPoints.textContent = String(profile.totals.usPointsEarned);
    ui.menuFullThemPoints.textContent = String(profile.totals.themPointsEarned);
    ui.menuFullCurrentStreak.textContent = String(profile.streaks.currentMatchWinStreak);
    ui.menuFullBestStreak.textContent = String(profile.streaks.bestMatchWinStreak);
    ui.menuStickerBookStatus.textContent = unlockedCount + " of " + totalAchievementCount() + " unlocked";
    renderRulesetRecords();
    renderPlayerRecords();
    renderStickerBook();
  }

  function renderRulesetRecords() {
    var rulesetIds = Object.keys(RULESETS);

    ui.menuFullRulesetStatus.textContent = getRuleConfig().label;
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
        record.matchesCompleted + " matches";
      row.appendChild(title);
      row.appendChild(detail);
      ui.menuRulesetRecords.appendChild(row);
    });
  }

  function renderPlayerRecords() {
    ui.menuFullPlayerStatus.textContent = "Across completed matches";
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
    ui.menuStickerAchievements.innerHTML = "";

    ACHIEVEMENT_DEFS.forEach(function (def) {
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
    var stickers = profile.miniStickers.slice(-COLLECTOR_SHEET_SLOT_COUNT);
    var slotCount = Math.max(COLLECTOR_SHEET_SLOT_COUNT, stickers.length);
    var index;

    ui.menuStickerCollector.innerHTML = "";
    ui.menuStickerCollector.classList.add("collector-sheet");

    for (index = 0; index < slotCount; index += 1) {
      var slot = document.createElement("div");
      var item = stickers[index];
      var helper;
      var image;

      slot.className = "collector-slot" + (item ? " is-filled" : "");
      if (item) {
        image = document.createElement("img");
        image.className = "collector-sticker";
        image.src = item.asset || stickerAssetFromPool((MINI_STICKER_DEFS[item.id] || {}).assetPool);
        image.alt = "";
        image.decoding = "async";
        image.setAttribute("aria-hidden", "true");
        image.style.transform = "rotate(" + (item.tilt || 0) + "deg)";
        slot.appendChild(image);
      } else {
        helper = document.createElement("span");
        helper.textContent = "Open spot";
        slot.appendChild(helper);
      }
      ui.menuStickerCollector.appendChild(slot);
    }
  }

  function renderMenuSheet() {
    var primaryAction = "close";
    var secondaryAction = "close";
    var primaryLabel = "Close Menu";
    var secondaryLabel = "Back";
    var bidAttempts = profileBidAttemptCount();
    var rules = getRuleConfig();

    ui.menuToggle.setAttribute("aria-expanded", state.menuOpen ? "true" : "false");
    ui.menuSheet.classList.toggle("open", state.menuOpen);
    ui.menuSheet.setAttribute("aria-hidden", state.menuOpen ? "false" : "true");
    ui.menuBackdrop.classList.toggle("hidden", !state.menuOpen);

    ui.menuHubView.classList.toggle("hidden", state.menuView !== "hub");
    ui.menuProfileView.classList.toggle("hidden", state.menuView !== "profile");
    ui.menuTitle.textContent = state.menuView === "profile"
      ? "Player Profile"
      : "Menu";
    ui.menuContext.textContent = menuContextText();
    ui.menuContext.classList.toggle("hidden", !ui.menuContext.textContent);

    if (state.menuView === "profile") {
      primaryAction = "back_to_hub";
      secondaryAction = "close";
      primaryLabel = "Back to Menu";
      secondaryLabel = "Close Menu";
      ui.menuActionStatus.textContent = "Full profile";
    } else if (state.phase === "welcome" && savedMatchMeta) {
      primaryAction = "continue_saved";
      secondaryAction = "start_new";
      primaryLabel = "Continue Match";
      secondaryLabel = "Start New Match";
      ui.menuActionStatus.textContent = savedMatchMeta.phaseLabel;
    } else if (state.phase === "welcome") {
      primaryAction = "start_new";
      primaryLabel = "Start New Match";
      secondaryLabel = "Close Menu";
      ui.menuActionStatus.textContent = "No active match";
    } else if (state.phase === "summary" && state.gameOver) {
      primaryAction = "start_new";
      primaryLabel = "Start New Match";
      secondaryLabel = "Close Menu";
      ui.menuActionStatus.textContent = "Match complete";
    } else {
      primaryAction = "close";
      primaryLabel = "Back to Match";
      secondaryLabel = "Close Menu";
      ui.menuActionStatus.textContent = state.phase === "play" ? "Match in progress" : "Quick access";
    }

    ui.menuPrimaryAction.textContent = primaryLabel;
    ui.menuPrimaryAction.setAttribute("data-action", primaryAction);
    ui.menuSecondaryAction.textContent = secondaryLabel;
    ui.menuSecondaryAction.setAttribute("data-action", secondaryAction);

    ui.menuProfileStatus.textContent = profileWinRateText();
    ui.menuProfileMatches.textContent = String(profile.totals.matchesCompleted);
    ui.menuProfileRecord.textContent = profile.totals.matchesWon + "-" + profile.totals.matchesLost;
    ui.menuProfileBidRate.textContent = profileBidRateText();
    ui.menuProfileBestRound.textContent = String(profile.human.bestRoundPoints);

    ui.menuProgressStatus.textContent = bidAttempts
      ? "Bid success " + profileBidRateText()
      : "Just getting started";
    ui.menuProgressRounds.textContent = String(profile.totals.roundsCompleted);
    ui.menuProgressBidsMade.textContent = String(profile.human.bidsMade);
    ui.menuProgressBidsWon.textContent = String(profile.human.bidsWon);
    ui.menuProgressStreak.textContent = String(profile.streaks.currentMatchWinStreak);

    ui.menuRulesetName.textContent = rules.label;
    ui.menuRulesDetail.textContent =
      "Current ruleset uses bids from " + rules.minBid + " to " + rules.maxBid + " in steps of " +
      rules.bidStep + ", last trick bonus " + rules.lastTrickBonus + ", and first to " +
      rules.matchTarget + " wins.";
    renderFullProfileView();
  }

  function startRound() {
    clearPendingTimeout();

    if (state.gameOver) {
      resetMatchSession();
    }

    state.phase = "bidding";
    state.bidder = null;
    state.winningBid = null;
    state.trump = null;
    state.selectedTrump = null;
    state.selectedBid = getRuleConfig().minBid;
    state.currentBid = null;
    state.currentBidHolder = null;
    state.currentBidTurn = (state.dealer + 1) % 4;
    state.bidEntries = [];
    state.bidStatuses = ["-", "-", "-", "-"];
    state.passed = [false, false, false, false];
    state.buriedKitty = [];
    state.kittyReviewHand = [];
    state.selectedDiscards = [];
    state.hands = [[], [], [], []];
    state.trick = [];
    state.leadSuit = null;
    state.currentPlayer = 0;
    state.winningCardPlayer = null;
    state.playerPoints = [0, 0, 0, 0];
    state.roundPoints = [0, 0];
    state.trickCounts = [0, 0];
    state.roundMessage = "";
    state.summary = null;
    state.summaryStep = 1;
    state.summaryMatchGif = null;
    state.summaryScoringOpen = false;
    state.aiTrumpReady = false;
    state.aiTrumpMeterStarted = false;
    state.dealAnimating = true;
    state.dealVisibleCount = 0;
    state.dealSeatCounts = [0, 0, 0];
    state.dealRevealed = false;
    state.dealRevealAnimating = false;
    state.biddingComplete = false;
    state.biddingStarted = false;
    state.historyOpen = false;
    state.previousTrick = null;
    state.completedTricks = [];
    state.busy = false;
    clearSticker();

    dealInitialHands();
    state.hands = cloneHands(state.initialHands);
    syncSelectedBid();
    render();
    runDealAnimation();
  }

  function dealInitialHands() {
    var deck = buildDeck();
    shuffle(deck, Date.now() % 100000 + state.dealer * 17);
    state.initialHands = [[], [], [], []];

    PLAYERS.forEach(function (player) {
      state.initialHands[player] = deck.splice(0, 13);
      sortHand(state.initialHands[player], null);
    });

    state.kitty = deck.splice(0, 5);
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
    PLAYERS.forEach(function (player) {
      if (player !== state.currentBidHolder && !state.passed[player]) {
        active += 1;
      }
    });
    return active === 0;
  }

  function chooseAiBid(player) {
    var plan = evaluateBidPlan(player);
    var profile = getAiProfile(player);
    var floor = getMinimumBid();
    var match = getAiMatchState(player, profile);
    var teammateHolding = state.currentBidHolder !== null &&
      state.currentBidHolder !== player &&
      teamForPlayer(state.currentBidHolder) === teamForPlayer(player);
    var activeOpponents = countActiveOpponents(player);
    var target = plan.targetBid;
    var conservativeHand = plan.score < 84;
    var bid;
    var extraRoom;

    if (target < floor || floor > 175) {
      return null;
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
      var takeoverThreshold = activeOpponents === 0 ? 25 : 20;
      var teamEdge = target - state.currentBid;

      if (pressure > 0.8) {
        takeoverThreshold -= 5;
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
    var team = teamForPlayer(player);
    var active = 0;

    PLAYERS.forEach(function (otherPlayer) {
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
    return AI_PROFILES[AI_STYLE_BY_PLAYER[player] || "steady"];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function roundToBidStep(value) {
    return Math.round(value / getRuleConfig().bidStep) * getRuleConfig().bidStep;
  }

  function teammateForPlayer(player) {
    return (player + 2) % 4;
  }

  function getAiMatchState(player, profile) {
    var team = teamForPlayer(player);
    var opponentTeam = team === 0 ? 1 : 0;
    var ourScore = state.matchPoints[team];
    var theirScore = state.matchPoints[opponentTeam];
    var deficit = theirScore - ourScore;
    var ourDistanceToWin = Math.max(0, getRuleConfig().matchTarget - ourScore);
    var theirDistanceToWin = Math.max(0, getRuleConfig().matchTarget - theirScore);
    var trailingPressure = clamp(deficit / 150, 0, 1) * profile.riskBias;
    var closingPressure = clamp((ourScore - 430) / 70, 0, 1) * profile.safetyBias;
    var disruptionPressure = clamp((theirScore - 430) / 70, 0, 1) * profile.disruptionBias;
    var mustStopOpponents = clamp((95 - theirDistanceToWin) / 95, 0, 1) * profile.denialBias;
    var canClinchSoon = clamp((105 - ourDistanceToWin) / 105, 0, 1) * profile.contractLockBias;
    var leadMargin = ourScore - theirScore;
    var shouldReduceVariance = clamp(
      Math.max(canClinchSoon * 0.9, leadMargin > 0 ? leadMargin / 170 : 0) * profile.safetyBias,
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

  function getAiRoundState(player) {
    var team = teamForPlayer(player);
    var opponentTeam = team === 0 ? 1 : 0;
    var bidderTeam = state.bidder === null ? null : teamForPlayer(state.bidder);
    var hand = state.hands[player] || state.initialHands[player] || [];
    var remainingCards = hand ? hand.length : 13;
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
    closerStrength = state.phase === "play" ? estimateCloserStrength(player, hand, state.trump) : 0;
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

  function evaluateCloserCandidate(card, player, hand, trump) {
    var suit = effectiveSuit(card, trump);
    var higherUnknown = countHigherUnknownCards(card, player, trump, hand);
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

  function estimateCloserStrength(player, hand, trump) {
    if (!hand || !hand.length || !trump) {
      return 0;
    }

    return hand.reduce(function (best, card) {
      return Math.max(best, evaluateCloserCandidate(card, player, hand, trump).score);
    }, 0);
  }

  function findReservedCloser(player, hand, trump, round) {
    var candidates;
    var threshold;
    var best;

    if (!hand || hand.length <= 1 || !trump || !round || round.remainingCards > 5) {
      return null;
    }

    candidates = hand.map(function (card) {
      return evaluateCloserCandidate(card, player, hand, trump);
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
    var cards = [];

    state.completedTricks.forEach(function (trick) {
      trick.cards.forEach(function (play) {
        cards.push(play.card);
      });
    });
    state.trick.forEach(function (play) {
      cards.push(play.card);
    });

    return cards;
  }

  function countRemainingTrumpOutsidePlayer(player) {
    var played = {};
    var hand = state.hands[player] || [];

    getPlayedCards().forEach(function (card) {
      played[card.id] = true;
    });
    hand.forEach(function (card) {
      played[card.id] = true;
    });

    return buildDeck().reduce(function (total, card) {
      if (played[card.id]) {
        return total;
      }
      return total + (effectiveSuit(card, state.trump) === state.trump ? 1 : 0);
    }, 0);
  }

  function countHigherUnknownCards(card, player, trump, knownCards) {
    var known = {};
    var targetSuit = effectiveSuit(card, trump);
    var knownSet = knownCards || state.hands[player] || [];
    var leadSuit = targetSuit;

    getPlayedCards().forEach(function (playedCard) {
      known[playedCard.id] = true;
    });
    knownSet.forEach(function (knownCard) {
      known[knownCard.id] = true;
    });
    known[card.id] = true;

    return buildDeck().reduce(function (total, candidate) {
      if (known[candidate.id] || effectiveSuit(candidate, trump) !== targetSuit) {
        return total;
      }
      return total + (playStrength(candidate, leadSuit, trump) > playStrength(card, leadSuit, trump) ? 1 : 0);
    }, 0);
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

  function estimateVisibleWinnerConfidence(winningPlay, player, playersAfter) {
    var higherUnknown;

    if (!winningPlay) {
      return 0;
    }
    if (playersAfter <= 0) {
      return 1;
    }

    higherUnknown = countHigherUnknownCards(
      winningPlay.card,
      player,
      state.trump,
      state.hands[player] || []
    );

    return clamp(1 - (higherUnknown / Math.max(1, playersAfter + 1)), 0, 1);
  }

  function buildAiPlayContext(player) {
    var profile = getAiProfile(player);
    var match = getAiMatchState(player, profile);
    var round = getAiRoundState(player);
    var winningPlay = null;
    var playersAfter = 3 - state.trick.length;
    var teammateWinning = false;
    var teammateWinConfidence = 0;
    var mode;
    var reservedCloser;

    if (state.trick.length) {
      winningPlay = state.trick[determineTrickWinner(state.trick, state.leadSuit, state.trump)];
      teammateWinning = teamForPlayer(winningPlay.player) === teamForPlayer(player) &&
        winningPlay.player !== player;
      if (teammateWinning) {
        teammateWinConfidence = estimateVisibleWinnerConfidence(winningPlay, player, playersAfter);
      }
    }

    mode = deriveAiTacticalMode(player, profile, match, round);
    reservedCloser = findReservedCloser(player, state.hands[player], state.trump, round);

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
      isLastToAct: state.trick.length === 3,
      remainingTrumpElsewhere: countRemainingTrumpOutsidePlayer(player),
      winningPlay: winningPlay,
      winningTeam: winningPlay ? teamForPlayer(winningPlay.player) : null,
      teammateWinning: teammateWinning,
      teammateWinConfidence: teammateWinConfidence
    };
  }

  function estimateWinningConfidence(card, context) {
    var higherUnknown;

    if (context.isLastToAct) {
      return 1;
    }
    higherUnknown = countHigherUnknownCards(card, context.player, state.trump, context.hand);
    return clamp(1 - (higherUnknown / Math.max(1, context.playersAfter + 1)), 0, 1);
  }

  function scoreAiLeadChoice(card, context) {
    var profile = context.profile;
    var mode = context.mode;
    var suit = effectiveSuit(card, state.trump);
    var higherUnknown = countHigherUnknownCards(card, context.player, state.trump, context.hand);
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
    syncSelectedBid();
  }

  function recordPass(player) {
    state.passed[player] = true;
    state.bidStatuses[player] = "Pass";
    addBidFeed(biddingPlayerName(player) + " passes.");
    advanceBidTurn();
  }

  function addBidFeed(text) {
    state.bidEntries.push(text);
  }

  function advanceBidTurn() {
    var next = state.currentBidTurn;
    var tries = 0;

    do {
      next = (next + 1) % 4;
      tries += 1;
    } while (tries < 4 && state.passed[next]);

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
    render();
  }

  function openTrumpPhase() {
    state.phase = "trump";
    state.kittyReviewHand = state.initialHands[state.bidder].concat(state.kitty);
    state.selectedTrump = state.bidder === 0 ? null : chooseAiTrump(state.kittyReviewHand);
    state.selectedDiscards = [];
    state.aiTrumpReady = false;
    state.aiTrumpMeterStarted = false;

    if (state.bidder !== 0) {
      state.selectedDiscards = chooseAiDiscards(state.kittyReviewHand, state.selectedTrump);
      finalizeBidderHand();
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
    state.hands = prepareRoundHands();
    state.phase = "play";
    state.currentPlayer = state.bidder;
    state.trick = [];
    state.leadSuit = null;
    state.winningCardPlayer = null;
    state.playerPoints = [0, 0, 0, 0];
    state.roundPoints = [0, 0];
    state.trickCounts = [0, 0];
    state.roundMessage = openingPlayMessage();
    state.busy = false;
    render();
    maybeRunAiTurn();
  }

  function prepareRoundHands() {
    var hands = cloneHands(state.initialHands);
    hands[state.bidder] = state.kittyReviewHand.slice();

    PLAYERS.forEach(function (player) {
      sortHand(hands[player], state.trump);
    });

    return hands;
  }

  function chooseAiDiscards(cards, trump) {
    var player = state.bidder;
    var sorted = cards.slice();

    sorted.sort(function (a, b) {
      return aiKeepScore(a, cards, trump, player) - aiKeepScore(b, cards, trump, player);
    });

    return sorted.slice(0, 5).map(function (card) {
      return card.id;
    });
  }

  function maybeRunAiTurn() {
    if (state.phase !== "play" || state.busy || state.currentPlayer === 0) {
      return;
    }

    state.busy = true;
    render();

    schedule(function () {
      var choice = chooseAiPlay(state.currentPlayer);
      playCard(state.currentPlayer, choice.id);
    }, AI_DELAY);
  }

  function chooseAiPlay(player) {
    var context = buildAiPlayContext(player);
    var legal = getLegalCards(player);
    var scored = legal.map(function (card) {
      return {
        card: card,
        score: state.trick.length === 0
          ? scoreAiLeadChoice(card, context)
          : scoreAiFollowChoice(card, context)
      };
    });
    var preferred = scored[0];
    var fallback = null;

    scored.slice(1).forEach(function (entry) {
      if (entry.score > preferred.score) {
        preferred = entry;
      }
    });

    if (context.reservedCloser && legal.length > 1 && preferred.card.id === context.reservedCloser.id) {
      scored.forEach(function (entry) {
        if (entry.card.id === context.reservedCloser.id) {
          return;
        }
        if (!fallback || entry.score > fallback.score) {
          fallback = entry;
        }
      });
      if (fallback && !shouldReleaseReservedCloser(context, preferred.score, fallback.score)) {
        preferred = fallback;
      }
    }

    return preferred.card;
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
    if (card.isRook) {
      showSticker("rook");
    }

    if (state.trick.length === 1) {
      state.leadSuit = effectiveSuit(card, state.trump);
    }

    if (state.trick.length < 4) {
      state.currentPlayer = (player + 1) % 4;
      state.roundMessage = PLAYER_NAMES[player] + " plays " + fullCardLabel(card, state.trump) + ".";
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
    var isLastTrick = state.hands[0].length === 0;
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
    state.roundMessage = trickWinMessage(winner, pointsWon);
    state.busy = true;
    if (!isLastTrick && pointsWon >= BIG_TRICK_THRESHOLD) {
      showSticker("big_trick");
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

      if (isLastTrick) {
        finishRound();
      } else {
        render();
        maybeRunAiTurn();
      }
    }, TRICK_DELAY);
  }

  function finishRound() {
    var bidderTeam = teamForPlayer(state.bidder);
    var otherTeam = bidderTeam === 0 ? 1 : 0;
    var bidMade = state.roundPoints[bidderTeam] >= state.winningBid;
    var bidMargin = Math.abs(state.roundPoints[bidderTeam] - state.winningBid);
    var summaryUs = roundSummaryPoints(0, bidderTeam, bidMade);
    var summaryThem = roundSummaryPoints(1, bidderTeam, bidMade);
    var bidderName = PLAYER_NAMES[state.bidder];
    var bidderTotal = state.roundPoints[bidderTeam];
    var story = buildSummaryStory(bidderTeam, bidderName, bidderTotal, bidMade, bidMargin);

    if (bidMade) {
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
      result: bidMade ? "Made" : "Set",
      bidMargin: bidMargin,
      margin: (bidMade ? "Made it by " : "Missed it by ") + bidMargin + " points",
      storyLabel: story.label,
      storyHeadline: story.headline,
      storyMood: story.mood
    };
    state.roundHistory.unshift({
      round: "R" + state.roundNumber,
      bid: PLAYER_NAMES[state.bidder] + " bid " + state.winningBid,
      madeBid: bidMade,
      isLatest: true,
      win: bidMade ? "✓" : "X",
      us: summaryUs,
      them: summaryThem
    });
    state.roundHistory.slice(1).forEach(function (row) {
      row.isLatest = false;
    });
    recordRoundStats(bidMade);

    state.phase = "summary";
    state.summaryStep = 1;
    state.summaryScoringOpen = false;
    state.busy = true;
    state.roundMessage = "";
    state.dealer = (state.dealer + 1) % 4;
    state.roundNumber += 1;

    if (state.matchPoints[0] >= getRuleConfig().matchTarget || state.matchPoints[1] >= getRuleConfig().matchTarget) {
      state.gameOver = true;
    }
    if (state.gameOver) {
      showSticker("game_win", { bypassCooldown: true });
    } else {
      showSticker(bidMade ? "bid_made" : "bid_set", { bypassCooldown: true });
    }
    recordMatchCompletion();

    schedule(function () {
      state.busy = false;
      render();
    }, SUMMARY_DELAY);
  }

  function roundSummaryPoints(team, bidderTeam, bidMade) {
    if (team === bidderTeam) {
      return bidMade ? state.roundPoints[team] : -state.winningBid;
    }
    return state.roundPoints[team];
  }

  function determineTrickWinner(trick, leadSuit, trump) {
    var winningIndex = 0;
    var winningScore = playStrength(trick[0].card, leadSuit, trump);
    var index;

    for (index = 1; index < trick.length; index += 1) {
      var score = playStrength(trick[index].card, leadSuit, trump);
      if (score > winningScore) {
        winningScore = score;
        winningIndex = index;
      }
    }

    return winningIndex;
  }

  function playStrength(card, leadSuit, trump) {
    var suit = effectiveSuit(card, trump);
    var base = 0;

    if (card.isRook || suit === trump) {
      base = 300;
    } else if (suit === leadSuit) {
      base = 200;
    }

    return base + trickRank(card, trump);
  }

  function trickRank(card, trump) {
    if (card.isRook) {
      return 10.5;
    }
    if (card.rank === 1) {
      return 15;
    }
    if (card.suit === trump && card.rank === 11) {
      return 11;
    }
    if (card.suit === trump && card.rank === 10) {
      return 10;
    }
    return card.rank;
  }

  function effectiveSuit(card, trump) {
    return card.isRook ? trump : card.suit;
  }

  function cardPoints(card) {
    var scoring = getRuleConfig().scoring;
    if (card.isRook) {
      return scoring.rook;
    }
    if (card.rank === 1) {
      return scoring.rank1;
    }
    if (card.rank === 14) {
      return scoring.rank14;
    }
    if (card.rank === 10) {
      return scoring.rank10;
    }
    if (card.rank === 5) {
      return scoring.rank5;
    }
    return 0;
  }

  function getLegalCards(player) {
    var hand = state.hands[player];
    if (state.trick.length === 0) {
      return hand.slice();
    }
    if (!hand.some(function (card) {
      return effectiveSuit(card, state.trump) === state.leadSuit;
    })) {
      return hand.slice();
    }
    return hand.filter(function (card) {
      return effectiveSuit(card, state.trump) === state.leadSuit;
    });
  }

  function isCardLegal(player, card) {
    return getLegalCards(player).some(function (legalCard) {
      return legalCard.id === card.id;
    });
  }

  function teamForPlayer(player) {
    return player % 2 === 0 ? 0 : 1;
  }

  function buildDeck() {
    var deck = [];
    SUITS.forEach(function (suit) {
      var rank;
      for (rank = 1; rank <= 14; rank += 1) {
        deck.push({
          id: suit + "-" + rank,
          suit: suit,
          rank: rank,
          isRook: false
        });
      }
    });
    deck.push({
      id: "rook",
      suit: null,
      rank: null,
      isRook: true
    });
    return deck;
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
    ui.phaseWelcome.classList.toggle("hidden", state.phase !== "welcome");
    ui.phaseBidding.classList.toggle("hidden", state.phase !== "bidding");
    ui.phaseTrump.classList.toggle("hidden", state.phase !== "trump");
    ui.phasePlay.classList.toggle("hidden", state.phase !== "play");
    ui.phaseSummary.classList.toggle("hidden", state.phase !== "summary");
    ui.usScoreText.textContent = "Us " + state.matchPoints[0];
    ui.themScoreText.textContent = "Them " + state.matchPoints[1];
    ui.usScoreBar.style.width = scoreProgressWidth(state.matchPoints[0]);
    ui.themScoreBar.style.width = scoreProgressWidth(state.matchPoints[1]);
    if (ui.summaryMatchTarget) {
      ui.summaryMatchTarget.textContent = String(getRuleConfig().matchTarget);
    }

    if (state.phase === "welcome") {
      renderWelcomePhase();
    } else if (state.phase === "bidding") {
      renderBiddingPhase();
    } else if (state.phase === "trump") {
      renderTrumpPhase();
    } else if (state.phase === "play") {
      renderPlayPhase();
    } else if (state.phase === "summary") {
      renderSummaryPhase();
    }
    renderHistoryDrawer();
    renderMenuSheet();
    saveActiveMatch();
  }

  function renderWelcomePhase() {
    var matchesPlayed = profile.totals.matchesCompleted;
    var humanBidAttempts = profile.human.bidsMade + profile.human.bidsSet;
    var savedExists = !!savedMatchMeta;
    var winRate = matchesPlayed ? Math.round((profile.totals.matchesWon / matchesPlayed) * 100) : 0;

    ui.welcomeTitle.textContent = savedExists ? "Welcome Back" : "Welcome";
    ui.welcomeMessage.textContent = savedExists
      ? "Pick up your last match or start fresh."
      : "Start a match. Your progress and stats stay on this device.";
    ui.savedMatchPanel.classList.toggle("hidden", !savedExists);
    ui.continueSavedGame.classList.toggle("hidden", !savedExists);
    ui.startNewGame.className = savedExists ? "ghost-button" : "primary-button";
    ui.startNewGame.textContent = savedExists ? "Start Match" : "Start Match";

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
      : "No matches yet";
    ui.profileDetail.textContent = matchesPlayed
      ? "Best round " + profile.human.bestRoundPoints + ". Streak " + profile.streaks.currentMatchWinStreak + "."
      : "Stats build as you play.";
  }

  function renderBiddingPhase() {
    var preBid = !state.biddingStarted && !state.biddingComplete;
    var dealDone = !state.dealAnimating && state.dealRevealed;

    ui.biddingPhaseLabel.textContent = preBid ? "Dealing" : "Bidding";
    ui.biddingTitle.textContent = preBid
      ? (dealDone ? "Deal Complete" : "Dealing")
      : (state.biddingComplete ? "Bid Winner" : "Choose Your Bid");
    ui.biddingTitle.classList.toggle("is-dealing", preBid && !dealDone);
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
    ui.dealSeats.classList.toggle("hidden", !preBid);
    ui.dealPile.classList.toggle("hidden", !preBid);
    ui.dealPile.classList.toggle("empty", dealDone);
    ui.dealFillMae.style.width = dealSeatWidth(state.dealSeatCounts[0]);
    ui.dealFillBea.style.width = dealSeatWidth(state.dealSeatCounts[1]);
    ui.dealFillCal.style.width = dealSeatWidth(state.dealSeatCounts[2]);
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
    if (dealDone) {
      renderHandGrid(ui.biddingHand, state.initialHands[0], null, "reference");
      ui.biddingHand.classList.toggle("reveal-hand", state.dealRevealAnimating);
    } else {
      renderDealHand(ui.biddingHand, state.dealVisibleCount);
      ui.biddingHand.classList.remove("reveal-hand");
    }
  }

  function renderTrumpPhase() {
    if (state.bidder === null) {
      ui.trumpPhaseLabel.textContent = "Trump and Kitty";
      ui.trumpTitle.textContent = "Get Set Up";
      ui.trumpBidAmount.textContent = "-";
      ui.trumpProcessing.classList.add("hidden");
      ui.trumpProcessingBar.style.width = "0";
      ui.trumpKittyBlock.classList.remove("hidden");
      ui.trumpReferenceBlock.classList.add("hidden");
      ui.aiTrumpContinue.disabled = true;
      ui.aiTrumpContinue.classList.add("hidden");
      ui.confirmTrump.classList.remove("hidden");
      ui.discardStatusRow.classList.add("hidden");
      ui.confirmTrump.disabled = true;
      renderHandGrid(ui.trumpHand, [], null, "reference");
      renderHandGrid(ui.trumpReferenceHand, [], null, "reference");
      return;
    }

    ui.trumpPhaseLabel.textContent = "Trump and Kitty";
    ui.trumpTitle.textContent = "Get Set Up";
    ui.trumpBidAmount.textContent = PLAYER_NAMES[state.bidder] + " at " + state.winningBid;
    ui.confirmTrump.textContent = "Confirm Selection";
    ui.discardStatusRow.classList.toggle("hidden", state.bidder !== 0);
    ui.discardStatus.textContent = state.selectedDiscards.length + "/5";
    ui.trumpProcessing.classList.toggle("hidden", state.bidder === 0);
    ui.trumpKittyBlock.classList.toggle("hidden", state.bidder !== 0);
    ui.trumpReferenceBlock.classList.toggle("hidden", state.bidder === 0);
    ui.aiTrumpContinue.classList.toggle("hidden", state.bidder === 0);
    ui.confirmTrump.classList.toggle("hidden", state.bidder !== 0);
    if (state.bidder !== 0) {
      ui.trumpProcessingText.textContent = state.aiTrumpReady
        ? PLAYER_NAMES[state.bidder] + " chose " + SUIT_LABEL[state.selectedTrump] + " for trump."
        : PLAYER_NAMES[state.bidder] + " is deciding ...";
      ui.trumpProcessingBar.style.width = state.aiTrumpReady || state.aiTrumpMeterStarted ? "100%" : "0";
      ui.aiTrumpContinue.disabled = !state.aiTrumpReady;
    }

    ui.trumpButtons.forEach(function (button) {
      var suit = button.getAttribute("data-trump");
      var selected = suit === state.selectedTrump && (state.bidder === 0 || state.aiTrumpReady);
      button.classList.toggle("selected", selected);
      button.disabled = state.bidder !== 0 || state.busy;
    });

    ui.confirmTrump.disabled = !state.selectedTrump || state.busy || (state.bidder === 0 && state.selectedDiscards.length !== 5);
    renderHandGrid(
      ui.trumpHand,
      sortedCombinedBidderCards(),
      state.bidder === 0 ? toggleDiscard : null,
      state.bidder === 0 ? "kitty" : "reference"
    );
    renderHandGrid(ui.trumpReferenceHand, state.initialHands[0], null, "reference");
  }

  function renderPlayPhase() {
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
    ui.playContract.textContent = state.winningBid ? PLAYER_NAMES[state.bidder] + " bid " + state.winningBid : "-";
    ui.playMessage.textContent = state.roundMessage || "";
    ui.playMessage.classList.toggle("is-turn", state.currentPlayer === 0 && !state.busy);
    ui.handHint.textContent = state.currentPlayer === 0 && !state.busy ? "Your turn to play" : PLAYER_NAMES[state.currentPlayer] + " to play";
    ui.seatTopCount.textContent = state.playerPoints[2] + " pts";
    ui.seatLeftCount.textContent = state.playerPoints[1] + " pts";
    ui.seatRightCount.textContent = state.playerPoints[3] + " pts";
    ui.seatBottomCount.textContent = state.playerPoints[0] + " pts";
    syncSeatHighlight();

    renderSlot(ui.slotTop, playForSeat(2), state.winningCardPlayer === 2);
    renderSlot(ui.slotLeft, playForSeat(1), state.winningCardPlayer === 1);
    renderSlot(ui.slotRight, playForSeat(3), state.winningCardPlayer === 3);
    renderSlot(ui.slotBottom, playForSeat(0), state.winningCardPlayer === 0);
    renderHandGrid(ui.playerHand, state.hands[0], state.currentPlayer === 0 && !state.busy ? playHumanCard : null, "play");
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

    clearSticker();
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
    applyStickerImpact(config.impact);

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

  function applyStickerImpact(impact) {
    if (!ui.tableArea || !impact) {
      return;
    }
    ui.tableArea.classList.remove("sticker-impact-medium");
    ui.tableArea.classList.remove("sticker-impact-strong");
    void ui.tableArea.offsetWidth;
    ui.tableArea.classList.add("sticker-impact-" + impact);
  }

  function clearSticker() {
    if (state.stickerCleanupId !== null) {
      window.clearTimeout(state.stickerCleanupId);
      state.stickerCleanupId = null;
    }
    state.stickerActive = false;
    if (ui.stickerOverlay) {
      ui.stickerOverlay.innerHTML = "";
    }
    if (ui.tableArea) {
      ui.tableArea.classList.remove("sticker-impact-medium");
      ui.tableArea.classList.remove("sticker-impact-strong");
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
    ui.summaryUs.textContent = state.summary.us;
    ui.summaryThem.textContent = state.summary.them;
    ui.summaryBid.textContent = state.summary.bid;
    if (ui.summaryResult) {
      ui.summaryResult.textContent = state.summary.result;
    }
    ui.nextRound.disabled = state.busy;
    ui.nextRound.textContent = summaryButtonLabel();
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

    if (state.summaryStep === 1) {
      if (ui.summaryNav.parentNode !== ui.phaseSummary.querySelector(".panel-card")) {
        ui.phaseSummary.querySelector(".panel-card").insertBefore(ui.summaryNav, ui.toggleScoring);
      }
      ui.summaryStoryLabel.textContent = state.summary.storyLabel;
      ui.summaryStoryHeadline.textContent = state.summary.storyHeadline;
      ui.summaryStoryMood.textContent = state.summary.storyMood;
      ui.summaryDetail.textContent = state.summary.margin || "";
      renderSummaryStorySticker();
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
    ui.summaryMatchUs.textContent = state.matchPoints[0];
    ui.summaryMatchThem.textContent = state.matchPoints[1];
    ui.summaryMatchNote.textContent = matchSummaryNote();
    applyMatchSummaryBackground();
    if (state.gameOver) {
      renderSummaryProfileCard();
    }
    renderSummaryTable();
  }

  function applyMatchSummaryBackground() {
    var asset = null;

    if (!ui.summaryPanel) {
      return;
    }

    if (state.summaryStep === 2 && state.gameOver) {
      asset = getMatchSummaryGifAsset();
    }

    ui.summaryPanel.classList.toggle("match-summary-gif", Boolean(asset));

    if (asset) {
      ui.summaryPanel.style.setProperty("--match-summary-gif", 'url("' + asset + '")');
      ui.summaryPanel.classList.toggle("is-win", state.matchPoints[0] > state.matchPoints[1]);
      ui.summaryPanel.classList.toggle("is-loss", state.matchPoints[0] < state.matchPoints[1]);
      return;
    }

    ui.summaryPanel.style.removeProperty("--match-summary-gif");
    ui.summaryPanel.classList.remove("is-win");
    ui.summaryPanel.classList.remove("is-loss");
  }

  function getMatchSummaryGifAsset() {
    var outcome;
    var assets;

    if (state.summaryMatchGif) {
      return state.summaryMatchGif;
    }

    outcome = state.matchPoints[0] > state.matchPoints[1] ? "win" : "loss";
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
      profile.human.bidsWon + ". Current ruleset: " + getRuleConfig().label + ".";
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

    if (bidderTeam === 0) {
      return state.summary && state.summary.bidMade ? "Your team made the bid" : "Your team missed the bid";
    }
    return state.summary && state.summary.bidMade ? bidderName + " made the bid" : "You set " + bidderName;
  }

  function matchSummaryHeading() {
    return state.gameOver ? "Final Score" : "Overall Score";
  }

  function summaryButtonLabel() {
    if (state.summaryStep === 1) {
      return "Continue";
    }
    return state.gameOver ? "Start New Match" : "Next Round";
  }

  function matchSummaryNote() {
    if (state.gameOver) {
      return matchWinnerLabel() + " got to " + getRuleConfig().matchTarget + " first.";
    }
    return "First to " + getRuleConfig().matchTarget + " wins.";
  }

  function matchWinnerLabel() {
    return state.matchPoints[0] > state.matchPoints[1] ? "Us" : "Them";
  }

  function buildSummaryStory(bidderTeam, bidderName, bidderTotal, bidMade, bidMargin) {
    var bidderIsUs = bidderTeam === 0;
    var mood = bidOutcomeMood(bidMargin);

    if (bidderIsUs) {
      return {
        label: state.bidder === 0 ? "Your bid" : bidderName + "'s bid",
        headline: "Your team needed " + state.winningBid + " and finished with " + bidderTotal + ".",
        mood: bidMade ? "Your side got there. " + mood.make : "Your side came up short. " + mood.miss
      };
    }

    return {
      label: bidderName + "'s bid",
      headline: bidderName + " needed " + state.winningBid + " and finished with " + bidderTotal + ".",
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
      row.className = rowData.isLatest ? "latest-round" : "";
      row.innerHTML =
        "<td class=\"round-col\">" + rowData.round + "</td>" +
        "<td class=\"bid-col\">" + rowData.bid + "</td>" +
        "<td class=\"win-col\"><span class=\"win-badge " + (rowData.madeBid ? "is-made" : "is-set") + "\">" + rowData.win + "</span></td>" +
        "<td class=\"score-col\">" + rowData.us + "</td>" +
        "<td class=\"score-col\">" + rowData.them + "</td>";
      ui.summaryTableBody.appendChild(row);
    });
  }

  function renderSummaryScoring() {
    var grouped = [[], [], [], []];

    ui.summaryScoringGrid.innerHTML = "";
    state.completedTricks.forEach(function (trick) {
      trick.scoringItems.forEach(function (item) {
        grouped[trick.winner].push(item);
      });
    });
    buildScoringTeamGroup("Us", [0, 2], grouped);
    buildScoringTeamGroup("Them", [1, 3], grouped);
  }

  function renderHandGrid(container, hand, clickHandler, mode) {
    hand = hand || [];
    container.innerHTML = "";

    hand.forEach(function (card) {
      var button = document.createElement("button");
      var rank = document.createElement("div");
      var suit = document.createElement("div");
      var legal = mode === "play" && clickHandler ? isCardLegal(0, card) : true;

      button.type = "button";
      var isReference = mode === "reference" || mode === "kitty";
      var isDiscardSelected = mode === "kitty" && state.selectedDiscards.indexOf(card.id) !== -1;
      var isKittyCard = mode === "kitty" && isCardFromKitty(card.id);
      button.className = "card" +
        (card.isRook ? " rook-card" : "") +
        " " + cardFaceClass(card) +
        (isReference ? " reference-card" : "") +
        (mode === "kitty" ? " selectable-reference" : "") +
        (mode === "play" && clickHandler && legal ? " playable-card" : "") +
        (isKittyCard ? " kitty-card" : "") +
        (isDiscardSelected ? " selected-discard" : "");
      if (mode === "play" && clickHandler) {
        button.disabled = false;
        button.classList.toggle("inactive-card", !legal);
        button.setAttribute("aria-disabled", legal ? "false" : "true");
        button.addEventListener("click", function () {
          if (legal) {
            clickHandler(card.id);
          } else {
            triggerCardLockout(button);
          }
        });
      } else {
        button.disabled = !clickHandler || !legal;
        if (clickHandler && legal) {
          button.addEventListener("click", function () {
            clickHandler(card.id);
          });
        }
      }

      rank.className = "card-rank";
      rank.textContent = cardLabel(card);
      suit.className = "card-suit " + suitClass(card);
      if (mode === "play" && card.isRook && state.trump) {
        button.className += " show-rook-trump rook-trump-" + state.trump;
      }
      button.appendChild(rank);
      button.appendChild(suit);
      container.appendChild(button);
    });
  }

  function renderDealHand(container, count) {
    var index;

    container.innerHTML = "";
    for (index = 0; index < count; index += 1) {
      var card = document.createElement("div");
      card.className = "card card-back deal-card";
      container.appendChild(card);
    }
  }

  function renderBidStatusBoard() {
    ui.bidStatusBoard.innerHTML = "";

    PLAYERS.forEach(function (player) {
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
    if (index !== -1) {
      state.selectedDiscards.splice(index, 1);
    } else if (state.selectedDiscards.length < 5) {
      state.selectedDiscards.push(cardId);
    } else {
      return;
    }
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

  function syncSeatHighlight() {
    var seatClasses = [
      ui.seatBottomName.parentNode,
      ui.seatLeftName.parentNode,
      ui.seatTopName.parentNode,
      ui.seatRightName.parentNode
    ];

    seatClasses.forEach(function (seat, playerIndex) {
      seat.classList.toggle("active-seat", state.currentPlayer === playerIndex);
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
    if (includeTeammate && teamForPlayer(player) === teamForPlayer(0)) {
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
      items.push({
        label: "Last Trick",
        points: 20
      });
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
    if (state.bidder === 0) {
      return playerLeadMessage(0);
    }
    return PLAYER_NAMES[state.bidder] + " chose " + SUIT_LABEL[state.trump] + ". " + playerLeadMessage(state.bidder);
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
    sortHand(state.kittyReviewHand, state.selectedTrump || state.trump);
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

    if (state.dealVisibleCount < 13) {
      schedule(function () {
        state.dealVisibleCount += 1;
        state.dealSeatCounts = state.dealSeatCounts.map(function (count) {
          return Math.min(13, count + 1);
        });
        render();
        runDealAnimation();
      }, 290);
      return;
    }

    schedule(function () {
      state.dealAnimating = false;
      state.dealRevealed = true;
      state.dealRevealAnimating = true;
      render();
      window.setTimeout(function () {
        state.dealRevealAnimating = false;
        render();
      }, 260);
    }, 230);
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

  function dealSeatWidth(count) {
    return (Math.max(0, Math.min(13, count)) / 13) * 100 + "%";
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
      navigator.serviceWorker.register("sw.js").catch(function () {
        return null;
      });
    });
  }

  loadProfile();
  refreshSavedMatchMeta();
  cacheDom();
  bindEvents();
  render();
  registerServiceWorker();
}());
