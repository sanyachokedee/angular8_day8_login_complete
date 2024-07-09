import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import {
  MatCard,
  MatCardImage,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { Meta } from '@angular/platform-browser';

// Dialog
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [
    MatCard,
    MatCardImage,
    MatCardHeader,
    MatCardTitle,
    FormsModule,
    ReactiveFormsModule,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    MatIconButton,
    MatCardActions,
    MatButton,
  ],
})
export class RegisterComponent implements OnInit {

  private auth = inject(AuthService)
  
  registerForm!: FormGroup;
  submitted: boolean = false;

  // Variables สำหรับรับค่าจากฟอร์ม
  userData = {
    username: '',
    email: '',
    password: '',
  };

  // สำหรับซ่อนแสดง password
  hide = true;

  // MatDialog
  private dialog = inject(MatDialog)
  private http = inject(UserService)

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    // กำหนด Meta Tag description
    this.meta.addTag({
      name: 'description',
      content: 'Login page for Stock Management',
    });

    // Validate form
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  

     // เช็คว่าถ้า Login อยู่แล้วให้ Redirect ไปหน้า Dashboard
     if (this.auth.isLoggedIn()) {
      window.location.href = '/dashboard'
    }
  }

  // ฟังก์ชัน Submit สำหรับ Register
  submitRegister() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    } else {
      this.userData.username = this.registerForm.value.username;
      this.userData.email = this.registerForm.value.email;
      this.userData.password = this.registerForm.value.password;

      console.log(this.userData);


       // เรียกใช้งาน Service สำหรับ Login
       this.http.Register(this.userData).subscribe({
        next: (data: any) => {
          // console.log(data)
          if(data.status  != "success"){

            // show dialog
            this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'เข้าสู่ระบบสำเร็จ',
                icon: 'check_circle',
                iconColor: 'green',
                subtitle: 'กำลังเปลี่ยนหน้าไปหน้าหลัก...',
              },
              // disableClose: true,
            })                   

            // ส่งไปหน้า Home
            // delay 2 วินาที
            setTimeout(() => {
              // Redirect ไปหน้า backend
              window.location.href = '/login'
            }, 2000)
          }
        },
        error: (error) => {
          console.log(error)
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'มีข้อผิดพลาด',
              icon: 'error',
              iconColor: 'red',
              subtitle: 'ไม่าสามารถลงทะเบียนได้',
            },
            disableClose: true,
          })
        }
      })
    }
  }  

  onClickCancel() {
    this.router.navigate(['/login']);
  }
}
