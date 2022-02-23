import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES, findLessonsForCourse, LESSONS} from '../../../../server/db-data';
import {Course} from '../model/course';
import {errorObject} from 'rxjs/internal-compatibility';
import {HttpErrorResponse} from '@angular/common/http';
import {enableProdMode} from '@angular/core';

describe('CoursesService', () => {

  let coursesService: CoursesService;
  let httpTestController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    coursesService.findAllCourses().subscribe(courses => {
      expect(courses).toBeTruthy('No courses Found');
      expect(courses.length).toBe(12, 'Incorrect number of courses' );

      const course = courses.find(item => item.id === 12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });
    const req = httpTestController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');

    req.flush({payload: Object.values(COURSES)});
  });

  it('should find course by id', () =>{
    coursesService.findCourseById(12).subscribe(course => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const req = httpTestController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');
    req.flush(COURSES[12]);

  });

  it('should save the course', () => {
    const changes: Partial<Course> = {titles: {description: 'Testing Angular'}};
    coursesService.saveCourse(12, changes).subscribe(course => {
      expect(course.id).toBe(12);
    });

    const req = httpTestController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);

    req.flush({
      ...COURSES[12],
      ...changes
    });
  });

  it('should give error if save fails', () => {
    const changes: Partial<Course> = {titles: {description: 'Testing Angular'}};
    coursesService.saveCourse(12, changes).subscribe(() => fail('save failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

    const req = httpTestController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');

    req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'});
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12).subscribe(lesson => {
      expect(lesson).toBeTruthy();
      expect(lesson.length).toBe(3);
    });

    const req = httpTestController.expectOne(request => request.url === '/api/lessons');

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });
  });

  afterEach(() => {
    httpTestController.verify();
  });
});
