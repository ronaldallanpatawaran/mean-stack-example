import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { Post } from './post.model'

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>()

  constructor (private http: HttpClient, private router: Router) {}

  getPosts (page?: number, pageSize?: number) {
    let qs = ''
    if (page && pageSize) {
      qs = `?page=${page}&pageSize=${pageSize}`
    }
    this.http.get<{ message: string, posts: any, postCount: number }>(`${environment.apiUrl}/posts` + qs)
      .pipe(
        map((postData)=> {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator
              }
            }),
            postCount: postData.postCount
          }
        })
      )
      .subscribe((transformedPosts)=> {
        this.posts = transformedPosts.posts
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPosts.postCount })
      })
  }

  getPostUpdateListener () {
    return this.postsUpdated.asObservable()
  }

  getPost (id: string) {
    return this.http.get<{ message: string, posts: { _id: string, title: string, content: string, imagePath: string, creator: string } }>(`${`${environment.apiUrl}/posts`}/${id}`)
  }

  addPost (title: string, content: string, image: File) {
    const postData = new FormData()
    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)
    this.http.post<{ message: string, post: Post }>(`${environment.apiUrl}/posts`, postData)
      .subscribe((responseData=> {
        this.router.navigate(['/'])
      }))
  }

  updatePost (id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post
    if (typeof image === 'object') {
      postData = new FormData()
      postData.append('id', id)
      postData.append('title', title)
      postData.append('content', content)
      postData.append('image', image, title)
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null
      }
    }
    this.http.patch<{ message: string, posts: Post[] }>(`${`${environment.apiUrl}/posts`}/${id}`, postData)
    .subscribe((responseData=> {
      this.router.navigate(['/'])
    }))
  }

  deletePost (id: string) {
    return this.http.delete<{ message: string, postId: string }>(`${`${environment.apiUrl}/posts`}/${id}`)
  }

}
