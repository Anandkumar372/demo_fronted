import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Student, StudentService } from '../student.service';

@Component({
  selector: 'app-studentreg',
  templateUrl: './studentreg.component.html',
  styleUrl: './studentreg.component.scss'
})
export class StudentregComponent {
  previewSrc: string | ArrayBuffer | null = null;
  uploading = false;

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    photo: [null as File | null]
  });
  students: Student[] | undefined;

  constructor(private fb: FormBuilder, private api: StudentService) {
    this.refresh();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.form.patchValue({ photo: file });

    const reader = new FileReader();
    reader.onload = () => (this.previewSrc = reader.result);
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) return;
    this.uploading = true;
    const { firstName, lastName, email } = this.form.value;
    this.api.create({
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      photo: this.form.value.photo ?? undefined
    }).subscribe({
      next: () => { this.form.reset(); this.previewSrc = null; this.uploading = false; this.refresh(); },
      error: (err) => { console.error(err); this.uploading = false; }
    });
  }

  refresh() {
    this.api.list().subscribe(s => this.students = s);
  }

  imageUrl(s: Student) {  
    console.log(s);
     //return `http://localhost:9090/api/students/${s.id}/photo`;
    //return `http://192.168.31.205:9090/api/students/${s.id}/photo`;

    return `http://localhost:6565/demobackend/api/students/${s.id}/photo`;
  }
}


