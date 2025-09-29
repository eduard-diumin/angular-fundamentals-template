import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { CoursesStoreService } from "@app/services/courses-store.service";
import {
  Author,
  Course,
  CreateCourseRequest,
} from "@app/services/courses.service";

@Component({
  selector: "app-course-form",
  templateUrl: "./course-form.component.html",
  styleUrls: ["./course-form.component.scss"],
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  submitted = false;
  allAuthors: Author[] = [];
  courseAuthors: Author[] = [];
  isEditMode = false;
  courseId: string | null = null;
  authors$: Observable<Author[]>;
  isLoading$: Observable<boolean>;

  constructor(
    public fb: FormBuilder,
    public library: FaIconLibrary,
    private route: ActivatedRoute,
    private router: Router,
    private coursesStoreService: CoursesStoreService
  ) {
    library.addIconPacks(fas);
    this.authors$ = this.coursesStoreService.authors$;
    this.isLoading$ = this.coursesStoreService.isLoading$;

    this.courseForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(2)]],
      description: ["", [Validators.required, Validators.minLength(2)]],
      duration: [0, [Validators.required, Validators.min(0)]],
      authors: this.fb.array([]),
      author: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern("^[a-zA-Z0-9]+$"),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.coursesStoreService.getAllAuthors();
    this.courseId = this.route.snapshot.params["id"];
    this.isEditMode = !!this.courseId;

    this.authors$.subscribe((authors) => {
      this.allAuthors = authors;
    });

    if (this.isEditMode && this.courseId) {
      this.loadCourse(this.courseId);
    }
  }

  private loadCourse(id: string): void {
    this.coursesStoreService.getCourse(id).subscribe((course) => {
      this.courseForm.patchValue({
        title: course.title,
        description: course.description,
        duration: course.duration,
      });

      // Set course authors
      this.courseAuthors = course.authors
        .map((authorId) =>
          this.allAuthors.find((author) => author.id === authorId)
        )
        .filter((author) => author !== undefined) as Author[];

      // Update form array
      this.authors.clear();
      this.courseAuthors.forEach((author) => {
        this.authors.push(new FormControl(author));
      });

      // Remove selected authors from available list
      this.allAuthors = this.allAuthors.filter(
        (author) =>
          !this.courseAuthors.some(
            (courseAuthor) => courseAuthor.id === author.id
          )
      );
    });
  }

  get authors(): FormArray {
    return this.courseForm.get("authors") as FormArray;
  }

  get newAuthorGroup(): FormGroup {
    return this.courseForm.get("newAuthor") as FormGroup;
  }

  addAuthorToCourse(author: Author) {
    this.courseAuthors.push(author);
    this.authors.push(new FormControl(author));
    this.allAuthors = this.allAuthors.filter((a) => a.id !== author.id);
  }

  removeAuthorFromCourse(author: Author, index: number) {
    this.allAuthors.push(author);
    this.courseAuthors = this.courseAuthors.filter((a) => a.id !== author.id);
    this.authors.removeAt(index);
  }

  createAuthor() {
    const authorControl = this.courseForm.get("author");
    const name = authorControl?.value;

    if (authorControl?.valid) {
      this.coursesStoreService.createAuthor(name).subscribe((newAuthor) => {
        this.allAuthors.push(newAuthor);
        authorControl.reset();
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.courseForm.valid && this.courseAuthors.length > 0) {
      const courseData: CreateCourseRequest = {
        title: this.courseForm.value.title,
        description: this.courseForm.value.description,
        duration: this.courseForm.value.duration,
        authors: this.courseAuthors.map((author) => author.id),
      };

      if (this.isEditMode && this.courseId) {
        this.coursesStoreService
          .editCourse(this.courseId, courseData)
          .subscribe(() => {
            this.router.navigate(["/courses"]);
          });
      } else {
        this.coursesStoreService.createCourse(courseData).subscribe(() => {
          this.router.navigate(["/courses"]);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(["/courses"]);
  }
}
