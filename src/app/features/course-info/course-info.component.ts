import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { CoursesStoreService } from "@app/services/courses-store.service";
import { Course } from "@app/services/courses.service";

@Component({
  selector: "app-course-info",
  templateUrl: "./course-info.component.html",
  styleUrls: ["./course-info.component.scss"],
})
export class CourseInfoComponent implements OnInit {
  course$: Observable<Course> | null = null;
  isLoading$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesStoreService: CoursesStoreService
  ) {
    this.isLoading$ = this.coursesStoreService.isLoading$;
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.params["id"];
    if (courseId) {
      this.course$ = this.coursesStoreService.getCourse(courseId);
    }
  }

  onBack(): void {
    this.router.navigate(["/courses"]);
  }
}
