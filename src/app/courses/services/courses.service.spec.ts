import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES} from '../../../../server/db-data';
import {Course} from '../model/course';

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

  it('should save tha course', () => {
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

  afterEach(() => {
    httpTestController.verify();
  });
});
