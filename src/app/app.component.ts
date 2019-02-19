import { Component, OnInit, ViewChildren } from '@angular/core';
import { ReelComponent } from './reel/reel.component';
import { MatSnackBar, MatSlideToggleChange } from '@angular/material';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-slotb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  _win = [];
  _animationDuration = 2000;
  _stepAnimationDuration = 10;
  _states = 10;
  _disabled = false;

  arrSel = ['none', 'none', 'none'];
  posSel = ['none', 'none', 'none'];

  rotateArr = [false, false, false]

  isManual = false;

  payout: string[];

  arr = [
    '3xBAR',
    'BAR',
    '2xBAR',
    '7',
    'CHERRY'
  ];

  pos = [
    'top',
    'center',
    'bottom'
  ]

  public balance = 5000;

  @ViewChildren(ReelComponent)
  private reels: ReelComponent[];

  reel = [0, 0, 0];

  get win() {
    let cl = '';
    if (!this._win) return cl;
    if (this._win.includes(0)) cl = 'top';
    if (this._win.includes(1)) cl += ' center';
    if (this._win.includes(2)) cl += ' bottom';
    return cl;
  }

  constructor(private snackBar: MatSnackBar) {};

  ngOnInit(): void {
    this.spin();
  }

  protected setReel(val: number[] = []) {
    if (!val || val.length!=3) {
      val = [null, null, null];
    } 
    for (let k=0; k<3; k++){
      if(isNullOrUndefined(val[k])){
        val[k] = this.rand(this._states)
      }
    }

    return val;
  }

  public setManual(e: MatSlideToggleChange) {
    this.isManual = e.checked;
  }

  protected rand(n: number) {
    return Math.floor(Math.random()*n);
  }

  public play(vam = []) {
    this._disabled = true;
    const val = this.setReel(vam);
    this.rotateArr = [true, true, true];
    setTimeout(() => {this.reel[0] = val[0]; this.rotateArr[0] = false}, 2000);
    setTimeout(() => {this.reel[1] = val[1]; this.rotateArr[1] = false}, 2500);
    setTimeout(() => {this.reel[2] = val[2]; this.rotateArr[2] = false; this._disabled = false; this.getWinner();}, 3000);
  }

  private setPayoutMessage(message: string) {
    if (!this.payout) this.payout = [];
    this.payout.unshift(message);
    this.snackBar.open(message, 'Payout', {
      duration: 6000,
    });
    console.log(message);
  }

  private setSelects(j: number, obj: {top: string, center: string, bottom: string}){
    if (obj.center) {
      this.arrSel[j] = obj.center;
      this.posSel[j] = 'center';
    } else {
      this.arrSel[j] = obj.top;
      this.posSel[j] = 'top';
    }

  }

  private getWinner() {
    const reel1 = this.getReelValue(0);
    const reel2 = this.getReelValue(1);
    const reel3 = this.getReelValue(2);

    this.setSelects(0, reel1);
    this.setSelects(1, reel2);
    this.setSelects(2, reel3);

    console.log(this.reel[0] + ':'+ reel1.top + ',' + reel1.center + ',' + reel1.bottom);
    console.log(this.reel[1] + ':'+ reel2.top + ',' + reel2.center + ',' + reel2.bottom);
    console.log(this.reel[2] + ':'+ reel3.top + ',' + reel3.center + ',' + reel3.bottom);

    this._win = [];

    // top line analyses
    if (reel1.top == 'CHERRY' && reel2.top == 'CHERRY' && reel3.top == 'CHERRY') {
      this._win.push(0);
      this.balance += 2000;
      this.setPayoutMessage('0001: 3 CHERRY symbols on top line 2000 ');
    } else if (reel1.top == '7' && reel2.top == '7' && reel3.top == '7') {
      this._win.push(0);
      this.balance += 150;
      this.setPayoutMessage('0002: 3 7 symbols on any line 150 ');
    } else if (reel1.top == '3xBAR' && reel2.top == '3xBAR' && reel3.top == '3xBAR') {
      this._win.push(0);
      this.balance += 50;
      this.setPayoutMessage('0003: 3 3xBAR symbols on any line 50 ');
    } else if (reel1.top == '2xBAR' && reel2.top == '2xBAR' && reel3.top == '2xBAR') {
      this._win.push(0);
      this.balance += 20;
      this.setPayoutMessage('0004: 3 2xBAR symbols on any line 20 ');
    } else if (reel1.top == 'BAR' && reel2.top == 'BAR' && reel3.top == 'BAR') {
      this._win.push(0);
      this.balance += 10;
      this.setPayoutMessage('0005: 3 BAR symbols on any line 10 ');
    } else if ((reel1.top == '7' || reel1.top == 'CHERRY') && (reel2.top == '7' || reel2.top == 'CHERRY') ||
        (reel1.top == '7' || reel1.top == 'CHERRY') && (reel3.top == '7' || reel3.top == 'CHERRY') ||
        (reel2.top == '7' || reel2.top == 'CHERRY') && (reel3.top == '7' || reel3.top == 'CHERRY')) {
        this._win.push(0);
        this.balance += 75;
        this.setPayoutMessage('0006: Any combination of CHERRY and 7 on any line 75 ');
    } else if ((reel1.top.search('BAR')>=0 && reel2.top.search('BAR')>=0) ||
        (reel1.top.search('BAR')>=0 && reel3.top.search('BAR')>=0) ||
        (reel3.top.search('BAR')>=0 && reel2.top.search('BAR')>=0)) {
        this._win.push(0);
        this.balance += 5;
        this.setPayoutMessage('0007: Combination of any BAR symbols on any line 5 ');
    }

    if (reel1.center == 'CHERRY' && reel2.center == 'CHERRY' && reel3.center == 'CHERRY') {
      this._win.push(1);
      this.balance += 1000;
      this.setPayoutMessage('0008: 3 CHERRY symbols on center line 1000 ');
    } else if (reel1.center == '7' && reel2.center == '7' && reel3.center == '7') {
      this._win.push(1);
      this.balance += 150;
      this.setPayoutMessage('0009: 3 7 symbols on any line 150 ');
    } else if (reel1.center == '3xBAR' && reel2.center == '3xBAR' && reel3.center == '3xBAR') {
      this._win.push(1);
      this.balance += 50;
      this.setPayoutMessage('0010: 3 3xBAR symbols on any line 50 ');
    } else if (reel1.center == '2xBAR' && reel2.center == '2xBAR' && reel3.center == '2xBAR') {
      this._win.push(1);
      this.balance += 20;
      this.setPayoutMessage('0011: 3 2xBAR symbols on any line 20 ');
    } else if (reel1.center == 'BAR' && reel2.center == 'BAR' && reel3.center == 'BAR') {
      this._win.push(1);
      this.balance += 10;
      this.setPayoutMessage('0012: 3 BAR symbols on any line 10 ');
    } else if ((reel1.center == '7' || reel1.center == 'CHERRY') && (reel2.center == '7' || reel2.center == 'CHERRY') ||
        (reel1.center == '7' || reel1.center == 'CHERRY') && (reel3.center == '7' || reel3.center == 'CHERRY') ||
        (reel2.center == '7' || reel2.center == 'CHERRY') && (reel3.center == '7' || reel3.center == 'CHERRY')) {
        this._win.push(1);
        this.balance += 75;
        this.setPayoutMessage('0013: Any combination of CHERRY and 7 on any line 75 ');
    } else if ((reel1.center.search('BAR')>=0 && reel2.center.search('BAR')>=0) ||
        (reel1.center.search('BAR')>=0 && reel3.center.search('BAR')>=0) ||
        (reel3.center.search('BAR')>=0 && reel2.center.search('BAR')>=0)) {
        this._win.push(1);
        this.balance += 5;
        this.setPayoutMessage('0014: Combination of any BAR symbols on any line 5 ');
    }

    if (reel1.bottom == 'CHERRY' && reel2.bottom == 'CHERRY' && reel3.bottom == 'CHERRY') {
      this._win.push(2);
      this.balance += 4000;
      this.setPayoutMessage('0015: 3 CHERRY symbols on bottom line 4000 ');
    } else if (reel1.bottom == '7' && reel2.bottom == '7' && reel3.bottom == '7') {
      this._win.push(2);
      this.balance += 150;
      this.setPayoutMessage('0016: 3 7 symbols on any line 150 ');
    } else if (reel1.bottom == '3xBAR' && reel2.bottom == '3xBAR' && reel3.bottom == '3xBAR') {
      this._win.push(2);
      this.balance += 50;
      this.setPayoutMessage('0017: 3 3xBAR symbols on any line 50 ');
    } else if (reel1.bottom == '2xBAR' && reel2.bottom == '2xBAR' && reel3.bottom == '2xBAR') {
      this._win.push(2);
      this.balance += 20;
      this.setPayoutMessage('0018: 3 2xBAR symbols on any line 20 ');
    } else if (reel1.bottom == 'BAR' && reel2.bottom == 'BAR' && reel3.bottom == 'BAR') {
      this._win.push(2);
      this.balance += 10;
      this.setPayoutMessage('0019: 3 BAR symbols on any line 10 ');
    } else if ((reel1.bottom == '7' || reel1.bottom == 'CHERRY') && (reel2.bottom == '7' || reel2.bottom == 'CHERRY') ||
        (reel1.bottom == '7' || reel1.bottom == 'CHERRY') && (reel3.bottom == '7' || reel3.bottom == 'CHERRY') ||
        (reel2.bottom == '7' || reel2.bottom == 'CHERRY') && (reel3.bottom == '7' || reel3.bottom == 'CHERRY')) {
        this._win.push(2);
        this.balance += 75;
        this.setPayoutMessage('0020: Any combination of CHERRY and 7 on any line 75 ');
    } else if ((reel1.bottom.search('BAR')>=0 && reel2.bottom.search('BAR')>=0) ||
        (reel1.bottom.search('BAR')>=0 && reel3.bottom.search('BAR')>=0) ||
        (reel3.bottom.search('BAR')>=0 && reel2.bottom.search('BAR')>=0)) {
        this._win.push(2);
        this.balance += 5;
        this.setPayoutMessage('0021: Combination of any BAR symbols on any line 5 ');
    }
    if (this.balance > 5000) {
      this.balance = 5000;
    }

    console.log(this._win);
  }

  private getReelValue(j: number) {
    let val = {top: '', center: '', bottom: ''};
    switch(this.reel[j]) {
      case 0: val.center = '3xBAR'; break;
      case 1: val.top = '3xBAR'; val.bottom = 'BAR'; break;
      case 2: val.center = 'BAR'; break;
      case 3: val.top = 'BAR'; val.bottom = '2xBAR'; break;
      case 4: val.center = '2xBAR'; break;
      case 5: val.top = '2xBAR'; val.bottom = '7'; break;
      case 6: val.center = '7'; break;
      case 7: val.top = '7'; val.bottom = 'CHERRY'; break;
      case 8: val.center = 'CHERRY';break;
      case 9: val.top = 'CHERRY'; val.bottom = '3xBAR';break;
    }
    return val;
  }

  protected animateReeltoNum(j: number, st: number, duration: number) {
    this.reels[j].animateToNum(st, duration);
  }

  public spin() {
    this._win = null;
    if (this.balance > 0) {
      this.balance--;
      setTimeout(() => {this.setPayoutMessage('0000: SPIN -1')}, 100);
    }
    let vam = [];
    if (this.isManual == true) {
      for (let k=0; k<3; k++) {
        let num = this.setReelNumFromSelect(k);
        vam[k] = num;
      }
    }
    
    this.play(vam);

  }

  private setReelNumFromSelect(j) {
    const a = this.arrSel[j];
    const p = this.posSel[j];
    let num: number;
    if (a!='none' && p!='none'){
      if (a == '3xBAR'){
        switch(p){
          case 'center': num = 0; break;
          case 'top': num = 1; break;
          case 'bottom': num = 9; break;
        }
      } else if (a == 'BAR'){
        switch(p){
          case 'center': num = 2; break;
          case 'top': num = 3; break;
          case 'bottom': num = 1; break;
        }
      } else if (a == '2xBAR'){
        switch(p){
          case 'center': num = 4; break;
          case 'top': num = 5; break;
          case 'bottom': num = 3; break;
        }
      }else if (a == '7'){
        switch(p){
          case 'center': num = 6; break;
          case 'top': num = 7; break;
          case 'bottom': num = 5; break;
        }
      }else if (a == 'CHERRY'){
        switch(p){
          case 'center': num = 8; break;
          case 'top': num = 9; break;
          case 'bottom': num = 7; break;
        }
      }
    }
    return num;
  }

}
