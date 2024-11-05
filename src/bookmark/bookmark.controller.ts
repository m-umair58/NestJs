import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
    constructor(private bookmarkService:BookmarkService){}
    @Get()
    getBookmarks(@GetUser('id') userId:number){
        return this.bookmarkService.getBookmarks(userId)
    }
    @Get(':id')
    getBookmarksById(@GetUser('id') userId:number, @Param('id') bookmarkId:number){
        return this.bookmarkService.getBookmarksById(userId,bookmarkId)
    }
    @Patch(':id')
    editBookmarkById(@GetUser('id') userId:number, @Param('id') bookmarkId:number,@Body() dto:CreateBookmarkDto){
        return this.bookmarkService.editBookmarkById(userId,bookmarkId,dto)
    }
    @Delete(':id')
    deleteBookmarkById(@GetUser('id') userId:number, @Param('id') bookmarkId:number){}
    @Post(':id')
    createBookmark(@GetUser('id') userId:number, @Param('id') bookmarkId:number){
        return this.bookmarkService.getBookmarksById(userId,bookmarkId)
    }

}
