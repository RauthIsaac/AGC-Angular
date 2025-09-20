import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServingSectors } from './serving-sectors';

describe('ServingSectors', () => {
  let component: ServingSectors;
  let fixture: ComponentFixture<ServingSectors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServingSectors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServingSectors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
