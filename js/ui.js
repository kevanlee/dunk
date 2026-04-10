export function setPhaseVisibility(ui, phase) {
  ui.phaseWelcome.classList.toggle("hidden", phase !== "welcome");
  ui.phaseSetup.classList.toggle("hidden", phase !== "setup");
  ui.phaseBidding.classList.toggle("hidden", phase !== "bidding");
  ui.phaseTrump.classList.toggle("hidden", phase !== "trump");
  ui.phasePlay.classList.toggle("hidden", phase !== "play");
  ui.phaseScoring.classList.toggle("hidden", phase !== "scoring");
  ui.phaseSummary.classList.toggle("hidden", phase !== "summary");
}

export function renderHandGrid(options) {
  var container = options.container;
  var hand = options.hand || [];
  var clickHandler = options.clickHandler;
  var mode = options.mode;
  var state = options.state;
  var legalCardIdSet = options.legalCardIdSet;
  var canDiscardFromBidderSetup = options.canDiscardFromBidderSetup;
  var canDiscardInWoodsonExchange = options.canDiscardInWoodsonExchange;
  var isCardFromKitty = options.isCardFromKitty;
  var triggerCardLockout = options.triggerCardLockout;
  var cardFaceClass = options.cardFaceClass;
  var cardLabel = options.cardLabel;
  var suitClass = options.suitClass;
  var shouldShowRedOneTrumpDot = options.shouldShowRedOneTrumpDot;
  var fragment = document.createDocumentFragment();

  container.innerHTML = "";

  hand.forEach(function (card) {
    var button = document.createElement("button");
    var rank = document.createElement("div");
    var suit = document.createElement("div");
    var legal = mode === "play" && clickHandler ? legalCardIdSet.has(card.id) : true;
    var isWoodsonHand = mode === "woodson-hand";
    var isWoodsonKitty = mode === "woodson-kitty";
    var isCallPartnerCard = mode === "call-partner";
    var isReference;
    var isDiscardSelected;
    var isKittyCard;
    var isWoodsonSelected;
    var isCallPartnerSelected;
    var kittyLegal;
    var woodsonLegal;

    button.type = "button";
    isReference = mode === "reference" || mode === "kitty" || isWoodsonHand || isWoodsonKitty;
    isDiscardSelected = mode === "kitty" && state.selectedDiscards.indexOf(card.id) !== -1;
    isKittyCard = mode === "kitty" && isCardFromKitty(card.id);
    isWoodsonSelected = (isWoodsonHand && state.exchangeSelectedHandCardId === card.id) ||
      (isWoodsonKitty && state.exchangeSelectedKittyCardId === card.id);
    isCallPartnerSelected = isCallPartnerCard && state.pendingCallPartnerCardId === card.id;
    kittyLegal = mode !== "kitty" || canDiscardFromBidderSetup(card);
    woodsonLegal = !isWoodsonHand || canDiscardInWoodsonExchange(card);
    button.className = "card" +
      (card.isRook ? " rook-card" : "") +
      " " + cardFaceClass(card) +
      (isReference ? " reference-card" : "") +
      (mode === "kitty" || isWoodsonHand || isWoodsonKitty || isCallPartnerCard ? " selectable-reference" : "") +
      (mode === "play" && clickHandler && legal ? " playable-card" : "") +
      (isKittyCard ? " kitty-card" : "") +
      (isDiscardSelected || isWoodsonSelected || isCallPartnerSelected ? " selected-discard" : "");
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
      button.disabled = !clickHandler || !legal || (mode === "kitty" && !kittyLegal) || (isWoodsonHand && !woodsonLegal);
      if (mode === "kitty") {
        button.classList.toggle("inactive-card", !kittyLegal);
      }
      if (isWoodsonHand) {
        button.classList.toggle("inactive-card", !woodsonLegal);
      }
      if (clickHandler && legal && (mode !== "kitty" || kittyLegal) && (!isWoodsonHand || woodsonLegal)) {
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
    if (shouldShowRedOneTrumpDot(card)) {
      button.className += " show-red-one-trump rook-trump-" + state.trump;
    }
    button.appendChild(rank);
    button.appendChild(suit);
    fragment.appendChild(button);
  });

  container.appendChild(fragment);
}
