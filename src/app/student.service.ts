// student.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string | null;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  //private base = 'http://localhost:9090/api/students';
  private base = 'http://192.168.31.205:9090/api/students';
  
  constructor(private http: HttpClient) {}

  create(data: { firstName: string; lastName: string; email: string; photo?: File | null }): Observable<Student> {
    const form = new FormData();
    form.append('firstName', data.firstName);
    form.append('lastName', data.lastName);
    form.append('email', data.email);
    if (data.photo) form.append('photo', data.photo);
    return this.http.post<Student>(this.base, form);
  }

  list(): Observable<Student[]> {
    return this.http.get<Student[]>(this.base);
  }
}
