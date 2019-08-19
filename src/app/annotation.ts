import { Feature } from './feature';

export class Annotation {
  value: string;
  text: string;
  startOffset: number;
  endOffset: number;
  features: Feature[];
}
