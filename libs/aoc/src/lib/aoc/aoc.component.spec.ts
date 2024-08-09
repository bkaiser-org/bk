import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AocComponent } from './aoc.component';

describe('AocComponent', () => {
  let component: AocComponent;
  let fixture: ComponentFixture<AocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AocComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
