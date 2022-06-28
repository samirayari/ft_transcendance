import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { conversationsDto } from './dto/conversations.dto';
import { Conversation } from './entities/conversation.entity';
import { Participants } from './entities/participants.entity';
import { Messages } from './entities/messages.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(Participants)
        private readonly participantsRepository: Repository<Participants>,
        @InjectRepository(Messages)
        private readonly messagesRepository: Repository<Messages>,

    ){}

    async createConversation(conversation:conversationsDto) {
        const isExist = await this.conversationRepository.findOne({ name:conversation.name })
		if (isExist)
			return false;
        if (conversation.password && conversation.password.length < 7)
            return {passError:"The password must contain at least 7 characters"}
        const user = await this.userRepository.findOne({id:conversation.userid});
        const salt = await bcrypt.genSalt();
		const password = conversation.password;
		const hash = await bcrypt.hash(password, salt);
        conversation.password = hash;
        const conv = this.conversationRepository.create(conversation);
        const conversationResponse = await this.conversationRepository.save(conv);
        const partInfos = {user:user, conversation:conversationResponse, ban:false, owner:true, join:true, admin:true, mute:false, block:false, mutedTime:"", timeToMute:""}
        const part =  this.participantsRepository.create(partInfos);
        const participantsResponse = await this.participantsRepository.save(part);

        return {conversationResponse, participantsResponse};
    }

    async loginRoom(id:any, password:string) {
		const conv = await this.conversationRepository.findOne({id});
		if (conv) {
			const isMatch = await bcrypt.compare(password, conv.password);
			if (isMatch) {
				return true;
            }
		}
		return false
	}

    async createPrivateConversation(param:any) {

        const user1 = await this.userRepository.findOne({id:param.sessionId});
        const user2 = await this.userRepository.findOne({id:param.userId});
        const getAllRooms = await this.conversationRepository.find();
        let double = false;

        if (user1.username == user2.username)
            return ;
        getAllRooms.forEach((room:any) => {
            let username1:any;
            let username2:any;
            if (room.messagetype == "privateRoom") {
                room.participants.forEach((part:any, id:number) => {
                    if (id == 0)
                        username1 = part.user.username;
                    if (id == 1)
                        username2 = part.user.username;
                    if ((user1.username == username1 && user2.username == username2) 
                        || (user1.username == username2 && user2.username == username1)) {
                        double = true;
                        return ;
                    }
                })
            }
        }) 
        if (double)
            return ;
        const convInfos = {name:user1.username + user2.username, visibility:false, messagetype:"privateRoom", status:"public", password:"none"}
        const conv = this.conversationRepository.create(convInfos);
        const conversationResponse = await this.conversationRepository.save(conv);
        const part1Infos = {user:user1, conversation:conv, ban:false, owner:true, join:true, admin:true, mute:false, block:false, mutedTime:"", timeToMute:""}
        const part2Infos = {user:user2, conversation:conv, ban:false, owner:true, join:true, admin:true, mute:false, block:false, mutedTime:"", timeToMute:""}
        const part1 = this.participantsRepository.create(part1Infos);
        const part2 = this.participantsRepository.create(part2Infos);
        
        const part1Response =  this.participantsRepository.save(part1);
        const part2Response =  this.participantsRepository.save(part2);
        return {conversationResponse, part1Response, part2Response};
    }

    findAllRooms() {
        const response = this.conversationRepository.find();
        return response;
    }

    async saveMessage(param:any) {

        const user = await this.userRepository.findOne({username:param.username});
        const conv = await this.conversationRepository.findOne({id:param.room});
        const msg = {message:param.message, user:user, conversation:conv, date:param.date};
        const message = this.messagesRepository.create(msg);
        const messageResponse = await this.messagesRepository.save(message);

        return messageResponse;
    }

    async findRoomsToJoin(param:any) {
        const user = await this.userRepository.findOne({id:param.userid});
        const part = await this.participantsRepository.find({
            where:{user},
            relations:["conversation"],
        });
        return part;
    }
    
    async join(id:any, param:any) {
        let double = false;
        let partid:number;
        let isjoin = false;
        const user = await this.userRepository.findOne({id:param.userid});
        const conv = await this.conversationRepository.findOne({id:id});
        conv.participants.forEach((part:any, id:number) => {
            if (user.username == part.user.username) {
                double = true;
                partid = part.id;
            }
            if (part.join)
                isjoin = true;
        })
        if (!double) {
            let partInfos:any;
            if (!conv.participants.length || !isjoin)
                partInfos = {user:user, conversation:conv, ban:false, owner:true, join:true, admin:true, mute:false, block:false, mutedTime:"", timeToMute:""}
            else
                partInfos = {user:user, conversation:conv, ban:false, owner:false, join:true, admin:false, mute:false, block:false, mutedTime:"", timeToMute:""}
            const part = this.participantsRepository.create(partInfos);
            const participantsResponse = await this.participantsRepository.save(part);
            return participantsResponse;
        }
        else {
            const part = await this.participantsRepository.findOne({id:partid});
            part.join = true;
            const response = await this.participantsRepository.save(part);
            return response;
        }
    }

    async quit(id:any, param:any) {
        
        let partId:any;
        const user = await this.userRepository.findOne({id:param.userid});
        const conv = await this.conversationRepository.findOne({id:id})
        conv.participants;
        for (let i = 0; i < conv.participants.length; i++) {
            if (conv.participants[i].user.id == user.id)
                partId = conv.participants[i].id;
        }
        await this.participantsRepository.delete({id:partId});
        
        return conv; 
    }

    async getRoomById(id:any) {
        const conv = await this.conversationRepository.find({id:id});
       
        return conv;
    }

    async getRoomMessages(id:any) {
        let messages:any;
        const conv = await this.conversationRepository.find({id:id})
        conv.forEach((conv:any) => {
            messages = conv.messages;
        })
        const messageList:any = [];
        messages.forEach((msg:any) => {
            const temp = {username:msg.user.username, img:msg.user.picture, message:msg.message, date:msg.date}
            messageList.push(temp);
        })
      
        return messageList
    }

    async getUser(param:any) {
        const user = await this.userRepository.findOne({username:param.username});

        return user;
    }

    async banFromRoom(param:any) {
        const participant = await this.participantsRepository.findOne({id:param.user.id})
        const conv = await this.conversationRepository.findOne({id:param.user.roomId})
        let autoriseToBan = true;
        conv.participants.forEach((part:any) => {
            if (part.user.id == param.sessionId) {
                if (!part.owner && part.admin && !participant.owner && participant.admin) {
                    autoriseToBan = false;
                    return ;
                }
            }
        })
        if (!autoriseToBan)
            return ;
        if (participant && !participant.owner) {
            participant.ban = true;
            participant.join = false;
            if (participant.admin == true) 
                participant.admin = false
            const part = this.participantsRepository.save(participant);
            const response = {userId:(await part).user.id, partId:(await part).id, isBan:(await part).ban, roomId:param.user.roomId, roomname:param.roomname}
            return response;
        }
    }

    async getParticipant(id:any) {
        const part = this.participantsRepository.findOne({id:id.id})
        return part;
    }

    async debanFromRoom(id:any) {
        const participant = await this.participantsRepository.findOne({id:id})

        if (participant)
            participant.ban = false;
        const response = this.participantsRepository.save(participant);

        return response;
    }

    async blockFromRoom(id:any) {
        const participant = await this.participantsRepository.findOne({id:id})
        if (participant) 
            participant.block = true;
        const response = this.participantsRepository.save(participant);

        return response;
    }

    async muteFromRoom(param:any) {
        const participant = await this.participantsRepository.findOne({id:param.id})
       
        if (!participant.owner) {
            if (param.isMuted) {
                participant.mute = false;
                participant.timeToMute = "";
                participant.mutedTime = ""
            }
            else {
    
                participant.mute = true;
                participant.timeToMute = param.time;
                participant.mutedTime = param.currentTime;
            }
        }
        const response = this.participantsRepository.save(participant);

        return response;
    }

    async unmuteParticipants(param:any) {
        const participants = await this.participantsRepository.find()
        participants.forEach((part:any, id:number) => {
            if (part.mute) {
                const mutedTime = part.mutedTime;
                const timeToMute = part.timeToMute;
                const currentMinutes = parseInt(param.currentTime.split(":")[0]) * 60 + parseInt(param.currentTime.split(":")[1])
                const currentSecondes = currentMinutes * 60 + parseInt(param.currentTime.split(":")[2]);
                const hoursToMinutes = parseInt(mutedTime.split(":")[0]) * 60 + parseInt(mutedTime.split(":")[1])
                const mutedSeconds = hoursToMinutes * 60 + parseInt(mutedTime.split(":")[2]);
                const timer = parseInt(timeToMute.split(":")[0]) * 60 + parseInt(timeToMute.split(":")[1])
                if (currentSecondes - mutedSeconds > timer) {
                    part.mute = false;
                    part.timeToMute = "";
                    part.mutedTime = "";
                    this.participantsRepository.save(part);
                }
            }
        })
        return participants;
    }

    async setAdmin(param:any) {
        const participant = await this.participantsRepository.findOne({id:param.id})
        
        if (participant.owner)
            return ;
        if (participant) {
            if (!param.toggleAdminIcone)
                participant.admin = true;
            else
                participant.admin = false;
        }
        await this.participantsRepository.save(participant);
        const response = await this.conversationRepository.find({id:param.roomid})
        return response;
    }

    async editRoom(id:any, param:any) {
        const isExist = await this.conversationRepository.find({ name:param.newName })
		if (isExist.length != 0) {
			return false;
        }
        const conv = await this.conversationRepository.findOne({id:id});
        if (param.newPass && (param.newPass.length < 7))
            return {passError:"The password must contain at least 7 characters"}
        if (conv) {
            if (param.newName)
                conv.name = param.newName;   
            if (param.newPass.length) {
                const salt = await bcrypt.genSalt();
                const password = param.newPass;
                const hash = await bcrypt.hash(password, salt);
                conv.password = hash;
            }
            if (conv.status == "private" && param.status) {
                conv.status = "public";
                conv.password = "";
            }
            else if (conv.status == "public" && param.status && param.newPass) {
                conv.status = "private";
            }
            const response = this.conversationRepository.save(conv);

            return response;
        }

    }
}