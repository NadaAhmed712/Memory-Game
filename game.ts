import {Card, SoundManager} from "./classes.js"
class Game {
  private gameBoard: HTMLElement;
  private progressBar: HTMLElement;
  private soundManager: SoundManager;
  private cards: Card[] = [];
  private firstCard: HTMLElement | null = null;
  private secondCard: HTMLElement | null = null;
  private lockBoard: boolean = false;
  private score: number = 0;
  private matches: number = 0;
  constructor() {
    this.gameBoard = document.getElementById("gameBoard")!;
    this.progressBar = document.getElementById("progressBar")!;
    this.soundManager = new SoundManager();
    this.setup();
    (document.getElementById("refreshBtn") as HTMLButtonElement).addEventListener("click", () => this.reset());
  }
  private setup() {
    this.generateCards();
    this.shuffleCards();
    this.renderBoard();
  }
  private generateCards() {
    this.cards = [];
    const images = Array.from({ length: 10 }, (_, i) => `images/card${i + 1}.jpg`);
    const allImages = [...images, ...images];
    allImages.forEach((img, index) => this.cards.push(new Card(index, img)));
  }
  private shuffleCards() {
    this.cards.sort(() => Math.random() - 0.5);
  }
  private renderBoard() {
    this.gameBoard.innerHTML = "";

    this.cards.forEach((card, index) => {
      if (index % 5 === 0) {
        const row = document.createElement("div");
        row.classList.add("row", "g-3", "justify-content-center");
        this.gameBoard.appendChild(row);
      }

      const lastRow = this.gameBoard.lastElementChild as HTMLElement;
      card.element.classList.add("col-2", "d-flex", "justify-content-center");
      lastRow.appendChild(card.element);

      const memoryCard = card.element.querySelector(".memory-card") as HTMLElement;
      memoryCard.addEventListener("click", () => this.flipCard(memoryCard, card));
    });
  }
  private flipCard(cardEl: HTMLElement, card: Card) {
    if (this.lockBoard || cardEl === this.firstCard) return;

    cardEl.classList.add("flip");
    this.soundManager.play("flip");

    if (!this.firstCard) {
      this.firstCard = cardEl;
      return;
    }

    this.secondCard = cardEl;
    this.checkForMatch();
  }
  private checkForMatch() {
    const img1 = this.firstCard!.querySelector(".front-face") as HTMLImageElement;
    const img2 = this.secondCard!.querySelector(".front-face") as HTMLImageElement;

    if (img1.src === img2.src) {
      this.disableCards();
      this.soundManager.play("good");
      this.updateProgress();
      this.matches++;
      if (this.matches === 10) {
        this.soundManager.play("fulltrack");
        alert("🎉 You Won!");
      }
    } else {
      this.unflipCards();
      this.soundManager.play("fail");
    }
  }
  private disableCards() {
    this.firstCard = null;
    this.secondCard = null;
  }
  private unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.firstCard?.classList.remove("flip");
      this.secondCard?.classList.remove("flip");
      this.firstCard = null;
      this.secondCard = null;
      this.lockBoard = false;
    }, 1000);
  }
  private updateProgress() {
    this.score += 10;
    this.progressBar.style.width = `${this.score}%`;
    this.progressBar.textContent = `${this.score}%`;
  }
  private reset() {
    this.soundManager.stopAll();
    this.score = 0;
    this.matches = 0;
    this.progressBar.style.width = "0%";
    this.progressBar.textContent = "0%";
    this.setup();
  }
}
document.addEventListener("DOMContentLoaded", () => new Game());
