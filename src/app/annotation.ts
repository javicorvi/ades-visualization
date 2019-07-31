import { Feature } from './feature';

export class Annotation {
  text: string;
  startOffset: number;
  endOffset: number;
  features: Feature[];
}
