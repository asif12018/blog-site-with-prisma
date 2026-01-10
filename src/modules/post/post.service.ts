import { Post, PostStatus, Prisma } from "../../../generated/prisma/client";
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

  if (payload.authorId){
    andConditions.push({authorId: payload.authorId})
  }

  const result = await prisma.post.findMany({
    where: {
      //and logic. if search not available it will skip the search and go for tags
      AND: andConditions,
    },
  });
  return result;
};

export const PostService = {
  createPost,
  getAllPost,
};
