import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl } from "@angular/forms";
import { FieldType } from "@ngx-formly/material";

@Component({
  selector: "app-time-picker",
  templateUrl: "./time-picker.component.html",
  styleUrls: ["./time-picker.component.css"],
})
export class TimePickerComponent extends FieldType implements OnInit {
  myGroup: UntypedFormGroup = null;
  timePicker;
  selectedDate:Date = new Date();
  constructor() {
    super();
    this.myGroup = new UntypedFormGroup({
      fo: new UntypedFormControl(),
    });
  }

  async ngAfterViewInit() {
    this.init();
  }

  init() {

    // this.to.appearance = "outline";
  }

  dateChange(event) {
    this.formControl.setValue(event.dateString);
    const { change } = this.to;
    if (typeof change === "function") {
      this.to.change(this.field, event);
    }
  }

}
