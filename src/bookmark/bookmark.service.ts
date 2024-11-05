import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma:PrismaService){}
    async getBookmarks(userId:number){
        this.prisma.bookmark.findMany({
            where:{
                userId
            }
        })
    }

    getBookmarksById(userId:number,bookmarkId:number){}
    
    editBookmarkById(userId:number,bookmarkId:number,dto:EditBookmarkDto){}
    
    deleteBookmarkById(userId:number,bookmarkId:number){}
    
    async createBookmark(userId:number,bookmarkId:number,dto:CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data:{
                userId,
                ...dto
            }
        })
        return bookmark;
    }
}
