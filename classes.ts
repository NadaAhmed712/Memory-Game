export class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement };
  constructor() {
    this.sounds = {
      flip: new Audio("sounds/flip.mp3"),
      good: new Audio("sounds/good.mp3"),
      fail: new Audio("sounds/fail.mp3"),
      fulltrack: new Audio("sounds/fulltrack.mp3"),
      "game-over": new Audio("sounds/game-over.mp3"),
    };
  }
  play(name: string) {
    this.sounds[name]?.play();
  }
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
}

export class Card {
  element: HTMLElement;
  id: number;
  isFlipped: boolean = false;
  constructor(id: number, image: string) {
    this.id = id;
    this.element = this.createCardElement(image);
  }
  private createCardElement(image: string): HTMLElement {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("col-2", "card-container");
    const card = document.createElement("div");
    card.classList.add("memory-card");
    const frontFace = document.createElement("img");
    frontFace.src = image;
    frontFace.classList.add("front-face");

    const backFace = document.createElement("img");
    backFace.src = "images/back.jpg";
    backFace.classList.add("back-face");
    card.appendChild(frontFace);
    card.appendChild(backFace);
    cardDiv.appendChild(card);
    return cardDiv;
  }
}