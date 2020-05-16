import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'

import { Post, Paginator } from '../post.model';
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
  postPerpage = 2
  currentPage = 1
  totalPosts = 0
  pageSizeOption = [1, 2, 5, 10]

  constructor (public postsService: PostsService) {}

  ngOnInit () {
    this.isLoading = true
    this.postsService.getPosts(this.currentPage, this.postPerpage)
    this.postsSubs = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number })=> {
        this.isLoading = false
        this.totalPosts = postData.postCount
        this.posts = postData.posts
      })
  }

  onDelete (id: string) {
    this.isLoading = true
    this.postsService.deletePost(id).subscribe(()=>{
      this.isLoading = false
      this.postsService.getPosts(this.currentPage, this.postPerpage)
    })
  }

  onChangedPage (event: Paginator) {
    const pageSize = event.pageSize
    const currentPage = event.pageIndex + 1
    this.isLoading = true
    this.postsService.getPosts(currentPage, pageSize)
    this.postsSubs = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number })=> {
        this.isLoading = false
        this.posts = postData.posts
      })
  }

  ngOnDestroy () {
    this.postsSubs.unsubscribe()
  }
}
