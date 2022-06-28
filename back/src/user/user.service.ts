import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, PrimaryColumnCannotBeNullableError, Repository } from 'typeorm';
import { userDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { extname } from 'path';
import { Friends } from './entities/friends.entity';
import { Block } from './entities/block.entity';
var generator = require('generate-password');
var ID = require("nodejs-unique-numeric-id-generator")
const multer = require("multer")

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Friends)
		private readonly friendsRepository: Repository<Friends>,
		@InjectRepository(Block)
		private readonly blockRepository: Repository<Block>
	) { }


	async create(userParams: userDto) {
		const usernameExist = await this.userRepository.findOne({ username: userParams.username })
		const emailExist = await this.userRepository.findOne({ email: userParams.email })
		if (usernameExist)
			return ({type: "error",
					string: "username already exists !"})
		else if (emailExist)
			return ({type: "error",
					string: "email already exists !"})
		const salt = await bcrypt.genSalt();
		const password = userParams.password;
		const hash = await bcrypt.hash(password, salt);
		userParams.password = hash;
		userParams.id = ID.generate(new Date().toJSON());
		userParams.enable2FA = false;
		userParams.status = "Offline";
		userParams.authenticate = false;
		userParams.isFirst = true;
		userParams.rank = "Bronze";
		const user = this.userRepository.create(userParams);
		user.picture = "http://localhost:4000/user/upload/defaultt.jpeg";
		user.secretAuth = "";
		const response = await this.userRepository.save(user);
		return response;
	}

	async login(email: any, password: string) {
		const user = await this.userRepository.findOne({ email });
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				user.status = "Online";
				return user;
			}
		}
		return false
	}

	async loginWithFortyTwo(id: any, username: any, name: any, email: any, picture: string, enable2FA: boolean, secretAuth: string, status: string, authenticate: boolean, isFirst: boolean, rank: string, friends: number[]) {
		const user = await this.userRepository.findOne({ id });

		if (!user) {
			enable2FA = false;
			secretAuth = "";
			status = "Online";
			authenticate = true;
			picture = "http://localhost:4000/user/upload/defaultt.jpeg";
			isFirst = true;
			rank = "Bronze";
			friends = [];

			var password = generator.generate({
				length: 10,
				numbers: true
			});
			const newUser = this.userRepository.create({ id, name, username, email, password, picture, enable2FA, secretAuth, status, authenticate, isFirst, rank })
			newUser.status = "Online";
			const response = await this.userRepository.save(newUser)
			return response;
		}
		const response = await this.userRepository.save(user)

		return response;
	}

	async modify(id: any, username: string, email: string, password: any, enable2FA: boolean, picture: string) {
		const user = await this.userRepository.findOne({ id });
		const newUser = await this.userRepository.findOne({ username });
		const newEmail = await this.userRepository.findOne({ email });
		if (newUser)
			return ({
				error: username,
				string: "Username already taken"
			})
		if (newEmail) {
			return ({
				error: email,
				string: "Email already taken"
			})
		}
		if (username)
			user.username = username;
		if (email)
			user.email = email;
		if (password) {
			const salt = await bcrypt.genSalt();
			const pass = password;
			const hash = await bcrypt.hash(pass, salt);
			user.password = hash;
		}
		if (enable2FA != undefined)
			user.enable2FA = enable2FA;
		if (picture.length > 0)
			user.picture = picture;
		const response = await this.userRepository.save(user)
		return response;
	}

	async getUser(id: any) {
		const user = await this.userRepository.findOne({ id });

		return user;
	}

	async getCode(id: any) {
		const user = await this.userRepository.findOne({ id });
		if (user && user.id) {
			user.enable2FA = true;
			let secret = speakeasy.generateSecret({ length: 20, name: "FT_TRANSCENDENCE" })
			user.secretAuth = secret.ascii;
			await this.userRepository.save(user);
			const qrcode = await QRCode.toDataURL(secret.otpauth_url);
			return qrcode;
		}
	}

	async disable2FA(id: any) {
		const user = await this.userRepository.findOne({ id });
		user.enable2FA = false;
		user.secretAuth = "";
		const response = await this.userRepository.save(user)
		return response;
	}

	async setStatus(id: any) {
		const user = await this.userRepository.findOne({ id });
		if (user) {
			if (user.status == "Offline")
				user.status = "Online";
			else
				user.status = "Offline";

			const response = await this.userRepository.save(user);
			return response;
		}
	}

	async findUserWithEmail(email: any) {
		const user = await this.userRepository.findOne({ email });
		return user;
	}

	async setAuth(id: any) {
		const user = await this.userRepository.findOne({ id });
		if (user) {
			if (user.authenticate) {
				user.isFirst = false;
				user.authenticate = false;
				user.status = "Offline";
			}
			else {
				user.authenticate = true;
				user.status = "Online";
			}
			const response = await this.userRepository.save(user)
			return response;
		}
	}

	async setIsFirst(id: any) {
		const user = await this.userRepository.findOne({ id });
		if (user) {
			if (user.isFirst) {
				user.isFirst = false;
			}
			const response = await this.userRepository.save(user)
			return response;
		}
	}

	async checkCode(id: any, code: any) {
		const user = await this.userRepository.findOne({ id });
		if (user) {
			var verify = speakeasy.totp.verify({
				secret: user.secretAuth,
				encoding: "ascii",
				token: code,
			})
			return verify
		}
		return false
	}

	async getAllUser() {
		const allUsers = await this.userRepository.find();
		if (allUsers) {

			return allUsers;
		}
	}

	async addFriend(sessionId: number, friendToAdd: number) {
		const test = await this.isRelations(sessionId, friendToAdd)
		if (!test) {
			const inviter = await this.userRepository.findOne({ id: sessionId });
			const guest = await this.userRepository.findOne({ id: friendToAdd });
			const friend = await this.friendsRepository.create();
			friend.guest = guest;
			friend.inviter = inviter;
			await this.friendsRepository.save(friend);
		}
		return null;
	}

	async isRelations(sessionId: number, friendToAdd: number) {
		const user1 = await this.userRepository.findOne({ id: sessionId })
		const user2 = await this.userRepository.findOne({ id: friendToAdd })
		const friends = await this.friendsRepository.findOne({
			where: [
				{ guest: user1, inviter: user2 },
				{ guest: user2, inviter: user1 },
			],
			relations: ['guest', 'inviter'],
			loadEagerRelations: true,
		})
		if (!friends)
			return false;
		return friends
	}

	async removeFriend(id: number) {
		const remove = await this.friendsRepository.findOne({ id })
		await this.friendsRepository.delete(remove)
		return null
	}

	async statusAddFriend(id: number, status: string) {
		const friend = await this.friendsRepository.findOne({ id })
		if (status == "decline") {
			await this.friendsRepository.delete(friend)
			return null
		}
		friend.status = status;
		await this.friendsRepository.save(friend)
		return friend;
	}

	async getFriends(id: number, status: string) {
		const user = await this.userRepository.findOne({ id })
		const friends = await this.friendsRepository.find({
			where: [
				{ guest: user, status: status },
				{ inviter: user, status: status },
			],
			relations: ['guest', 'inviter'],
			loadEagerRelations: true,
		})
		return friends;
	}

	async isFriend(idSession: number, idFriend: number) {
		const user = await this.userRepository.findOne({ id: idSession });
		const friend = await this.userRepository.findOne({ id: idFriend });
		const friends = await this.friendsRepository.findOne({
			where: [
				{ guest: user, status: "accepted", inviter: friend },
				{ guest: friend, status: "accepted", inviter: user },
			],
			relations: ['guest', 'inviter'],
			loadEagerRelations: true,
		})

		if (!friends)
			return false
		return friends
	}

	async getNotif(id: number) {
		const user = await this.userRepository.findOne({ id })

		const friends = await this.friendsRepository.find({
			where: [
				{ guest: user, status: "waiting" },
			],
			relations: ['guest', 'inviter'],
			loadEagerRelations: true,
		})
		return friends
	}

	async blockUser(param: any) {
		const blockList = await this.blockRepository.find();
		if (param.idSession != param.idToBlock && param.block) {
			for (let i = 0; i < blockList.length; i++) {
				if (blockList[i].userToBlock.id == param.idToBlock && blockList[i].userWhoBlock == param.idSession)
					return blockList;
			}
			const userToBlock = await this.userRepository.findOne({ id: param.idToBlock })
			const infosForBlock = { userWhoBlock: param.idSession, userToBlock: userToBlock }
			const blocked = this.blockRepository.create(infosForBlock);
			const response = await this.blockRepository.save(blocked);
			return response;
		}
		else if (param.block == false) {
			for (let i = 0; i < blockList.length; i++) {
				if (blockList[i].userWhoBlock == param.idSession && blockList[i].userToBlock.id == param.idToBlock) {
					await this.blockRepository.delete({ id: blockList[i].id })
					return blockList;
				}
			}
		}
	}

	async getBlockList() {
		const blockList = await this.blockRepository.find();

		if (blockList) {
			return blockList;
		}
	}
}