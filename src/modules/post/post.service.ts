import {
  CommentStatus,
  Post,
  PostStatus,
  Prisma,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

//create a post service

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  return result;
};

//get post

const getAllPost = async (payload: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: Prisma.PostWhereInput[] = [];
  if (payload.search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: payload.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search,
            mode: "insensitive",
          },
        },
        {
          //this is array. so contains will not work
          tags: {
            has: payload.search,
          },
        },
      ],
    });
  }

  if (payload.tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: payload.tags,
      },
    });
  }

  if (typeof payload.isFeatured === "boolean") {
    andConditions.push({ isFeatured: payload.isFeatured });
  }

  if (payload.status) {
    andConditions.push({ status: payload.status });
  }

  if (payload.authorId) {
    andConditions.push({ authorId: payload.authorId });
  }

  const page = payload.page;
  const limit = payload.limit;

  const result = await prisma.post.findMany({
    take: limit,
    skip: payload.skip,
    where: {
      //and logic. if search not available it will skip the search and go for tags
      AND: andConditions,
    },
    orderBy: {
      [payload.sortBy]: payload.sortOrder,
    },
    include: {
      _count: {
        select: {comments: true}
      }
    }
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

//get post by id

const getPostById = async (id: string) => {
  //transaction and roll back
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        comments: {
          where: {
            parent: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { createdAt: "asc" },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          //count total comment
          select: {comments: true}
        }
      },
    });
    return postData;
  });
  return result;
};


//get my post

const getMyPost = async(authorId: string)=>{
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE"
    },
    select: {
      id: true
    }
  });
    
   
    const results = await prisma.post.findMany({
      where: {
        authorId: authorId
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    // const total = await prisma.post.count({
    //   where:{
    //     authorId: authorId
    //   }
    // })

    const total = await prisma.post.aggregate({
      _count:{
        id: true
      },
      where: {
        authorId:authorId
      }
    })

    return {
      results,
      total
    };

}

export const PostService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost
};
