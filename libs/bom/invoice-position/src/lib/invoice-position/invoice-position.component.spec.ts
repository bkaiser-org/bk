import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoicePositionComponent } from './invoice-position.component';

describe('InvoicePositionComponent', () => {
  let component: InvoicePositionComponent;
  let fixture: ComponentFixture<InvoicePositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePositionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
