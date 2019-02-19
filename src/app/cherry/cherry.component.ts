import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-slotb-cherry',
  templateUrl: './cherry.component.html',
  styleUrls: ['./cherry.component.scss']
})
export class CherryComponent implements OnInit {

  protected _img: string;

  @Input()
  set img(src: string) {
    this._img = 'assets/images/'+src;
  }

  get img() {
    return this._img;
  }

  constructor() { }

  ngOnInit() {
  }


}
