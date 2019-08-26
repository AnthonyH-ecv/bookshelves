import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private autService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  onSubmit() {
    const firstName = this.signUpForm.get('firstName').value;
    const lastName = this.signUpForm.get('lastName').value;
    const email = this.signUpForm.get('email').value;
    const password =  this.signUpForm.get('password').value;
    const newUser = new UserModel(firstName, lastName);
    this.autService.signUp(email, password, newUser)
    .then(
      () => {
        this.router.navigate(['/books']);
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
}
