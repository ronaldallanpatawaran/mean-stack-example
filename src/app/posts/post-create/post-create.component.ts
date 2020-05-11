import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';

import { PostsService } from '../post.service'
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  insertTitleLabel = 'Post Title'
  insertContentLabel = 'Post Content'
  errorTitleLabel = 'Please insert a valid title'
  errorContentLabel = 'Please insert a valid title'
  post: Post
  isLoading = false
  form: FormGroup

  private mode = 'create'
  private postId: string

  constructor (
    public postsService: PostsService,
    public route: ActivatedRoute
    ) {}

  ngOnInit () {
    const vm = this
    vm.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required]})
    })
    vm.route.paramMap.subscribe((paramMap)=> {
      if (paramMap.has('postId')) {
        vm.mode = 'edit'
        vm.postId = paramMap.get('postId')
        vm.isLoading = true
        this.postsService.getPost(vm.postId).subscribe(postData => {
          vm.isLoading = false
          vm.post = { id: postData.posts._id, title: postData.posts.title, content: postData.posts.content }
          vm.form.setValue({
            title: vm.post.title,
            content: vm.post.content
          })
        })
      } else {
        vm.mode = 'create'
        vm.postId = null
      }
    })
  }

  onImagePicked (event: Event){
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({ image: file })
    this.form.get('image').updateValueAndValidity()
  }

  onSavePost () {
    const vm = this
    if (vm.form.invalid) {
      return
    }
    vm.isLoading = true
    if (vm.mode === 'create') {
      vm.postsService.addPost(vm.form.value.title, vm.form.value.content)
    } else {
      vm.postsService.updatePost(
        vm.postId,
        vm.form.value.title,
        vm.form.value.content
      )
    }
    vm.form.reset()
  }
}
