import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompetitionLevelComponent } from './competition-level.component';

describe('CompetitionLevelComponent', () => {
  let component: CompetitionLevelComponent;
  let fixture: ComponentFixture<CompetitionLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionLevelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompetitionLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
