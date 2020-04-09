import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentService } from '../services/document.service';
import { Subscription } from 'rxjs';
import { Document } from '../../../models/document';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  document: Document;
  private _docSub: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this._docSub = this.documentService.currentDocument.pipe(
      startWith({ id: '', doc: 'Select an existing document or create a new one to get started'})
    ).subscribe(document => this.document = document);
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  editDoc() {
    this.documentService.editDocument(this.document);
  }

}
