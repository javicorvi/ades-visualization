import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Document } from '../document';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DocumentService } from '../document.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
//brat
declare var head: any;
declare var Util: any;



declare var jQuery: any;
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})



export class DocumentDetailComponent implements OnInit {

  @ViewChild('documentText', { static: false }) myDiv: ElementRef;

  @Input() document: Document;

  data: SafeHtml;

  constructor(private route: ActivatedRoute, private documentService: DocumentService, private location: Location, private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.getDocument();
    // var bratLocation = 'http://localhost:8001';
    var bratLocation = 'http://localhost:8001';
    console.log(head);
    head.js(
      // External libraries
      bratLocation + '/client/lib/jquery.min.js',
      bratLocation + '/client/lib/jquery.svg.min.js',
      bratLocation + '/client/lib/jquery.svgdom.min.js',

      // brat helper modules
      bratLocation + '/client/src/configuration.js',
      bratLocation + '/client/src/util.js',
      bratLocation + '/client/src/annotation_log.js',
      bratLocation + '/client/lib/webfont.js',

      // brat modules
      bratLocation + '/client/src/dispatcher.js',
      bratLocation + '/client/src/url_monitor.js',
      bratLocation + '/client/src/visualizer.js'
    );
    var webFontURLs = [
      bratLocation + '/static/fonts/Astloch-Bold.ttf',
      bratLocation + '/static/fonts/PT_Sans-Caption-Web-Regular.ttf',
      bratLocation + '/static/fonts/Liberation_Sans-Regular.ttf'
    ];
    var collData = {
      entity_types: [ {
              type   : 'Person',
              /* The labels are used when displaying the annotion, in this case
                  we also provide a short-hand "Per" for cases where
                  abbreviations are preferable */
              labels : ['Person', 'Per'],
              // Blue is a nice colour for a person?
              bgColor: '#7fa2ff',
              // Use a slightly darker version of the bgColor for the border
              borderColor: 'darken'
      } ]
  };


    var docData = {
          // Our text of choice
          text     : "Ed O'Kelley was the man who shot the man who shot Jesse James.",
          // The entities entry holds all entity annotations
          entities : [
              /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
                  note that range of the offsets are [${START},${END}) */
              ['T1', 'Person', [[0, 11]]],
              ['T2', 'Person', [[20, 23]]],
              ['T3', 'Person', [[37, 40]]],
              ['T4', 'Person', [[50, 61]]],
          ],
      };



      // tslint:disable-next-line: align
      head.ready(function() {
        Util.embed(
                // id of the div element where brat should embed the visualisations
                'data1',
                // object containing collection data
                collData,
                // object containing document data
                docData,
                // Array containing locations of the visualisation fonts
                webFontURLs
                );
        });

  }


  save(): void {
    this.documentService.updateDocument(this.document)
      .subscribe(() => this.goBack());
  }


  getDocument(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.documentService.getDocument(id)
      .subscribe(document => this.document = document);
  }

  findingSelected(finding): void {
    this.documentService.findingSelected(this.document.documentId, finding)
      .subscribe(text => this.data = this.sanitizer.bypassSecurityTrustHtml(text));

      var bratLocation = 'http://localhost:8001';
    console.log(head);
    head.js(
      // External libraries
      bratLocation + '/client/lib/jquery.min.js',
      bratLocation + '/client/lib/jquery.svg.min.js',
      bratLocation + '/client/lib/jquery.svgdom.min.js',

      // brat helper modules
      bratLocation + '/client/src/configuration.js',
      bratLocation + '/client/src/util.js',
      bratLocation + '/client/src/annotation_log.js',
      bratLocation + '/client/lib/webfont.js',

      // brat modules
      bratLocation + '/client/src/dispatcher.js',
      bratLocation + '/client/src/url_monitor.js',
      bratLocation + '/client/src/visualizer.js'
    );
    var webFontURLs = [
      bratLocation + '/static/fonts/Astloch-Bold.ttf',
      bratLocation + '/static/fonts/PT_Sans-Caption-Web-Regular.ttf',
      bratLocation + '/static/fonts/Liberation_Sans-Regular.ttf'
    ];
    var collData = {
      entity_types: [ {
              type   : 'Person',
              /* The labels are used when displaying the annotion, in this case
                  we also provide a short-hand "Per" for cases where
                  abbreviations are preferable */
              labels : ['Person', 'Per'],
              // Blue is a nice colour for a person?
              bgColor: '#7fa2ff',
              // Use a slightly darker version of the bgColor for the border
              borderColor: 'darken'
      } ]
  };


    var docData = {
          // Our text of choice
          text     : "Ed O'Kelley was the man who shot the man who shot Jesse James.",
          // The entities entry holds all entity annotations
          entities : [
              /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
                  note that range of the offsets are [${START},${END}) */
              ['T1', 'Person', [[0, 11]]],
              ['T2', 'Person', [[20, 23]]],
              ['T3', 'Person', [[37, 40]]],
              ['T4', 'Person', [[50, 61]]],
          ],
      };



      // tslint:disable-next-line: align
      head.ready(function() {
        Util.embed(
                // id of the div element where brat should embed the visualisations
                'data2',
                // object containing collection data
                collData,
                // object containing document data
                docData,
                // Array containing locations of the visualisation fonts
                webFontURLs
                );
        });

  }
  goBack(): void {
    this.location.back();
  }

}
