import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Document } from '../document';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DocumentService } from '../document.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as $ from 'jquery';
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

  static collData: any;

  static webFontURLs: any;

  @ViewChild('documentText', { static: false }) myDiv: ElementRef;

  @Input() document: Document;

  data: SafeHtml;

  docData: string;

  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private documentService: DocumentService, private location: Location, private sanitizer: DomSanitizer) {
    const bratLocation = 'http://localhost:8001'
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

    DocumentDetailComponent.webFontURLs = [
      bratLocation + '/static/fonts/Astloch-Bold.ttf',
      bratLocation + '/static/fonts/PT_Sans-Caption-Web-Regular.ttf',
      bratLocation + '/static/fonts/Liberation_Sans-Regular.ttf'
    ];

    DocumentDetailComponent.collData = {
      entity_types: [
        {
              type   : 'Finding',
              /* The labels are used when displaying the annotion, in this case
                  we also provide a short-hand "Per" for cases where
                  abbreviations are preferable */
              labels : ['FINDING', 'FIND'],
              // Blue is a nice colour for a person?
              bgColor: '#5F9EA0',
              // Use a slightly darker version of the bgColor for the border
              borderColor: 'darken'
      }, {
              type   : 'Study_testcd', labels : ['STUDY_TESTCD', 'STC'], bgColor: '#8A2BE2', borderColor: 'darken'
          }, {
              type   : 'Specimen', labels : ['SPECIMEN', 'SPE'], bgColor: '#FF7F50', borderColor: 'darken'
          } , {
              type   : 'Sex', labels : ['SEX', 'SEX'], bgColor: '#556B2F', borderColor: 'darken'
          } , {
              type   : 'Manifestation', labels : ['MANIFESTATION_FINDING', 'MAN'], bgColor: '#FF1493', borderColor: 'darken'
          } , {
            type   : 'Group', labels : ['GROUP', 'GR'], bgColor: '#FF1493', borderColor: 'darken'
          }
    ]
  };


    DocumentDetailComponent.collData['entity_attribute_types'] = [ {
          type  : 'Notorious',
          /* brat supports multi-valued attributes, but in our case we will only
              use a single value and add a glyph to the visualisation to indicate
              that the entity carries that attribute */
          values: { 'Notorious': { 'glyph': '★' } }
      } ];


    DocumentDetailComponent.collData['relation_types'] = [ {
        type     : 'Relation',
        labels   : ['R', 'R'],
        // dashArray allows you to adjust the style of the relation arc
        dashArray: '3,3',
        color    : 'purple',
        /* A relation takes two arguments, both are named and can be constrained
            as to which types they may apply to */
        args     : [
            //
            {role: 'Entity', targets: ['FINDING', 'STUDY_TESTCD'] },
            {role: 'Subentity',  targets: ['SPECIMEN', 'SEX', 'MANIFESTATION_FINDING'] }
        ]
    } ];


  }

  ngOnInit() {
    this.getDocument();
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

    this.documentService.findingSelected2(this.document.documentId, finding)
      .subscribe(text => {
        this.docData = text;
        console.log(this.docData);
        console.log(JSON.parse(this.docData));
        document.getElementById('data1').innerHTML = '';
        document.getElementById('data1').className = '';
        var j = JSON.parse(this.docData);
        Util.embed('data1' , DocumentDetailComponent.collData, j, DocumentDetailComponent.webFontURLs);
      });
  }
  goBack(): void {
    this.location.back();
  }

}
