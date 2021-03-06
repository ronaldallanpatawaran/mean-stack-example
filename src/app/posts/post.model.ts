export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}

export interface Paginator {
  length: number;
  pageSize: number;
  pageIndex: number;
  previousPageIndex: number;
}
