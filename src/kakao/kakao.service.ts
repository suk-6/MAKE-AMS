import { Injectable } from '@nestjs/common';
import { kakaoBlocks } from './kakao.blocks';
import { KakaoUserModel } from './kakao.interface';
import {
    checkAdminByIDDecorator,
    checkUserDictDecorator,
    checkUserInDictDecorator,
} from './kakao.decorator';
import { KakaoModals } from './kakao.modals';

@Injectable()
export class KakaoService {
    constructor() {}

    private headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.KAKAOBOT_API_KEY}`,
    };
    public userDict: object = {};

    private async sendGET(params: string) {
        const res = await fetch(`${process.env.KAKAOBOT_API_URL}/${params}`, {
            method: 'GET',
            headers: this.headers,
        });
        if (!res.ok) throw new Error('Failed to send GET request');

        return res.json();
    }

    private async sendPOST(params: string, body: any) {
        const res = await fetch(`${process.env.KAKAOBOT_API_URL}/${params}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to send POST request');

        return res.json();
    }

    public async getUser(userID: number): Promise<KakaoUserModel> {
        const data = await this.sendGET(`users.info?user_id=${userID}`);
        if (!data.success) throw new Error('Failed to fetch user info');

        return data.user;
    }

    public async getUserIDAll(): Promise<number[]> {
        const data = await this.sendGET(`users.list?limit=100`);
        if (!data.success) throw new Error('Failed to fetch user list');

        return data.users
            .map((user: any) => {
                if (user.department !== 'Teacher') return parseInt(user.id);
            })
            .filter((id: number) => id)
            .filter((id: number) => id === 10203314);
    }

    public async sendCode(userID: number, code: string) {
        const body = {
            conversation_id: await this.getConversation(userID),
            text: `새로운 QR 코드가 발급되었습니다.`,
            blocks: kakaoBlocks.viewQR(code),
        };

        if (await this.checkAdminByID(userID))
            body.blocks.push(kakaoBlocks.adminButton(userID.toString()));

        this.sendPOST('messages.send', body);
    }

    public async checkAdminByID(userID: number): Promise<boolean> {
        const user = await this.getUser(userID);
        return user.position === '선생님' || user.position === '관리자';
    }

    public async getConversation(userID: number): Promise<number> {
        const body = { user_id: userID };
        const data = await this.sendPOST('conversations.open', body);
        if (!data.success) throw new Error('Failed to open conversation');

        return data.conversation.id;
    }

    public async createUserDict() {
        const userIDs = await this.getUserIDAll();
        for (const userID of userIDs) {
            this.userDict[userID] = await this.getConversation(userID);
        }
    }

    @checkUserDictDecorator
    public async generationMessageAll() {
        for (const userID of Object.keys(this.userDict)) {
            this.sendPOST('messages.send', {
                conversation_id: this.userDict[userID],
                text: '메이커스페이스 출입 QR을 발급받으세요.',
                blocks: kakaoBlocks.sendQR(userID),
            });
        }
    }

    @checkAdminByIDDecorator
    @checkUserInDictDecorator
    public async sendAdminMenu(userID: number) {
        await this.sendPOST('messages.send', {
            conversation_id: this.userDict[userID],
            text: '관리자 메뉴',
            blocks: kakaoBlocks.adminMenu,
        });
    }

    public async resQRManagementModal() {
        return KakaoModals.sendQRMessage('qr_modal');
    }
}
