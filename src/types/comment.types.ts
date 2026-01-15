type IComment = {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
}

export default IComment;