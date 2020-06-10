import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { PostsService } from '../post.service'
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator'


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  insertTitleLabel = 'Post Title'
  insertContentLabel = 'Post Content'
  errorTitleLabel = 'Please insert a valid title'
  errorContentLabel = 'Please insert a valid title'
  post: Post
  isLoading = false
  form: FormGroup
  imagePreview: string

  private mode = 'create'
  private postId: string
  private authStatusSub: Subscription

  constructor (
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
    ) {}

  ngOnInit () {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(
      authStatus => {
        this.isLoading = false
      }
    )
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {
        validators: [Validators.required]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })
    this.route.paramMap.subscribe((paramMap)=> {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false
          this.post = { id: postData.posts._id, title: postData.posts.title, content: postData.posts.content, imagePath: postData.posts.imagePath, creator: postData.posts.creator }
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          })
          this.imagePreview = this.post.imagePath
        })
      } else {
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe()
  }

  onImagePicked (event: Event){
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({ image: file })
    this.form.get('image').updateValueAndValidity()
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
  }

  onSavePost () {
    const vm = this
    if (vm.form.invalid) {
      return
    }
    vm.isLoading = true
    if (vm.mode === 'create') {
      vm.postsService.addPost(vm.form.value.title, vm.form.value.content, vm.form.value.image)
    } else {
      vm.postsService.updatePost(
        vm.postId,
        vm.form.value.title,
        vm.form.value.content,
        vm.form.value.image
      )
    }
    vm.form.reset()
  }
}
