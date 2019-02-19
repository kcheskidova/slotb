import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style } from '@angular/animations';

@Component({
  selector: 'app-slotb-reel',
  templateUrl: './reel.component.html',
  styleUrls: ['./reel.component.scss'],
})
export class ReelComponent implements OnInit {

  protected _selected = 0;

  @Input()
  rotate = false;

  arr = [
    '3xBAR.png',
    'BAR.png',
    '2xBAR.png',
    '7.png',
    'Cherry.png'
  ];
  
  @Input()
  set selected(n: number){
    let wasSelected = this._selected;
    this._selected = n;
  }

  get cherryChosen() {
    if (this.rotate) return 'rotating';
    return 'select'+(this._selected + 1);// + (this.rotate?' rotating':'');
  }

  constructor() { }

  ngOnInit() {
  }

  public animateToNum(st: number, duration: number) {

  }

}
