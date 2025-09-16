import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface CourseInfo {
  id: string;
  title: string;
  description: string;
  creationDate: Date;
  duration: number;
  authors: string[];
}

@Component({
  selector: "app-course-info",
  templateUrl: "./course-info.component.html",
  styleUrls: ["./course-info.component.scss"],
})
export class CourseInfoComponent {
  // Use the names for the input `course`.
  @Input() course!: CourseInfo;
  @Output() back = new EventEmitter<void>();

  onBack() {
    this.back.emit();
  }
}
