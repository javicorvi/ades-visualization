import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, AfterContentInit } from '@angular/core';
import { Document } from '../document';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DocumentService } from '../document.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


import * as $ from 'jquery';
import { Finding } from '../finding';
//brat
declare var head: any;
declare var Util: any;

var displaySpanComment = function (evt, target, spanId, spanType, mods, spanText, commentText, commentType, normalizations) {
	  var left  = evt.clientX  + "px";
    var top  = evt.clientY  + "px";
	  var div = document.getElementById('commentpopup');
	  div.style.left = left;
    div.style.top = top;
    // $("#commentpopup").toggle();
    div.innerHTML=spanId + ' - ' + spanType + ' - ' + spanText;
    div.style.display='block';
}

var hideComment = function (evt, target, spanId, spanType, mods, spanText, commentText, commentType, normalizations) {
	var div = document.getElementById('commentpopup');
	div.style.display = 'none';
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

declare var jQuery: any;
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css', '../brat-v1.3_Crunchy_Frog/style-vis.css']
})


export class DocumentDetailComponent implements OnInit {


  static collData: any;

  static webFontURLs: any;

  @ViewChild('documentText', { static: false }) myDiv: ElementRef;

  @Input() document: Document;

  data: SafeHtml;

  docData: string;

  tableData: any[] = [];



  columnNames: any[] = [
    {formatter: 'responsiveCollapse', headerSort: false},

    {width: 5, align: 'center', cellClick: function(e, cell){alert('This Finding is manually curated as OKEY !')},
    formatter: function(cell, formatterParams, onRendered){
      return '<i class="fa fa-check" style="color:green" aria-hidden="true"> </i>';
     }},
    {width: 5, align: 'center', cellClick: function(e, cell) {alert('This Finding is manually curated as a wrong detection !');  } ,
    formatter: function(cell, formatterParams, onRendered) {
      return '<i class="fa fa-times" style="color:red" aria-hidden="true"> </i>';
     }},

     {width: 5, align: 'center', cellClick: function(e, cell){alert('This will enable the edition'); cell.formatter='<i class="fa fa-edit" style="color:red" aria-hidden="true"> </i>'},
      formatter: function(cell, formatteexport, onRendered){
      return '<i class="fa fa-edit" style="color:blue" aria-hidden="true"> </i>';
     }},

    { title: 'Id', field: 'id' },
    { title: 'Finding', field: 'finding', headerSort: false , headerFilter: true, editor: 'input', editable: function(e, cell) {
        return false;
    }

    },
    { title: 'Study TestCD', field: 'study_testcd' , headerSort: false , headerFilter: true , editor: true},
    { title: 'Manifestation of Finding', field: 'manifestation_finding' , headerSort: false, headerFilter: true,  editor: 'select', editorParams:[
      'Increase',
      'Decrease',
      'Present'
    ]},
    { title: 'Study Domain', field: 'study_domain' , headerSort: false, headerFilter: true,  editor: 'select', editorParams:[
      'Body Weight',
      'Body Weight Gain',
      'Cardiovascular Domain',
      'Clinical Domain',
      'Death Diagnosis',
      'ECG Domain',
      'Food and Water Comsumption',
      'Laboratory Domain',
      'Macroscopic Domain',
      'Microscopic Domain',
      'Organ Measurement',
      'Respiratory Domain',
      'Tumor Findings',
      'Vital Signs'
    ]},
    { title: 'Specimen', field: 'specimen' , headerSort: false , headerFilter: true, editor: 'select', editorParams: [
      'LIVER',
      'HEART',
      'PAROTID_GLAND',
      'SERUM',
      'BONE',
      'STOMACH',
      'KIDNEY',
      'ORAL_CAVITY',
      'SKIN',
      'NOSE',
      'WHOLE_ANIMAL'
    ]},
    { title: 'Sex', field: 'sex' , headerSort: false , headerFilter: true, editor: 'select', editorParams:[
      'F',
      'M'
    ]},
    { title: 'Dose', field: 'dose' , headerSort: false , headerFilter: true},
    { title: 'Group', field: 'group' , headerSort: false , headerFilter: true},
    { title: 'Is Treatement Related', field: 'is_trf' , headerSort: false , headerFilter: true, editor: 'select', editorParams: [
      'U(Uncertain)',
      'Y(Treatment-related))',
      'N(No Treatment-related))'
    ]}
  ];

