import { Component, OnInit, ViewChild} from '@angular/core';
import { Document } from '../document';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  selectedDocument: Document;
  documents: Document[];

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.getDocuments();
  }

  onSelect(document: Document): void {
    this.selectedDocument = document;
  }

  getDocuments(): void {
    this.documentService.getDocuments().subscribe(documents => this.documents = documents);

  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.documentService.addDocument({ name } as Document)
      .subscribe(hero => {
        this.documents.push(hero);
      });
  }

  delete(document: Document): void {
    this.documents = this.documents.filter(h => h !== document);
    this.documentService.deleteDocument(document).subscribe();
  }

}
