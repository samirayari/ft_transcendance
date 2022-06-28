import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { response } from 'express';
import { ChatService } from './chat.service';
import { conversationsDto } from './dto/conversations.dto';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}

    
    @Get("room/all")
    async getAllRooms() {
        const response = await this.chatService.findAllRooms();
        return {response:response}
    }
    
    @Get("/room/messages/:id")
    async getMessages(@Param() id:any) {
        const response = await this.chatService.getRoomMessages(id.id)
        
        return {response}
    }    
    
    @Get("room/:id")
    async getRoomById(@Param() id:any) {
        const response = await this.chatService.getRoomById(id.id);
        return {response:response}
    }

    @Post("room/checkpass")
    async checkpassword(@Body() {id, password}) {
        const response = await this.chatService.loginRoom(id, password);
        return {response:response}
    }

    @Post("room/participant")
    async getPart(@Body() id:any) {
        const response = await this.chatService.getParticipant(id);
        return {response:response};
    }

    @Post("room/addMessage")
    async addMessage(@Body() param:any) {
        const response = await this.chatService.saveMessage(param);
        
        return {response:response}
    }
    

    @Post("room/create")
    async createConversation(@Body() params:conversationsDto) {
        
        const response = await this.chatService.createConversation(params);

        return {response:response, message:"Your room is created!"}
    }
    
    @Post("room/quit/:id")
    async quitRoom(@Param() id:any, @Body() param) {
        const response = await this.chatService.quit(id.id, param);
        return {response:response}
    }

    @Post("room/join/:id")
    async joinRoom(@Param() id:any, @Body() param) {
        const response = await this.chatService.join(id.id, param)

        return {response:response}
    }

    // @Post("room/ban/:id")
    // async ban(@Param() id:any, @Body() param) {
    //     const response = await this.chatService.banFromRoom(id.id, param)

    //     return {response:response}
    // }

    @Post("room/deban/:id")
    async deban(@Param() id:any) {
        const response = await this.chatService.debanFromRoom(id.id)

        return {response:response}
    }

    @Post("room/block/:id")
    async block(@Param() id:any) {
        const response = await this.chatService.blockFromRoom(id.id)

        return {response:response}
    }

    @Post("room/edit/:id")
    async edit(@Param() id:any, @Body() param) {
        const response = await this.chatService.editRoom(id.id, param)

        return {response:response}
    }

    @Post("room/unmute")
    async unmute(@Body() param) {
        const response = await this.chatService.unmuteParticipants(param)

        return {response:response}
    }
    
}
