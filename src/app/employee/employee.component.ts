import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee.model';
import { NgForm } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  isCreateEmployee: boolean = true;
  employee: Employee = {
    employeeId: 0,
    employeeName: '',
    employeeContactNumber: '',
    employeeAddress: '',
    employeeDepartment: '',
    employeeGender: '',
    employeeSkills: '',
    file: undefined
  };
  selectedFile: File | null = null;
  previewUrl: any = null;
  skills: string[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const data = this.activatedRoute.snapshot.data['employee'];
    if (data && data.employeeId > 0) {
      this.employee = data;
      this.isCreateEmployee = false;
      this.skills = this.employee.employeeSkills ? this.employee.employeeSkills.split(',') : [];
    }
  }

  checkSkills(skill: string): boolean {
    return this.skills.includes(skill);
  }

  checkGender(gender: string): boolean {
    return this.employee.employeeGender === gender;
  }

  selectGender(gender: string): void {
    this.employee.employeeGender = gender;
  }

  onSkillsChanges(event: any): void {
    const value = event.source.value;
    if (event.checked) {
      if (!this.skills.includes(value)) {
        this.skills.push(value);
      }
    } else {
      this.skills = this.skills.filter(skill => skill !== value);
    }
    this.employee.employeeSkills = this.skills.join(',');
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

 

  saveEmployees(employeeForm: NgForm): void {
    const formData = new FormData();
  
    // Append employee as JSON string
    formData.append('employee', new Blob([JSON.stringify(this.employee)], { type: 'application/json' }));
  
    // Append selected file if exists
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
  
    if (this.isCreateEmployee) {
      this.employeeService.saveEmployees(formData).subscribe({
        next: (res: Employee) => {
          console.log(res);
          employeeForm.resetForm();
          this.skills = [];
          this.previewUrl = null;
          this.router.navigate(['/employee-list']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error saving employee:', err);
        }
      });
    } else {
      this.employeeService.updateEmployees(formData).subscribe({
        next: (res: Employee) => {
          console.log('Updated:', res);
          this.router.navigate(['/employee-list']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating employee:', err);
        }
      });
    }
  }




  saveEmployee(employeeForm: NgForm): void {

    // Append selected file if exists
    if (this.selectedFile) {
      this.employee.file = this.selectedFile;
      
    }

    if (this.isCreateEmployee) {
      this.employeeService.saveEmployee(this.employee).subscribe({
        next: (res: Employee) => {
          console.log(res);
          employeeForm.resetForm();
          this.skills = [];
          this.router.navigate(['/employee-list']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error saving employee:', err);
        }
      });
    } else {
      this.employeeService.updateEmployee(this.employee).subscribe({
        next: (res: Employee) => {
          console.log('Updated:', res);
          this.router.navigate(['/employee-list']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating employee:', err);
        }
      });
    }
  }
}
