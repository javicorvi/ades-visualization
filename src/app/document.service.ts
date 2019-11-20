import { Injectable } from '@angular/core';
import { Document } from './document';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Finding } from './finding';
import { DomSanitizer } from '@angular/platform-browser';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documentsUrl = 'http://localhost:8090/documents/';  // URL to web api



  constructor(private http: HttpClient, private messageService: MessageService) { }

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.documentsUrl).pipe(
      tap(_ => this.log('fetched documents')),
      catchError(this.handleError<Document[]>('getDocuments', []))
    );
  }

  /** Log a DocumentService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }



  /** GET document by id. Will 404 if id not found */
  getDocument(id: number): Observable<Document> {
    const url = `${this.documentsUrl}/${id}`;
    return this.http.get<Document>(url).pipe(
      tap(_ => this.log(`fetched document id=${id}`)),
      catchError(this.handleError<Document>(`getDocument id=${id}`))
    );
  }

    /** GET Snipped of finding selected */
    findingSelected(id: number, finding: Finding): Observable<string> {
      const url = `${this.documentsUrl}/${id}/finding/${finding.findingId}`;
      return this.http.get(url , {responseType: 'text'}).pipe(
         tap(_ => this.log(`fetched finding id=${finding.findingId}`)),
         catchError(this.handleError<string>(`getFinding id=${finding.findingId}`))
      );
    }

    /** GET Snipped of finding selected */
    findingSelected2(id: number, finding: Finding): Observable<string> {
      const url = `${this.documentsUrl}/${id}/finding2/${finding.findingId}`;
      return this.http.get(url , {responseType: 'text'}).pipe(
         tap(_ => this.log(`fetched finding id=${finding.findingId}`)),
         catchError(this.handleError<string>(`getFinding id=${finding.findingId}`))
      );
    }

  /** PUT: update the document on the server */
  updateDocument(document: Document): Observable<any> {
    return this.http.put(this.documentsUrl, document, httpOptions).pipe(
      tap(_ => this.log(`updated document id=${document.documentId}`)),
      catchError(this.handleError<any>('updateDocument'))
    );
  }

  /** POST: add a new document to the server */
  addDocument(document: Document): Observable<Document> {
    return this.http.post<Document>(this.documentsUrl, document, httpOptions).pipe(
      tap((newDocument: Document) => this.log(`added document w/ id=${newDocument.documentId}`)),
      catchError(this.handleError<Document>('addDocument'))
    );
  }

  /** DELETE: delete the document from the server */
  deleteDocument(document: Document | number): Observable<Document> {
    const id = typeof document === 'number' ? document : document.documentId;
    const url = `${this.documentsUrl}/${id}`;

    return this.http.delete<Document>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted document id=${id}`)),
      catchError(this.handleError<Document>('documentHero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead
    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);
    // Let the app keep running by returning an empty result.
    return of(result as T);
    };
  }

}
