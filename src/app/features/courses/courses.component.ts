import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CoursesStoreService } from "@app/services/courses-store.service";
import { UserStoreService } from "@app/user/services/user-store.service";
import { AuthService } from "@app/auth/services/auth.service";
import { Course } from "@app/services/courses.service";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.css"],
})
export class CoursesComponent implements OnInit {
  courses$: Observable<Course[]>;
  isLoading$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isAuthorized$: Observable<boolean>;

  constructor(
    private coursesStoreService: CoursesStoreService,
    private userStoreService: UserStoreService,
    private authService: AuthService,
    private router: Router
  ) {
    this.courses$ = this.coursesStoreService.courses$;
    this.isLoading$ = this.coursesStoreService.isLoading$;
    this.isAdmin$ = this.userStoreService.isAdmin$;
    this.isAuthorized$ = this.authService.isAuthorized$;
  }

  ngOnInit(): void {
    this.coursesStoreService.getAll();
    this.userStoreService.getUser();
  }

  onSearch(searchValue: string): void {
    if (searchValue.trim()) {
      this.coursesStoreService.filterCourses(searchValue);
    } else {
      this.coursesStoreService.getAll();
    }
  }

  onAddCourse(): void {
    this.router.navigate(["/courses/add"]);
  }

  onShowCourse(course: Course): void {
    this.router.navigate(["/courses", course.id]);
  }

  onEditCourse(course: Course): void {
    this.router.navigate(["/courses/edit", course.id]);
  }

  onDeleteCourse(course: Course): void {
    if (confirm("Are you sure you want to delete this course?")) {
      this.coursesStoreService.deleteCourse(course.id).subscribe(() => {
        // Course deleted successfully
      });
    }
  }
}
