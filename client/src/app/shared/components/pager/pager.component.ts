import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShopParams } from '../../models/shopParams';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
  @Input() shopParams: ShopParams;
  @Output() pagedChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  onPagerChanged(event: any) {
    const pageNumber = event.page;
    this.shopParams.pageNumber = pageNumber;
    this.pagedChanged.emit(pageNumber);
  }
}
