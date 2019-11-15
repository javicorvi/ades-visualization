import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Document } from '../document';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DocumentService } from '../document.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {MatTooltipModule} from '@angular/material/tooltip';
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
    var bratLocation = 'http://localhost:8001';

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


    collData['entity_attribute_types'] = [ {
    type  : 'Notorious',
    /* brat supports multi-valued attributes, but in our case we will only
        use a single value and add a glyph to the visualisation to indicate
        that the entity carries that attribute */
    values: { 'Notorious': { 'glyph': '★' } }
    } ];


    docData['attributes'] = [
    // Format: [${ID}, ${TYPE}, ${TARGET}]
    ['A1', 'Notorious', 'T4']
    ];

    collData['relation_types'] = [ {
    type     : 'Anaphora',
    labels   : ['Anaphora', 'Ana'],
    // dashArray allows you to adjust the style of the relation arc
    dashArray: '3,3',
    color    : 'purple',
    /* A relation takes two arguments, both are named and can be constrained
        as to which types they may apply to */
    args     : [
        //
        {role: 'Anaphor', targets: ['Person'] },
        {role: 'Entity',  targets: ['Person'] }
    ]
    } ];

    docData['relations'] = [
    // Format: [${ID}, ${TYPE}, [[${ARGNAME}, ${TARGET}], [${ARGNAME}, ${TARGET}]]]
    ['R1', 'Anaphora', [['Anaphor', 'T2'], ['Entity', 'T1']]]
    ];

    collData['event_types'] = [ {
    type   : 'Assassination',
    labels : ['Assassination', 'Assas'],
    bgColor: 'lightgreen',
    borderColor: 'darken',
    /* Unlike relations, events originate from a span of text and can take
        several arguments */
    arcs   : [
        {type: 'Victim', labels: ['Victim','Vict'] },
        // Just like the event itself, its arguments can be styled
        {type: 'Perpetrator', labels: ['Perpetrator','Perp'], color: 'green' }
    ]
    } ];


    /* Events also have trigger annotations, these are spans that are not
    visualised. This enables sharing of triggers when this is desirable, such
    as in the sentence "He robbed the bank and the post office", where
    "robbed" gives rice to two separate events that shares a single trigger */
    docData['triggers'] = [
    // The format is identical to that of entities
    ['T5', 'Assassination', [[45, 49]]],
    ['T6', 'Assassination', [[28, 32]]]
    ];

    docData['events'] = [
    // Format: [${ID}, ${TRIGGER}, [[${ARGTYPE}, ${ARGID}], ...]]
    ['E1', 'T5', [['Perpetrator', 'T3'], ['Victim', 'T4']]],
    ['E2', 'T6', [['Perpetrator', 'T2'], ['Victim', 'T3']]]
    ];

    var webFontURLs = [
      bratLocation + '/static/fonts/Astloch-Bold.ttf',
      bratLocation + '/static/fonts/PT_Sans-Caption-Web-Regular.ttf',
      bratLocation + '/static/fonts/Liberation_Sans-Regular.ttf'
    ];



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
      //.subscribe(text => this.document.text = text['text']);
  }
  goBack(): void {
    this.location.back();
  }

}
