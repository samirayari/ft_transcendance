import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { userDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    userRepository: any;
    blockService: any;

    constructor(private readonly userService: UserService) { }

    @Post("register")
    async postRegister(@Body() params: userDto) {
        const response = await this.userService.create(params);
        return {
            response: response,
            message: "Your account was succesfully created !",
        }
    }

    @Post("login")
    async postLogin(@Body() { email, password }) {
        const response = await this.userService.login(email, password);
        return {
            response: response,
        }
    }

    @Post("loginWithFortyTwo")
    async postLoginWithFortyTwo(@Body() { id, username, name, email, picture, enable2FA, secretAuth, status, authenticate, isFirst, rank, friends }) {
        const response = await this.userService.loginWithFortyTwo(id, username, name, email, picture, enable2FA, secretAuth, status, authenticate, isFirst, rank, friends)
        return {
            response: response,
        }
    }

    @Post("upload")
    @UseInterceptors(FileInterceptor("image", {
        storage: diskStorage({
            destination: "./upload", filename: (req, file, callback) => {
                let fileName = (Math.random() + 1).toString(36).substring(7);
                callback(null, fileName + extname(file.originalname))
            }
        })
    }))
    async uploadFile(@UploadedFile() file: any, @Body() params: any) {
        if (file != undefined) {
            const response = await this.userService.modify(params.id, params.username, params.email, params.password, params.enable2FA, "http://localhost:4000/user/" + file.path)
            return {
                response: response,
            }
        }
        const response = await this.userService.modify(params.id, params.username, params.email, params.password, params.enable2FA, "")
        return {
            response: response,
        }
    }

    @Get("upload/:filename")
    async getFile(@Param("filename") filename: string, @Res() res: any) {
        res.sendFile(filename, { root: './upload' });
    }

    @Post("requestUser")
    async requestUser(@Body() { id }) {
        if (!id)
            return null
        const response = await this.userService.getUser(id)

        return {
            response: response,
        }
    }

    @Post("qrCode")
    async requestQR(@Body() { id }) {
        const response = await this.userService.getCode(id)
        return {
            response: response,
        }
    }

    @Post("disable2FA")
    async disable2FA(@Body() { id }) {
        const response = await this.userService.disable2FA(id)
        return {
            response: response,
        }
    }

    @Post("setStatus")
    async setOnOffStatus(@Body() { id }) {
        const response = await this.userService.setStatus(id);
        return {
            response: response,
        }
    }

    @Post("setIsFirst")
    async postIsFirst(@Body() { id }) {
        const response = await this.userService.setIsFirst(id);
        return {
            response: response,
        }
    }

    @Get("findUserWithEmail/:email")
    async getFindUserWithEmail(@Param() email: any) {
        const response = await this.userService.findUserWithEmail(email.email);
        return {
            response: response,
        }
    }

    @Post("setAuth")
    async setAuth(@Body() { id }) {
        const response = await this.userService.setAuth(id);
        return {
            response: response,
        }
    }

    @Post("checkCode")
    async checkCode(@Body() { id, code }) {
        const response = await this.userService.checkCode(id, code);
        return {
            response: response,
        }
    }

    @Get("getAllUser")
    async getAllUser() {
        const response = await this.userService.getAllUser();
        return {
            response: response,
        }
    }

    @Post("addFriend")
    async postAddFriend(@Body() { sessionId, friendToAdd }) {
        const response = await this.userService.addFriend(sessionId, friendToAdd);
        return {
            response: response
        }
    }

    @Post("removeFriend")
    async postRemoveFriend(@Body() { id }) {
        const response = await this.userService.removeFriend(id);
        return {
            response: response
        }
    }

    @Post("statusAddFriend")
    async statusAddFriend(@Body() { id, status }) {
        const response = await this.userService.statusAddFriend(id, status);
        return {
            response: response
        }
    }

    @Post("getFriends")
    async getFriends(@Body() { id, status }) {
        const response = await this.userService.getFriends(id, status);
        return {
            response: response
        }
    }

    @Post("isFriend")
    async isFriend(@Body() { idSession, idFriend }) {
        const response = await this.userService.isFriend(idSession, idFriend);
        return {
            response: response
        }
    }

    @Post("getNotif")
    async getNotif(@Body() { id }) {
        const response = await this.userService.getNotif(id);
        return {
            response: response
        }
    }

    @Post("block")
    async block(@Body() param) {
        const response = await this.userService.blockUser(param)
        return response;
    }

    @Get("getBlockList")
    async blockList() {
        const response = await this.userService.getBlockList();
        return response;
    }
}
