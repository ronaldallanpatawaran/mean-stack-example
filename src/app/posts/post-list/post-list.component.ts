import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'

import { Post } from '../post.model';
import { PostsService } from '../post.service'

@Component({
  selector: 'post-app-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postsSubs: Subscription

  buttonEditTxt = 'Edit'
  buttonDeleteTxt = 'Delete'
  posts: Post[] = []
  noPostYetMessage = 'No post yet here.'
  isLoading = false

  constructor (public postsService: PostsService) {}

  ngOnInit () {
    this.isLoading = true
    this.postsService.getPosts()
    this.postsSubs = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[])=> {
        this.isLoading = false
        this.posts = posts
        console.log(this.posts)
      })
  }

  onDelete (id: string) {
    this.postsService.deletePost(id)
  }

  ngOnDestroy () {
    this.postsSubs.unsubscribe()
  }
}