 // table: FindingTabulatorComponent;

  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private documentService: DocumentService, private location: Location, private sanitizer: DomSanitizer) {
    const bratLocation = 'http://localhost:8001';
    // const bratLocation = 'http://localhost:8001';
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
              type   : 'FINDING',
              /* The labels are used when displaying the annotion, in this case
                  we also provide a short-hand "Per" for cases where
                  abbreviations are preferable */
              labels : ['FINDING', 'FIND'],
              // Blue is a nice colour for a person?
              bgColor: '#eb656c',
              // Use a slightly darker version of the bgColor for the border
              borderColor: 'darken'
      }, {
              type   : 'STUDY_TESTCD', labels : ['STUDY_TESTCD', 'STC'], bgColor: '#e8b6f0', borderColor: 'darken'
          }, {
              type   : 'SPECIMEN', labels : ['SPECIMEN', 'SPE'], bgColor: '#79aef7', borderColor: 'darken'
          } , {
              type   : 'SEX', labels : ['SEX', 'SEX'], bgColor: '#f5f05f', borderColor: 'darken'
          } , {
              type   : 'MANIFESTATION_FINDING', labels : ['MANIFESTATION_FINDING', 'MAN'], bgColor: '#f0a141', borderColor: 'darken'
          } , {
              type   : 'GROUP', labels : ['GROUP', 'GR'], bgColor: '#edfcb8', borderColor: 'darken'
          }, {
              type   : 'OBSERVATION_QUALIFICATION', labels : ['OBSERVATION_QUALIFICATION', 'QUA'], bgColor: '#edfcb8', borderColor: 'darken'
          }, {
              type   : 'STUDY_DAY_FINDING', labels : ['STUDY_DAY_FINDING', 'SDAY'], bgColor: '#edfcb8', borderColor: 'darken'
          }, {
              type   : 'STATISTICAL_SIGNIFICANCE', labels : ['STATISTICAL_SIGNIFICANCE', 'STATS'], bgColor: '#edfcb8', borderColor: 'darken'
          }
    ]
  };


    DocumentDetailComponent.collData['entity_attribute_types'] = [ {
          type  : 'Notorious',
          /* brat supports multi-valued attributes, but in our case we will only
              use a single value and add a glyph to the visualisation to indicate
              that the entity carries that attribute */
          values: { Notorious: { glyph: '★' } }
      } ];


    DocumentDetailComponent.collData['relation_types'] = [ {
        type     : 'Relation',
        labels   : ['R', 'R'],
        // dashArray allows yoFindingTabulatorComponent the relation arc
        dashArray: '3,3',
        color    : 'purple',
        /* A relation takes two arguments, both are named and can be constrained
            as to which types they may apply to */
        args     : [
            //
            {role: 'Entity', targets: ['FINDING', 'STUDY_TESTCD'] },
            // tslint:disable-next-line: max-line-length
            {role: 'Subentity',  targets: ['SPECIMEN', 'SEX', 'MANIFESTATION_FINDING', 'GROUP', 'OBSERVATION_QUALIFICATION', 'STUDY_DAY_FINDING', 'STATISTICAL_SIGNIFICANCE'] }
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
      .subscribe(document => {
        this.document = document;
        var data = [];
        document.findings.forEach(find => {
          data.push({
                  id : find.findingId,
                  finding: find.finding != null ? find.finding.value : '',
                  study_testcd: find.study_testcd != null ? find.study_testcd.value : '',
                  manifestation_finding: find.manifestation_finding != null ? find.manifestation_finding.value : '',
                  study_domain: find.study_domain != null ? find.study_domain.value : '',
                  specimen: find.specimen != null ? find.specimen.value : '',
                  sex: find.sex != null ? find.sex.value : '',
                  dose: find.dose != null ? find.dose.value : '',
                  group: find.group != null ? find.group.value : '',
                  is_trf: find.is_treatment_related != null ? find.is_treatment_related.value : ''
          });
        });
        //alert(data);
        //alert(JSON.stringify(data));

        this.tableData = data;
        //this.clear();
        //alert(JSON.stringify(document.findings));
        //var j = JSON.parse('{ text:' + document.text + '}');
        // var j = { text: document.text };
        // head.ready( function() {
        //   const dispatcher = Util.embed('data1' , DocumentDetailComponent.collData, j, DocumentDetailComponent.webFontURLs);
        //   dispatcher.on('displaySpanComment', displaySpanComment);
        //   dispatcher.on('hideComment', hideComment);
        // });
      });
  }

  rowClick(dataRow: any): void {
    const finding = new Finding();
    finding.findingId = dataRow.id;
    this.findingSelected(finding);
  }


  findingSelected(finding): void {
    this.documentService.findingSelected2(this.document.documentId, finding)
      .subscribe(text => {
        this.docData = text;
        console.log(this.docData);
        // console.log(JSON.parse(this.docData));
        document.getElementById('data2').className = 'collapse show';
        document.getElementById('data1').innerHTML = '';
        document.getElementById('data1').className = '';
        var j = JSON.parse(this.docData);
        head.ready( function() {
          const dispatcher = Util.embed('data1' , DocumentDetailComponent.collData, j, DocumentDetailComponent.webFontURLs);
          dispatcher.on('displaySpanComment', displaySpanComment);
          dispatcher.on('hideComment', hideComment);
        });
      });
  }
  goBack(): void {
    this.location.back();
  }
  clear(): void {
    var j = { text: this.document.text };
    head.ready( function() {
      document.getElementById('data1').innerHTML = '';
      document.getElementById('data1').className = '';
      Util.embed('data1' , DocumentDetailComponent.collData, j, DocumentDetailComponent.webFontURLs);
    });
  }
}

