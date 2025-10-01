import { Card, SoundManager } from "./classes.js";
class Game {
    constructor() {
        this.cards = [];
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.score = 0;
        this.matches = 0;
        this.gameBoard = document.getElementById("gameBoard");
        this.progressBar = document.getElementById("progressBar");
        this.soundManager = new SoundManager();
        this.setup();
        document.getElementById("refreshBtn").addEventListener("click", () => this.reset());
    }
    setup() {
        this.generateCards();
        this.shuffleCards();
        this.renderBoard();
    }
    generateCards() {
        this.cards = [];
        const images = Array.from({ length: 10 }, (_, i) => `images/card${i + 1}.jpg`);
        const allImages = [...images, ...images];
        allImages.forEach((img, index) => this.cards.push(new Card(index, img)));
    }
    shuffleCards() {
        this.cards.sort(() => Math.random() - 0.5);
    }
    renderBoard() {
        this.gameBoard.innerHTML = "";
        this.cards.forEach((card, index) => {
            if (index % 5 === 0) {
                const row = document.createElement("div");
                row.classList.add("row", "g-3", "justify-content-center");
                this.gameBoard.appendChild(row);
            }
            const lastRow = this.gameBoard.lastElementChild;
            card.element.classList.add("col-2", "d-flex", "justify-content-center");
            lastRow.appendChild(card.element);
            const memoryCard = card.element.querySelector(".memory-card");
            memoryCard.addEventListener("click", () => this.flipCard(memoryCard, card));
        });
    }
    flipCard(cardEl, card) {
        if (this.lockBoard || cardEl === this.firstCard)
            return;
        cardEl.classList.add("flip");
        this.soundManager.play("flip");
        if (!this.firstCard) {
            this.firstCard = cardEl;
            return;
        }
        this.secondCard = cardEl;
        this.checkForMatch();
    }
    checkForMatch() {
        const img1 = this.firstCard.querySelector(".front-face");
        const img2 = this.secondCard.querySelector(".front-face");
        if (img1.src === img2.src) {
            this.disableCards();
            this.soundManager.play("good");
            this.updateProgress();
            this.matches++;
            if (this.matches === 10) {
                this.soundManager.play("fulltrack");
                alert("🎉 You Won!");
            }
        }
        else {
            this.unflipCards();
            this.soundManager.play("fail");
        }
    }
    disableCards() {
        this.firstCard = null;
        this.secondCard = null;
    }
    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            var _a, _b;
            (_a = this.firstCard) === null || _a === void 0 ? void 0 : _a.classList.remove("flip");
            (_b = this.secondCard) === null || _b === void 0 ? void 0 : _b.classList.remove("flip");
            this.firstCard = null;
            this.secondCard = null;
            this.lockBoard = false;
        }, 1000);
    }
    updateProgress() {
        this.score += 10;
        this.progressBar.style.width = `${this.score}%`;
        this.progressBar.textContent = `${this.score}%`;
    }
    reset() {
        this.soundManager.stopAll();
        this.score = 0;
        this.matches = 0;
        this.progressBar.style.width = "0%";
        this.progressBar.textContent = "0%";
        this.setup();
    }
}
document.addEventListener("DOMContentLoaded", () => new Game());
