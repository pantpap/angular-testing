import {ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnersCourses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advanceCourses = setupCourses().filter(course => course.category === 'ADVANCED');

  beforeEach(waitForAsync (() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);
    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{
        provide: CoursesService, useValue: coursesServiceSpy
      }]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesService = TestBed.inject(CoursesService);
    });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display only beginner courses', () => {
    coursesService.findAllCourses.and.returnValue(of(beginnersCourses));

    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Wrong number of tabs');
  });

  it('should display only advanced courses', () => {
    coursesService.findAllCourses.and.returnValue(of(advanceCourses));

    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Wrong number of tabs');
  });


  it('should display both tabs', () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(2, 'Wrong number of tabs');
  });


  it('should display advanced courses when tab clicked', () => {
    coursesService.findAllCoursesa.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    el.nativeElement.click(tabs[1]);
    const cardTitles = el.queryAll(By.css('.mat-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0, 'Card titles must be exist');
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  });

});


