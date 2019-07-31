import {Finding} from './finding';
export class Document {
  documentId: number;
  name: string;
  text: string;
  textWithAnnotations: string;
  findings: Finding[];
}
