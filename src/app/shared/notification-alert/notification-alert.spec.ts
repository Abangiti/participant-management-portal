import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationAlert } from './notification-alert';

describe('NotificationAlert', () => {
  let component: NotificationAlert;
  let fixture: ComponentFixture<NotificationAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationAlert],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
