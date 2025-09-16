import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.css"],
})
export class CoursesComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() creationDate!: Date;
  @Input() duration!: number;
  @Input() authors: string[] = [];
  @Input() editable = false;

  @Output() clickOnShow = new EventEmitter<void>();

  onShowCourse() {
    this.clickOnShow.emit();
  }
}
