/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FullFeaturesDmtComponent } from './full-features-dmt.component';

describe('FullFeaturesDmtComponent', () => {
  let component: FullFeaturesDmtComponent;
  let fixture: ComponentFixture<FullFeaturesDmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullFeaturesDmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullFeaturesDmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
