import { Annotation } from './annotation';

export class Finding {
  findingId: number;
  //finding_fields: Annotation[];
  findings: Annotation[];
  sexs: Annotation[];
  manifestations_finding: Annotation[];
  specimens: Annotation[];
  groups: Annotation[];
  study_testcds: Annotation[];
  study_domains: Annotation[];
  treatment_related_triggers: Annotation[];
  no_treatment_related_triggers: Annotation[];
  risk_levels: Annotation[];
  routes_of_administration: Annotation[];
  dose_quantitys: Annotation[];
  dose_frequencys: Annotation[];
  dose_durations: Annotation[];

}
