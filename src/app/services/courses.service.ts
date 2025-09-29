import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Course {
  id: string;
  title: string;
  description: string;
  creationDate: string;
  duration: number;
  authors: string[];
}

export interface Author {
  id: string;
  name: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  duration: number;
  authors: string[];
}

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  private readonly apiUrl = "http://localhost:4000/api";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  createCourse(course: CreateCourseRequest): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses`, course);
  }

  editCourse(id: string, course: CreateCourseRequest): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}`, course);
  }

  getCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`);
  }

  filterCourses(value: string): Observable<Course[]> {
    return this.http.get<Course[]>(
      `${this.apiUrl}/courses?search=${encodeURIComponent(value)}`
    );
  }

  getAllAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiUrl}/authors`);
  }

  createAuthor(name: string): Observable<Author> {
    return this.http.post<Author>(`${this.apiUrl}/authors`, { name });
  }

  getAuthorById(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/authors/${id}`);
  }
}
