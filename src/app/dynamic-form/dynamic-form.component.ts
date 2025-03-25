import { Component, DestroyRef, HostListener, input, OnChanges, OnInit } from '@angular/core';
import { FormConfig } from '../models/form.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DynamicFieldComponent } from "../dynamic-field/dynamic-field.component";
import { MatButtonModule } from '@angular/material/button';
import { FormService } from '../services/form.service';
import { CommonModule } from '@angular/common';
import { DependencyService } from '../services/dependency.service';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, DynamicFieldComponent, CommonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit, OnChanges {
  constructor(
    private formService: FormService, 
    private dependencyService: DependencyService, 
    private destroyRef: DestroyRef,
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  autoSaveForm = new FormGroup({
    autosave: new FormControl(false)
  })
  jsonFormVisible = true
  jsonForm = input<FormConfig>()
  dynamicForm = new FormGroup({})
  fetchedData: any | null = null
  jsonServerDown = false

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event) {
    if (localStorage.getItem('autosave') == 'true') {
      localStorage.setItem('initialForm', JSON.stringify(this.jsonForm()))
      this.formService.fillAllFields(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups)
      localStorage.setItem('filledForm', JSON.stringify(this.jsonForm()))
    }
    else {
      localStorage.removeItem('autosave')
      localStorage.removeItem('initialForm')
      localStorage.removeItem('filledForm')
    }
  }

  updateAutosave() {
    this.autoSaveForm.controls.autosave.updateValueAndValidity()
    localStorage.setItem('autosave', this.autoSaveForm.controls.autosave.value!.toString())
  }

  ngOnInit() {
    this.formService.generateForm(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups)
    this.evaluateGroupDependencies()
    this.formsSubscription()
    this.http.get('http://localhost:3000/data').subscribe({
      next: (data) => {
        this.fetchedData = data
      },
      error: () => {
        this.jsonServerDown = true
      }
    })
    if (localStorage.getItem('autosave') == 'true') {
      this.autoSaveForm.controls.autosave.setValue(true)
      this.apiService.autoFillFromLocalStorage(this.dynamicForm, JSON.parse(localStorage.getItem("filledForm")!))
    }
  }

  ngOnChanges() {
    if (this.dynamicForm) {
      Object.keys(this.dynamicForm.controls).forEach(key => {
        this.dynamicForm.removeControl(key);
      });
    }
    this.dynamicForm = new FormGroup({});
    this.evaluateGroupDependencies()
    this.formsSubscription()
  }

  formsSubscription() {
    this.formService.generateForm(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups);
    const formSubscription = this.dynamicForm.valueChanges.subscribe(() => {
      this.evaluateGroupDependencies()
    })
    this.destroyRef.onDestroy(() => formSubscription.unsubscribe())
  }

  getControl(name: string): FormControl {
    return this.dynamicForm.get(name) as FormControl;
  }

  isGroupVisible(group: any): boolean {
    return !group.isHidden;
  }

  changeJsonFormVisibility() {
    this.jsonFormVisible = !this.jsonFormVisible
  }

  autoFillForm() {
    this.apiService.autofill(this.dynamicForm, this.fetchedData!)
  }

  evaluateGroupDependencies() {
    const groups = this.jsonForm()?.groups;
    if (!groups) return;
    
    groups.forEach(group => {
      group.isHidden = false;
      
      if (!group.dependencies || group.dependencies.length === 0) {
        return;
      }
      
      group.isHidden = this.dependencyService.groupDependencies(group, this.dynamicForm)
    });
  }

  submitForm(event: Event) {
    event.preventDefault()

    this.formService.fillAllFields(this.dynamicForm, this.jsonForm()?.fields, this.jsonForm()?.groups)

    console.log(this.jsonForm())
    console.log(`Output form: ${JSON.stringify(this.jsonForm())}`)
  }
}