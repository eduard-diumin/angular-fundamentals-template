import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

interface Author {
  id: string;
  name: string;
}

@Component({
  selector: "app-course-form",
  templateUrl: "./course-form.component.html",
  styleUrls: ["./course-form.component.scss"],
})
export class CourseFormComponent {
  constructor(public fb: FormBuilder, public library: FaIconLibrary) {
    library.addIconPacks(fas);

    this.courseForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(2)]],
      description: ["", [Validators.required, Validators.minLength(2)]],
      duration: [0, [Validators.required, Validators.min(0)]],
      authors: this.fb.array([]),
      newAuthor: this.fb.group({
        name: [
          "",
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern("^[a-zA-Z0-9]+$"),
          ],
        ],
      }),
    });
  }
  courseForm!: FormGroup;
  submitted = false;

  allAuthors: Author[] = [];
  courseAuthors: Author[] = [];
  // Use the names `title`, `description`, `author`, 'authors' (for authors list), `duration` for the form controls.
  ngOnInit(): void {
    // Mock data for authors
    this.allAuthors = [
      { id: "1", name: "JohnDoe" },
      { id: "2", name: "JaneSmith" },
    ];
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
    const name = this.newAuthorGroup.get("name")?.value;
    if (this.newAuthorGroup.valid) {
      const newAuthor: Author = {
        id: Math.random().toString(36).substring(2, 10),
        name,
      };
      this.allAuthors.push(newAuthor);
      this.newAuthorGroup.reset();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.courseForm.valid && this.courseAuthors.length > 0) {
      console.log(this.courseForm.value);
    }
  }
}
