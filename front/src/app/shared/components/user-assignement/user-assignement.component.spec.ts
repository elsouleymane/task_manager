import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignementComponent } from './user-assignement.component';

describe('UserAssignementComponent', () => {
  let component: UserAssignementComponent;
  let fixture: ComponentFixture<UserAssignementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAssignementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAssignementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
