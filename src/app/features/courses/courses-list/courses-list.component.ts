import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface Course {
  id: string;
  title: string;
  description: string;
  creationDate: Date;
  duration: number;
  authors: string[];
}

@Component({
  selector: "app-courses-list",
  templateUrl: "./courses-list.component.html",
  styleUrls: ["./courses-list.component.css"],
})
export class CoursesListComponent {
  @Input() courses: Course[] = [];
  @Input() editable = false;

  @Output() showCourse = new EventEmitter<Course>();
  @Output() editCourse = new EventEmitter<Course>();
  @Output() deleteCourse = new EventEmitter<Course>();

  onShowCourse(course: Course) {
    this.showCourse.emit(course);
  }

  onEditCourse(course: Course) {
    this.editCourse.emit(course);
  }

  onDeleteCourse(course: Course) {
    this.deleteCourse.emit(course);
  }

  trackByCourseId(index: number, course: Course) {
    return course.id;
  }
}
