import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingTabulatorComponent } from './finding-tabulator.component';

describe('FindingTabulatorComponent', () => {
  let component: FindingTabulatorComponent;
  let fixture: ComponentFixture<FindingTabulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindingTabulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingTabulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
