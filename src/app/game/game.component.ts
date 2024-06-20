import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Game } from '../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatButtonModule } from '@angular/material/button';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { GameInfoComponent } from './game-info/game-info.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule , DialogAddPlayerComponent, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: String = '';
  game: any;
  readonly dialog = inject(MatDialog);

  constructor() {
    this.newGame();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      console.log('New Card: ' + this.currentCard);
      console.log('Game is', this.game);


      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
      }, 1250);
    }
  }

  newGame() {
    this.game = new Game();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      this.game.players.push(name);
      /* console.log('The dialog was closed', result); */
    });
  }

}
