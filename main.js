(function () {
  var SUITS = ["red", "green", "yellow", "black"];
  var SUIT_LABEL = {
    red: "Red",
    green: "Green",
    yellow: "Yellow",
    black: "Black"
  };
  var PLAYER_NAMES = ["You", "Bea", "Mae", "Cal"];
  var MIN_BID = 100;
  var MAX_BID = 200;
  var BID_STEP = 5;
  var MATCH_TARGET = 500;
  var TOTAL_CARD_POINTS = 180;
  var LAST_TRICK_BONUS = 20;
  var PLAYERS = [0, 1, 2, 3];
  var BID_DELAY = 1200;
  var AI_DELAY = 700;
  var TRICK_DELAY = 1200;
  var SUMMARY_DELAY = 900;
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

  var ui = {};
  var state = createState();

  function createState() {
    return {
      phase: "welcome",
      dealer: 0,
      roundNumber: 1,
      bidder: null,
      winningBid: null,
      trump: null,
      selectedTrump: null,
      selectedBid: MIN_BID,
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
      historyOpen: false,
      roundHistory: [],
      completedTricks: [],
      previousTrick: null,
      gameOver: false,
      busy: false,
      timeoutId: null,
      rookStickerCleanupId: null
    };
  }

  function cacheDom() {
    ui.phaseWelcome = document.getElementById("phaseWelcome");
    ui.phaseBidding = document.getElementById("phaseBidding");
    ui.phaseTrump = document.getElementById("phaseTrump");
    ui.phasePlay = document.getElementById("phasePlay");
    ui.phaseSummary = document.getElementById("phaseSummary");
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
    ui.rookStickerOverlay = document.getElementById("rookStickerOverlay");
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
    ui.startNewGame.addEventListener("click", function () {
      if (state.phase !== "welcome") {
        return;
      }
      startRound();
    });

    ui.decreaseBid.addEventListener("click", function () {
      if (state.phase !== "bidding" || state.busy || state.biddingComplete) {
        return;
      }
      state.selectedBid = Math.max(getMinimumBid(), state.selectedBid - BID_STEP);
      render();
    });

    ui.increaseBid.addEventListener("click", function () {
      if (state.phase !== "bidding" || state.busy || state.biddingComplete) {
        return;
      }
      state.selectedBid = Math.min(MAX_BID, state.selectedBid + BID_STEP);
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
    state.selectedBid = MIN_BID;
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
    clearRookSticker();

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
    if (state.currentBid === MAX_BID) {
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
      return Math.min(MAX_BID, Math.max(floor, Math.min(target, bid)));
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

      return Math.min(MAX_BID, Math.min(target, bid));
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

    return Math.min(MAX_BID, Math.min(target, bid));
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
    return Math.round(value / BID_STEP) * BID_STEP;
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
    var ourDistanceToWin = Math.max(0, MATCH_TARGET - ourScore);
    var theirDistanceToWin = Math.max(0, MATCH_TARGET - theirScore);
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
    var remainingCardPoints = Math.max(0, TOTAL_CARD_POINTS - awardedPoints);
    var lastTrickSwing = remainingCards > 0 ? LAST_TRICK_BONUS + buriedKittyPoints() : 0;
    var totalSwingRemaining = remainingCardPoints + (remainingCards > 0 ? LAST_TRICK_BONUS : 0);
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

  function estimateCloserStrength(player, hand, trump) {
    if (!hand || !hand.length || !trump) {
      return 0;
    }

    return hand.reduce(function (best, card) {
      var suit = effectiveSuit(card, trump);
      var higherUnknown = countHigherUnknownCards(card, player, trump, hand);
      var score = cardControlScore(card, trump) * 1.7;

      if (suit === trump) {
        score += 3.5;
      }
      if (card.isRook) {
        score += 4;
      } else if (card.rank === 1) {
        score += 2.4;
      }
      score += cardPoints(card) * 0.2;
      score -= higherUnknown * 1.8;

      return Math.max(best, score);
    }, 0);
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
    var counts = { red: 0, green: 0, yellow: 0, black: 0 };

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
      targetBid: clamp(MIN_BID + bidOffset, MIN_BID, MAX_BID)
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

    if (state.trick.length) {
      winningPlay = state.trick[determineTrickWinner(state.trick, state.leadSuit, state.trump)];
      teammateWinning = teamForPlayer(winningPlay.player) === teamForPlayer(player) &&
        winningPlay.player !== player;
      if (teammateWinning) {
        teammateWinConfidence = estimateVisibleWinnerConfidence(winningPlay, player, playersAfter);
      }
    }

    mode = deriveAiTacticalMode(player, profile, match, round);

    return {
      player: player,
      team: teamForPlayer(player),
      partner: teammateForPlayer(player),
      hand: state.hands[player],
      profile: profile,
      match: match,
      round: round,
      mode: mode,
      trickPoints: currentTrickPoints(),
      lastTrickSwing: round.lastTrickSwing || (LAST_TRICK_BONUS + buriedKittyPoints()),
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

    return score;
  }

  function scoreAiSlough(card, context) {
    var profile = context.profile;
    var mode = context.mode;
    var suit = effectiveSuit(card, state.trump);
    var suitCount = countSuitInHand(context.hand, suit, state.trump);
    var preservePenalty = endgameRetentionPenalty(card, context);
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
    return state.currentBid === null ? MIN_BID : Math.min(MAX_BID, state.currentBid + BID_STEP);
  }

  function syncSelectedBid() {
    state.selectedBid = Math.min(MAX_BID, Math.max(getMinimumBid(), state.selectedBid));
  }

  function finishBidding() {
    state.bidder = state.currentBidHolder === null ? 0 : state.currentBidHolder;
    state.winningBid = state.currentBid === null ? MIN_BID : state.currentBid;
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
    var preferred = legal[0];
    var bestScore = state.trick.length === 0
      ? scoreAiLeadChoice(preferred, context)
      : scoreAiFollowChoice(preferred, context);

    legal.slice(1).forEach(function (card) {
      var score = state.trick.length === 0
        ? scoreAiLeadChoice(card, context)
        : scoreAiFollowChoice(card, context);

      if (score > bestScore) {
        bestScore = score;
        preferred = card;
      }
    });

    return preferred;
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
      showRookSticker();
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
      pointsWon += 20;
    }

    state.roundPoints[team] += pointsWon;
    state.playerPoints[winner] += pointsWon;
    state.trickCounts[team] += 1;
    state.winningCardPlayer = winner;
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
    render();

    schedule(function () {
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

    state.summary = {
      us: summaryUs,
      them: summaryThem,
      bid: PLAYER_NAMES[state.bidder] + " bid " + state.winningBid,
      bidMade: bidMade,
      result: bidMade ? "Made" : "Set",
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

    state.phase = "summary";
    state.summaryStep = 1;
    state.summaryScoringOpen = false;
    state.busy = true;
    state.roundMessage = "";
    state.dealer = (state.dealer + 1) % 4;
    state.roundNumber += 1;

    if (state.matchPoints[0] >= 500 || state.matchPoints[1] >= 500) {
      state.gameOver = true;
    }

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
    if (card.isRook) {
      return 20;
    }
    if (card.rank === 1) {
      return 15;
    }
    if (card.rank === 14 || card.rank === 10) {
      return 10;
    }
    if (card.rank === 5) {
      return 5;
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

    if (state.phase === "bidding") {
      renderBiddingPhase();
    } else if (state.phase === "trump") {
      renderTrumpPhase();
    } else if (state.phase === "play") {
      renderPlayPhase();
    } else if (state.phase === "summary") {
      renderSummaryPhase();
    }
    renderHistoryDrawer();
  }

  function renderBiddingPhase() {
    var preBid = !state.biddingStarted && !state.biddingComplete;
    var dealDone = !state.dealAnimating && state.dealRevealed;

    ui.biddingPhaseLabel.textContent = preBid ? "Dealing" : "Bidding";
    ui.biddingTitle.textContent = preBid ? (dealDone ? "Deal Complete" : "Dealing") : "Choose Your Bid";
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
    ui.increaseBid.disabled = state.selectedBid >= MAX_BID || state.busy || state.biddingComplete || !state.biddingStarted;
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
    ui.seatTopCount.textContent = state.playerPoints[2] + " points";
    ui.seatLeftCount.textContent = state.playerPoints[1] + " points";
    ui.seatRightCount.textContent = state.playerPoints[3] + " points";
    ui.seatBottomCount.textContent = state.playerPoints[0] + " points";
    syncSeatHighlight();

    renderSlot(ui.slotTop, playForSeat(2), state.winningCardPlayer === 2);
    renderSlot(ui.slotLeft, playForSeat(1), state.winningCardPlayer === 1);
    renderSlot(ui.slotRight, playForSeat(3), state.winningCardPlayer === 3);
    renderSlot(ui.slotBottom, playForSeat(0), state.winningCardPlayer === 0);
    renderHandGrid(ui.playerHand, state.hands[0], state.currentPlayer === 0 && !state.busy ? playHumanCard : null, "play");
  }

  function showRookSticker() {
    var sticker;

    if (!ui.rookStickerOverlay || !ui.tableArea) {
      return;
    }

    clearRookSticker();

    sticker = document.createElement("img");
    sticker.className = "rook-sticker";
    sticker.src = "img/rook-sticker.png";
    sticker.alt = "";
    sticker.decoding = "async";
    sticker.setAttribute("aria-hidden", "true");
    ui.rookStickerOverlay.appendChild(sticker);

    ui.tableArea.classList.remove("rook-impact");
    void ui.tableArea.offsetWidth;
    ui.tableArea.classList.add("rook-impact");

    sticker.addEventListener("animationend", function () {
      if (sticker.parentNode === ui.rookStickerOverlay) {
        ui.rookStickerOverlay.removeChild(sticker);
      }
    }, { once: true });

    state.rookStickerCleanupId = window.setTimeout(function () {
      state.rookStickerCleanupId = null;
      ui.tableArea.classList.remove("rook-impact");
      clearRookSticker();
    }, 700);
  }

  function clearRookSticker() {
    if (state.rookStickerCleanupId !== null) {
      window.clearTimeout(state.rookStickerCleanupId);
      state.rookStickerCleanupId = null;
    }
    if (ui.rookStickerOverlay) {
      ui.rookStickerOverlay.innerHTML = "";
    }
    if (ui.tableArea) {
      ui.tableArea.classList.remove("rook-impact");
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
    ui.summaryResult.textContent = state.summary.result;
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
      return;
    }

    if (ui.summaryNav.parentNode !== ui.summaryHistoryNav) {
      ui.summaryHistoryNav.appendChild(ui.summaryNav);
    }
    ui.summaryDetail.textContent = "";
    ui.summaryMatchUs.textContent = state.matchPoints[0];
    ui.summaryMatchThem.textContent = state.matchPoints[1];
    ui.summaryMatchNote.textContent = matchSummaryNote();
    renderSummaryTable();
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
      return matchWinnerLabel() + " got to 500 first.";
    }
    return "First to 500 wins.";
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
  }

  function scoreProgressWidth(score) {
    var clamped = Math.max(0, Math.min(500, score));
    return (clamped / 500) * 100 + "%";
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

    card.className = "played-card" + (isWinner ? " winner" : "") + (cardData.isRook ? " rook-card" : "");
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
    var suitCounts = { red: 0, green: 0, yellow: 0, black: 0 };
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

  cacheDom();
  bindEvents();
  render();
  registerServiceWorker();
}());
