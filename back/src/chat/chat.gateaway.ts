import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway(4001)
export class ChatGateaway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    constructor(private readonly chatService: ChatService){}

    @WebSocketServer() wss: Server;

    private logger: Logger = new Logger('ChatGateaway');
    
    afterInit(server: Server) {
        this.logger.log('Initialized!');
    }
    
    handleConnection(client: Socket, ...args: any[]) {
       this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
       this.logger.log(`Client disconnected: ${client.id}`);
    } 
    
    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, receiv:any) {
        if (receiv.message) {
            this.chatService.saveMessage(receiv);
        }
        this.wss.emit('msgToClient', receiv);
    }

    @SubscribeMessage('joinAllRooms')
    handleJoinAllRooms(client: Socket, param:any) {
        const part = this.chatService.findRoomsToJoin(param)
        .then((part) => {
            part.forEach((user) => {
                client.join(user.conversation.name);
            })
        });
    }

    @SubscribeMessage('mute')
    async handleMute(client:Socket, param:any) {
        if (param) {
            const response = await this.chatService.muteFromRoom(param);
            this.wss.emit('mute', response)
        }
    }

    @SubscribeMessage('ban')
    async handleBan(client:Socket, param:any) {
        if (param) {
            const response = await this.chatService.banFromRoom(param);
            this.wss.emit('ban', response)
        }
    }

    @SubscribeMessage('admin')
    async handleAdmin(client:Socket, param) {
        if (param) {
            const response = await this.chatService.setAdmin(param);
            this.wss.emit('admin', response)
        }
    }

    @SubscribeMessage('privateRoom')
    async handlePrivateRoom(client:Socket, param:any) {
        if (param) {
            const response = await this.chatService.createPrivateConversation(param);
            this.wss.emit('privateRoom', response)
        }
    }

    @SubscribeMessage('inviteToPlay')
    async inviteToPlay(client:Socket, param:any) {
        if (param) {
            this.wss.emit('inviteToPlay', param)
        }
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string, roomPass: string) {
        client.join(room);
        this.wss.to(room).emit('connectToRoom', client.id+" You are in room no. ", "70");
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string) {;
        client.leave(room);
        this.wss.to(room).emit('DiscoonectToRoom', client.id+" You are in room no. ", "70");
    }
}