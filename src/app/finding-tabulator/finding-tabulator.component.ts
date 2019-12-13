import { Component, Input, OnChanges, SimpleChanges, OnInit, EventEmitter, Output } from '@angular/core';
import Tabulator from 'tabulator-tables';
import * as $ from 'jquery';




/**
 * This is a wrapper class for the tabulator JS library.
 * For more info see http://tabulator.info
 */
@Component({
  selector: 'app-finding-tabulator',
  templateUrl: './finding-tabulator.component.html',
  styleUrls: ['./finding-tabulator.component.css']
})
export class FindingTabulatorComponent implements OnChanges {

  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];
  @Input() height = '600px';
  // list properties you want to set per implementation here...

  @Output() rowClickEvent = new EventEmitter();

  tab = document.createElement('div');

  constructor() {
  }

  ngOnInit(): void {
    this.drawTable(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.drawTable(this);
  }


  private drawTable(findingTab): void {
    const table = new Tabulator(this.tab, {
      data: this.tableData,
      columns: this.columnNames,
      layout: 'fitDataFill',
      responsiveLayout: 'collapse',
      responsiveLayoutCollapseStartOpen: false,
      height: this.height,
      resizableColumns: true,
      pagination: 'local',
      movableColumns: true,
      selectable: 1,
      paginationSize: 10,
      paginationSizeSelector: [5, 10, 20, 40],
      rowClick: function(e: any, row: any) {
        findingTab.rowClickEvent.emit(row.getData());
      }
    });

    document.getElementById('my-tabular-table').appendChild(this.tab);
    table.redraw(true);
  }

}
